import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '@/lib/firebase'

export interface FileUploadResult {
  fileName: string
  fileUrl: string
  fileSize: number
}

export class FileService {
  static async uploadMessageFile(
    userId: string,
    conversationId: string,
    file: File
  ): Promise<FileUploadResult> {
    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB')
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${conversationId}-${uuidv4()}.${fileExtension}`
      const storageRef = ref(storage, `message-files/${fileName}`)

      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedBy': userId,
          'conversationId': conversationId,
          'originalName': file.name
        }
      }

      // Upload file
      await uploadBytes(storageRef, file, metadata)
      const downloadURL = await getDownloadURL(storageRef)

      return {
        fileName: file.name,
        fileUrl: downloadURL,
        fileSize: file.size
      }
    } catch (error) {
      console.error('Error uploading message file:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file')
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static isValidFileType(file: File): boolean {
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      // Archives
      'application/zip',
      'application/x-rar-compressed'
    ]

    return allowedTypes.includes(file.type)
  }
}