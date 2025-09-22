'use client'

import React, { useState } from 'react'
import { useMessaging } from '@/contexts/MessagingContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'

interface QuickMessageButtonProps {
  recipientId: string
  recipientName: string
  recipientType: 'job-seeker' | 'employer'
  gigId?: string
  gigTitle?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  onConversationStart?: (conversationId: string) => void
}

export function QuickMessageButton({
  recipientId,
  recipientName,
  recipientType,
  gigId,
  gigTitle,
  variant = 'outline',
  size = 'sm',
  className = '',
  children,
  onConversationStart
}: QuickMessageButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const { startConversation } = useMessaging()
  const { error, warning } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartConversation = async () => {
    if (!isAuthenticated || !user) {
      // Could trigger login modal here
      warning('Please sign in to send messages')
      return
    }

    if (user.id === recipientId) {
      warning('You cannot message yourself')
      return
    }

    try {
      setIsLoading(true)

      const conversationId = await startConversation(
        recipientId,
        recipientName,
        recipientType,
        gigId,
        gigTitle
      )

      onConversationStart?.(conversationId)
    } catch (err) {
      console.error('Error starting conversation:', err)
      error('Failed to start conversation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartConversation}
      isLoading={isLoading}
      disabled={!isAuthenticated || isLoading}
      className={`inline-flex items-center space-x-2 ${className}`}
    >
      {!isLoading && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )}
      <span>
        {children || (isLoading ? 'Starting...' : 'Message')}
      </span>
    </Button>
  )
}