import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useAuth } from '@/contexts/AuthContext'

// Mock dependencies
jest.mock('@/contexts/AuthContext')

describe('ForgotPasswordForm', () => {
  const mockSendPasswordReset = jest.fn()
  const mockOnBackToLogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      sendPasswordReset: mockSendPasswordReset
    })
  })

  describe('Form Rendering', () => {
    it('should render forgot password form with all required elements', () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      expect(screen.getByRole('heading', { name: /Reset your password/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Send Reset Instructions/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Back to Sign In/i })).toBeInTheDocument()
    })

    it('should display helper text explaining the process', () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      expect(screen.getByText(/Enter your email address and we'll send you instructions/i)).toBeInTheDocument()
    })
  })

  describe('Email Validation', () => {
    it('should validate required email field', async () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
      })

      expect(mockSendPasswordReset).not.toHaveBeenCalled()
    })

    it('should validate email format', async () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'invalid-email' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument()
      })

      expect(mockSendPasswordReset).not.toHaveBeenCalled()
    })

    it('should accept valid email format', async () => {
      mockSendPasswordReset.mockResolvedValue({
        success: true,
        message: 'Password reset email sent!'
      })

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'user@example.com' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockSendPasswordReset).toHaveBeenCalledWith('user@example.com')
      })
    })

    it('should trim whitespace from email', async () => {
      mockSendPasswordReset.mockResolvedValue({
        success: true,
        message: 'Password reset email sent!'
      })

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: '  user@example.com  ' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockSendPasswordReset).toHaveBeenCalledWith('user@example.com')
      })
    })
  })

  describe('Form Submission', () => {
    it('should successfully send password reset email', async () => {
      mockSendPasswordReset.mockResolvedValue({
        success: true,
        message: 'Password reset email sent! Check your inbox for instructions.'
      })

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'user@example.com' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Password reset email sent!/i)).toBeInTheDocument()
      })

      // Email field should be cleared on success
      await waitFor(() => {
        const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
        expect(emailInput.value).toBe('')
      })
    })

    it('should display error message on failure', async () => {
      mockSendPasswordReset.mockResolvedValue({
        success: false,
        message: 'Failed to send password reset email'
      })

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'user@example.com' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Failed to send password reset email/i)).toBeInTheDocument()
      })
    })

    it('should disable submit button while loading', async () => {
      mockSendPasswordReset.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'user@example.com' }
      })

      const submitButton = screen.getByRole('button', { name: /Send Reset Instructions/i })
      fireEvent.click(submitButton)

      // Button should be disabled while submitting
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Error Clearing', () => {
    it('should clear email error when user starts typing', async () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      // Submit to trigger validation error
      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
      })

      // Start typing in email field
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'u' }
      })

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument()
      })
    })

    it('should clear success message when user starts typing', async () => {
      mockSendPasswordReset.mockResolvedValue({
        success: true,
        message: 'Password reset email sent!'
      })

      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'user@example.com' }
      })

      const form = screen.getByRole('button', { name: /Send Reset Instructions/i }).closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Password reset email sent!/i)).toBeInTheDocument()
      })

      // Start typing again
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'new@example.com' }
      })

      // Success message should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Password reset email sent!/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should call onBackToLogin when back button is clicked', () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      const backButton = screen.getByRole('button', { name: /Back to Sign In/i })
      fireEvent.click(backButton)

      expect(mockOnBackToLogin).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper autocomplete attribute', () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveAttribute('autocomplete', 'email')
    })

    it('should have proper input type', () => {
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })
})
