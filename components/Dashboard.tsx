'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMessaging } from '@/contexts/MessagingContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import PostGigPage from './gig/PostGigPage'
import MyApplications from './application/MyApplications'
import ManageApplications from './application/ManageApplications'
import ProfileManagement from './profile/ProfileManagement'
import { MessagingHub } from './messaging/MessagingHub'

interface DashboardProps {
  onBrowseGigs?: () => void
  initialMessageConversationId?: string
  onMessageConversationStart?: (conversationId: string) => void
}

export default function Dashboard({
  onBrowseGigs,
  initialMessageConversationId,
  onMessageConversationStart
}: DashboardProps) {
  const { user, logout } = useAuth()
  const { totalUnreadCount } = useMessaging()
  const [currentView, setCurrentView] = useState<'dashboard' | 'post-gig' | 'my-applications' | 'manage-applications' | 'profile' | 'messages'>('dashboard')

  // Auto-navigate to messages if conversationId is provided
  useEffect(() => {
    if (initialMessageConversationId) {
      setCurrentView('messages')
    }
  }, [initialMessageConversationId])

  // Show post gig page if user is on that view
  if (currentView === 'post-gig') {
    return <PostGigPage onBack={() => setCurrentView('dashboard')} />
  }

  // Show my applications page if user is on that view
  if (currentView === 'my-applications') {
    return (
      <MyApplications
        onBack={() => setCurrentView('dashboard')}
        onBrowseGigs={onBrowseGigs}
        onMessageConversationStart={onMessageConversationStart}
        onMessagesClick={() => setCurrentView('messages')}
      />
    )
  }

  // Show manage applications page if user is on that view
  if (currentView === 'manage-applications') {
    return <ManageApplications onBack={() => setCurrentView('dashboard')} />
  }

  // Show profile management page if user is on that view
  if (currentView === 'profile') {
    return <ProfileManagement onBack={() => setCurrentView('dashboard')} />
  }

  // Show messaging page if user is on that view
  if (currentView === 'messages') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6">
                <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="text-sm">
                  ← Back to Dashboard
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <MessagingHub
              className="h-[600px]"
              initialConversationId={initialMessageConversationId}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900">
                GigSA Dashboard
              </h1>
              {onBrowseGigs && (
                <Button variant="ghost" onClick={onBrowseGigs} className="text-sm">
                  Browse All Gigs
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('messages')}
                className="relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                  </span>
                )}
              </Button>
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Welcome to GigSA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You&apos;re successfully logged in to South Africa&apos;s premier gig economy platform.
                </p>
                <div className="space-y-2">
                  <p><strong>Account Type:</strong> {user?.userType === 'job-seeker' ? 'Job Seeker' : 'Employer'}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Location:</strong> {user?.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{user?.rating || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Gigs:</span>
                    <span className="font-medium">{user?.completedGigs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-medium">{user?.skills?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {user?.userType === 'job-seeker' ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={onBrowseGigs}
                      >
                        Browse Gigs
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentView('profile')}
                      >
                        Update Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentView('my-applications')}
                      >
                        My Applications
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full relative"
                        onClick={() => setCurrentView('messages')}
                      >
                        Messages
                        {totalUnreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                          </span>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">Skill Assessment</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => setCurrentView('post-gig')}
                      >
                        Post a Gig
                      </Button>
                      <Button variant="outline" className="w-full">Manage Gigs</Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentView('manage-applications')}
                      >
                        View Applications
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full relative"
                        onClick={() => setCurrentView('messages')}
                      >
                        Messages
                        {totalUnreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={onBrowseGigs}
                      >
                        Browse Talent
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-600">
                    Welcome to GigSA! Your Firebase integration is working perfectly.
                    Here&apos;s what you can do next:
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-600">
                    <li>• Complete your profile to attract more opportunities</li>
                    <li>• {user?.userType === 'job-seeker' ? 'Browse available gigs in your area' : 'Post your first gig to find talented workers'}</li>
                    <li>• Connect with other professionals in your field</li>
                    <li>• Build your reputation through quality work</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}