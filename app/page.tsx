'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthPage from '@/components/auth/AuthPage'
import Dashboard from '@/components/Dashboard'
import PublicGigBrowser from '@/components/PublicGigBrowser'

type PageView = 'browse' | 'auth' | 'dashboard'

export default function Home() {
  const { user, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<PageView>('browse')
  const [messageConversationId, setMessageConversationId] = useState<string | undefined>(undefined)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Determine which view to show
  const getActiveView = (): PageView => {
    if (user && currentView === 'dashboard') return 'dashboard'
    if (user && currentView === 'browse') return 'browse'
    if (!user && currentView === 'auth') return 'auth'
    if (!user) return 'browse'
    return 'dashboard'
  }

  const activeView = getActiveView()

  // Render based on active view
  switch (activeView) {
    case 'auth':
      return (
        <AuthPage
          onBackClick={() => setCurrentView('browse')}
        />
      )

    case 'dashboard':
      return (
        <Dashboard
          onBrowseGigs={() => setCurrentView('browse')}
          initialMessageConversationId={messageConversationId}
          onMessageConversationStart={(conversationId) => {
            setMessageConversationId(conversationId)
            setCurrentView('dashboard')
          }}
        />
      )

    case 'browse':
    default:
      return (
        <PublicGigBrowser
          onSignUpClick={() => setCurrentView('auth')}
          onLoginClick={() => setCurrentView('auth')}
          showAuthButtons={!user}
          onDashboardClick={user ? () => setCurrentView('dashboard') : undefined}
          currentUser={user}
          onMessageConversationStart={(conversationId) => {
            setMessageConversationId(conversationId)
            setCurrentView('dashboard')
          }}
          onMessagesClick={user ? () => setCurrentView('dashboard') : undefined}
        />
      )
  }
}