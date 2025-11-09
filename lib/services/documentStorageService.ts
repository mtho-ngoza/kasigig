import { storage, db } from '@/lib/firebase'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata
} from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { VerificationDocument } from '@/types/auth'

export class DocumentStorageService {
  private static getStoragePath(
    userId: string,
    verificationLevel: string,
    documentType: string,
    fileName: string
  ): string {
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `verificationDocuments/${userId}/${verificationLevel}/${documentType}/${timestamp}_${sanitizedFileName}`
  }

  static async uploadDocument(
    userId: string,
    file: File,
    documentData: Omit<VerificationDocument, 'id' | 'fileUrl' | 'submittedAt'>
  ): Promise<VerificationDocument> {
    try {
      this.validateFile(file)

      const storagePath = this.getStoragePath(
        userId,
        documentData.verificationLevel,
        documentData.type,
        file.name
      )
      const storageRef = ref(storage, storagePath)

      const metadata = {
        contentType: file.type,
        customMetadata: {
          userId,
          documentType: documentData.type,
          verificationLevel: documentData.verificationLevel,
          originalName: file.name,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString()
        }
      }

      const uploadResult = await uploadBytes(storageRef, file, metadata)

      const downloadURL = await getDownloadURL(uploadResult.ref)

      const documentId = `doc_${userId}_${documentData.type}_${Date.now()}`
      const document: VerificationDocument = {
        ...documentData,
        id: documentId,
        fileUrl: downloadURL,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        submittedAt: new Date()
      }

      await setDoc(doc(db, 'verificationDocuments', documentId), {
        ...document,
        userId,
        storagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return document
    } catch (error) {
      console.error('Error uploading document:', error)
      throw new Error('Failed to upload document. Please try again.')
    }
  }

  static async getUserDocuments(
    userId: string,
    verificationLevel?: string
  ): Promise<VerificationDocument[]> {
    try {
      let q = query(
        collection(db, 'verificationDocuments'),
        where('userId', '==', userId)
      )

      if (verificationLevel) {
        q = query(q, where('verificationLevel', '==', verificationLevel))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          verifiedAt: data.verifiedAt?.toDate(),
          rejectedAt: data.rejectedAt?.toDate()
        } as VerificationDocument
      })
    } catch (error) {
      console.error('Error getting user documents:', error)
      throw new Error('Failed to load documents.')
    }
  }

  static async getDocument(documentId: string): Promise<VerificationDocument | null> {
    try {
      const docRef = doc(db, 'verificationDocuments', documentId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null
      }

      const data = docSnap.data()
      return {
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        verifiedAt: data.verifiedAt?.toDate(),
        rejectedAt: data.rejectedAt?.toDate()
      } as VerificationDocument
    } catch (error) {
      console.error('Error getting document:', error)
      return null
    }
  }

  static async updateDocumentStatus(
    documentId: string,
    status: 'pending' | 'verified' | 'rejected',
    notes?: string,
    reviewedBy?: string
  ): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {
        status,
        updatedAt: serverTimestamp()
      }

      if (status === 'verified') {
        updateData.verifiedAt = serverTimestamp()
      } else if (status === 'rejected') {
        updateData.rejectedAt = serverTimestamp()
      }

      if (notes) {
        updateData.notes = notes
      }

      if (reviewedBy) {
        updateData.reviewedBy = reviewedBy
      }

      await updateDoc(doc(db, 'verificationDocuments', documentId), updateData)
    } catch (error) {
      console.error('Error updating document status:', error)
      throw new Error('Failed to update document status.')
    }
  }

  static async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      const document = await this.getDocument(documentId)
      if (!document) {
        throw new Error('Document not found')
      }

      const docRef = doc(db, 'verificationDocuments', documentId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

          if (data.userId !== userId) {
          throw new Error('Unauthorized: Cannot delete document belonging to another user')
        }

        if (data.storagePath) {
          try {
            const storageRef = ref(storage, data.storagePath)
            await deleteObject(storageRef)
          } catch (storageError) {
            console.warn('Error deleting from storage (file may not exist):', storageError)
          }
        }
      }

      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting document:', error)
      throw new Error('Failed to delete document.')
    }
  }

  static async replaceDocument(
    userId: string,
    oldDocumentId: string,
    newFile: File,
    newDocumentData: Omit<VerificationDocument, 'id' | 'fileUrl' | 'submittedAt'>
  ): Promise<VerificationDocument> {
    try {
      await this.deleteDocument(oldDocumentId, userId)

      return await this.uploadDocument(userId, newFile, newDocumentData)
    } catch (error) {
      console.error('Error replacing document:', error)
      throw new Error('Failed to replace document.')
    }
  }

  private static validateFile(file: File): void {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB')
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and PDF files are allowed')
    }

    if (!file.name || file.name.length > 255) {
      throw new Error('Invalid file name')
    }
  }

  static async getSecureDocumentUrl(documentId: string, userId: string): Promise<string | null> {
    try {
      const document = await this.getDocument(documentId)
      if (!document) {
        return null
      }

      const docRef = doc(db, 'verificationDocuments', documentId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.userId !== userId) {
          throw new Error('Unauthorized access')
        }
      }

      return document.fileUrl
    } catch (error) {
      console.error('Error getting secure document URL:', error)
      return null
    }
  }

  static async getUserStorageUsage(userId: string): Promise<{ totalFiles: number; totalSize: number }> {
    try {
      const documents = await this.getUserDocuments(userId)

      return {
        totalFiles: documents.length,
        totalSize: documents.reduce((total, doc) => total + doc.fileSize, 0)
      }
    } catch (error) {
      console.error('Error getting storage usage:', error)
      return { totalFiles: 0, totalSize: 0 }
    }
  }
}