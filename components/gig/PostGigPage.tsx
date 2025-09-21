'use client'

import React, { useState } from 'react'
import PostGigForm from './PostGigForm'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface PostGigPageProps {
  onBack?: () => void
}

export default function PostGigPage({ onBack }: PostGigPageProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = () => {
    setShowSuccess(true)
  }

  const handlePostAnother = () => {
    setShowSuccess(false)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mb-4">
                ← Back to Dashboard
              </Button>
            )}
          </div>

          {/* Success Message */}
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gig Posted Successfully! 🎉
              </h2>

              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Your gig is now live and visible to job seekers across South Africa.
                You&apos;ll receive notifications when people apply for your position.
              </p>

              <div className="space-x-4">
                <Button onClick={handlePostAnother}>
                  Post Another Gig
                </Button>
                {onBack && (
                  <Button variant="outline" onClick={onBack}>
                    Return to Dashboard
                  </Button>
                )}
              </div>

              {/* Next Steps */}
              <div className="mt-12 text-left bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      1
                    </span>
                    <span>Your gig will appear in search results and the public gig browser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      2
                    </span>
                    <span>Job seekers can view your gig details and submit applications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      3
                    </span>
                    <span>You&apos;ll receive notifications and can review applications in your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      4
                    </span>
                    <span>Choose the best candidate and start your project collaboration</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              ← Back to Dashboard
            </Button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Post a Gig
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Describe your project and find talented South African freelancers
              ready to bring your vision to life.
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mb-8 bg-primary-50 border-primary-200">
          <CardHeader>
            <CardTitle className="text-lg text-primary-800">
              💡 Tips for a Successful Gig Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-700">
              <div>
                <h4 className="font-semibold mb-2">Write a Clear Title</h4>
                <p>Be specific about what you need done</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Detail Your Requirements</h4>
                <p>Include deliverables, timeline, and expectations</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Set Fair Budget</h4>
                <p>Research market rates for similar projects</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">List Required Skills</h4>
                <p>Help the right talent find your project</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <PostGigForm
          onSuccess={handleSuccess}
          onCancel={onBack}
        />
      </div>
    </div>
  )
}