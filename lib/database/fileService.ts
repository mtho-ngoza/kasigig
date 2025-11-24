import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '@/lib/firebase'
import { sanitizeFilename, validateFileExtension } from '@/lib/utils/messageValidation'

export interface FileUploadResult {
  fileName: string
  fileUrl: string
  fileSize: number
}

export class FileService {
  static async uploadMessageFile(
    userId: string,
    conversationId: string,
    messageId: string,
    file: File
  ): Promise<FileUploadResult> {
    try {
      // Validate file size (max 25MB to match storage rules)
      const maxSize = 25 * 1024 * 1024 // 25MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 25MB')
      }

      // Validate file type against whitelist
      if (!this.isValidFileType(file)) {
        throw new Error('File type not allowed. Please upload an image, document, or archive file.')
      }

      // Validate file extension
      const extensionValidation = validateFileExtension(file.name)
      if (!extensionValidation.isValid) {
        throw new Error(extensionValidation.message || 'Invalid file extension')
      }

      // Sanitize filename to prevent path traversal and XSS
      const sanitizedOriginalName = sanitizeFilename(file.name)

      // Generate unique filename preserving extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
      const uniqueFileName = `${uuidv4()}.${fileExtension}`

      // Use path structure matching storage.rules: messages/{conversationId}/{messageId}/{fileName}
      const storageRef = ref(storage, `messages/${conversationId}/${messageId}/${uniqueFileName}`)

      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedBy': userId,
          'conversationId': conversationId,
          'messageId': messageId,
          'originalName': sanitizedOriginalName
        }
      }

      // Upload file
      await uploadBytes(storageRef, file, metadata)
      const downloadURL = await getDownloadURL(storageRef)

      return {
        fileName: sanitizedOriginalName,
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