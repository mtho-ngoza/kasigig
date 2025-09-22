'use client'

import React, { useState, useRef, useCallback } from 'react'
import { MessageInput } from '@/types/messaging'
import { Button } from '@/components/ui/Button'
import { FileService } from '@/lib/database/fileService'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'

interface MessageInputFormProps {
  onSendMessage: (message: MessageInput) => Promise<void>
  onTyping?: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
  conversationId: string
}

export function MessageInputForm({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
  conversationId
}: MessageInputFormProps) {
  const { user } = useAuth()
  const { error, success } = useToast()
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      onTyping?.(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onTyping?.(false)
    }, 1000)
  }, [isTyping, onTyping])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    if (value.trim()) {
      handleTyping()
    }

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending || disabled) return

    try {
      setIsSending(true)

      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      setIsTyping(false)
      onTyping?.(false)

      const messageInput: MessageInput = {
        content: trimmedMessage,
        type: 'text'
      }

      await onSendMessage(messageInput)

      // Clear form after successful send
      setMessage('')

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Keep the message in the input if sending failed
    } finally {
      setIsSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset file input immediately
    e.target.value = ''

    if (!user) {
      error('You must be logged in to upload files')
      return
    }

    // Validate file type
    if (!FileService.isValidFileType(file)) {
      error('File type not supported. Please upload images, documents, or archives.')
      return
    }

    try {
      setIsUploading(true)

      // Upload file to Firebase Storage
      const fileData = await FileService.uploadMessageFile(user.id, conversationId, file)

      // Send file message
      const messageInput: MessageInput = {
        content: `Sent a file: ${fileData.fileName}`,
        type: 'file',
        fileData
      }

      await onSendMessage(messageInput)
      success(`File "${fileData.fileName}" uploaded successfully`)
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError)
      error(uploadError instanceof Error ? uploadError.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-end space-x-3">
        {/* File Upload Button */}
        <div className="flex-shrink-0">
          <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}>
            <div className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-900 h-9 px-3 text-sm p-2 ${isUploading ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              )}
            </div>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip,.rar"
            disabled={disabled || isSending || isUploading}
          />
        </div>

        {/* Message Input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled || isSending}
            isLoading={isSending}
            size="sm"
            className="px-4 py-2"
          >
            {isSending ? (
              'Sending...'
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Character count for long messages */}
      {message.length > 200 && (
        <div className="mt-2 text-right">
          <span className={`text-xs ${message.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
            {message.length}/1000
          </span>
        </div>
      )}
    </div>
  )
}