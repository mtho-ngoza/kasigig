'use client'

import React, { useState, useEffect } from 'react'
import { useMessaging } from '@/contexts/MessagingContext'
import { useAuth } from '@/contexts/AuthContext'
import { ConversationPreview } from '@/types/messaging'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface MessagingHubProps {
  initialConversationId?: string
  onClose?: () => void
  className?: string
}

export function MessagingHub({
  initialConversationId,
  onClose,
  className = ''
}: MessagingHubProps) {
  const { user } = useAuth()
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    getArchivedConversations,
    isLoading,
    error,
    clearError
  } = useMessaging()

  const [isMobileView, setIsMobileView] = useState(false)
  const [showConversations, setShowConversations] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [archivedConversations, setArchivedConversations] = useState<ConversationPreview[]>([])

  // Handle responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowConversations(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Auto-select initial conversation
  useEffect(() => {
    if (initialConversationId && !activeConversation) {
      setActiveConversation(initialConversationId)
      if (isMobileView) {
        setShowConversations(false)
      }
    }
  }, [initialConversationId, activeConversation, setActiveConversation, isMobileView])

  // Load archived conversations when archived tab is selected
  useEffect(() => {
    if (activeTab === 'archived') {
      getArchivedConversations().then(setArchivedConversations)
    }
  }, [activeTab, getArchivedConversations])

  const handleConversationSelect = async (conversationId: string) => {
    await setActiveConversation(conversationId)
    if (isMobileView) {
      setShowConversations(false)
    }
  }

  const handleBackToConversations = () => {
    setShowConversations(true)
    if (isMobileView) {
      setActiveConversation(null)
    }
  }

  if (!user) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign in to access messaging
        </h3>
        <p className="text-gray-600">
          You need to be signed in to send and receive messages.
        </p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Error loading messages</h3>
          <p>{error}</p>
        </div>
        <Button onClick={clearError} variant="outline">
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobileView && activeConversation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToConversations}
              className="text-white hover:bg-primary-700 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          )}
          <h2 className="text-lg font-semibold">
            {activeConversation ? 'Messages' : 'Conversations'}
          </h2>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-primary-700 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex h-96 md:h-[500px]">
        {/* Conversations List */}
        {(!isMobileView || showConversations) && (
          <div className={`${isMobileView ? 'w-full' : 'w-1/3'} border-r border-gray-200 flex flex-col`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                  activeTab === 'active'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Active ({conversations.length})
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                  activeTab === 'archived'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Archived ({archivedConversations.length})
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-hidden">
              <ConversationList
                conversations={activeTab === 'active' ? conversations : archivedConversations}
                activeConversationId={activeConversation?.id}
                onConversationSelect={handleConversationSelect}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Chat Window */}
        {(!isMobileView || !showConversations) && (
          <div className={`${isMobileView ? 'w-full' : 'w-2/3'} flex flex-col`}>
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}