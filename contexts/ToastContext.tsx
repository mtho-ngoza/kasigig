'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastContextType, ToastType } from '@/types/toast'
import { ToastContainer } from '@/components/ui/ToastContainer'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId()
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast
    }

    setToasts(prevToasts => [...prevToasts, newToast])
  }, [generateId])

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    addToast({ type: 'success', message, ...options })
  }, [addToast])

  const error = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    addToast({ type: 'error', message, duration: 7000, ...options })
  }, [addToast])

  const warning = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    addToast({ type: 'warning', message, duration: 6000, ...options })
  }, [addToast])

  const info = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    addToast({ type: 'info', message, ...options })
  }, [addToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
        position="top-right"
        maxToasts={5}
      />
    </ToastContext.Provider>
  )
}