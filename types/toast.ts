export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

export interface ToastState {
  toasts: Toast[]
}

export interface ToastContextType extends ToastState {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void

  // Convenience methods
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
}