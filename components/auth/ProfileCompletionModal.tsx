'use client'

import React from 'react'
import { ProfileCompletionForm } from './ProfileCompletionForm'

interface ProfileCompletionModalProps {
  isOpen: boolean
  onComplete: () => void
}

export function ProfileCompletionModal({ isOpen, onComplete }: ProfileCompletionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <ProfileCompletionForm onComplete={onComplete} />
      </div>
    </div>
  )
}
