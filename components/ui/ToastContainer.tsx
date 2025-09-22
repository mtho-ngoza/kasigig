'use client'

import React from 'react'
import { Toast } from './Toast'
import { Toast as ToastType } from '@/types/toast'

interface ToastContainerProps {
  toasts: ToastType[]
  onRemoveToast: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export function ToastContainer({
  toasts,
  onRemoveToast,
  position = 'top-right',
  maxToasts = 5
}: ToastContainerProps) {
  // Limit the number of toasts displayed
  const displayedToasts = toasts.slice(-maxToasts)

  const getPositionStyles = () => {
    const baseStyles = 'fixed z-50 pointer-events-none'

    switch (position) {
      case 'top-right':
        return `${baseStyles} top-4 right-4`
      case 'top-left':
        return `${baseStyles} top-4 left-4`
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4`
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4`
      case 'top-center':
        return `${baseStyles} top-4 left-1/2 transform -translate-x-1/2`
      case 'bottom-center':
        return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`
      default:
        return `${baseStyles} top-4 right-4`
    }
  }

  if (displayedToasts.length === 0) {
    return null
  }

  return (
    <div className={getPositionStyles()}>
      <div className="space-y-2 pointer-events-auto w-80 max-w-sm">
        {displayedToasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={onRemoveToast}
          />
        ))}
      </div>
    </div>
  )
}