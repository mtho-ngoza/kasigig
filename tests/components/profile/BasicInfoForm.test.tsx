import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BasicInfoForm from '@/components/profile/BasicInfoForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { ProfileService } from '@/lib/database/profileService'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/contexts/ToastContext')
jest.mock('@/lib/database/profileService')

describe('BasicInfoForm', () => {
  const mockOnBack = jest.fn()
  const mockRefreshUser = jest.fn()
  const mockSuccess = jest.fn()
  const mockError = jest.fn()

  const mockJobSeekerUser = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+27821234567',
    location: 'Cape Town',
    bio: 'Test bio',
    userType: 'job-seeker' as const,
    workSector: 'professional' as const,
    socialLinks: {
      linkedin: '',
      website: '',
      github: ''
    }
  }

  const mockEmployerUser = {
    ...mockJobSeekerUser,
    userType: 'employer' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: mockJobSeekerUser,
      refreshUser: mockRefreshUser
    })
    ;(useToast as jest.Mock).mockReturnValue({
      success: mockSuccess,
      error: mockError
    })
    ;(ProfileService.updateProfile as jest.Mock).mockResolvedValue(undefined)
    ;(ProfileService.updateProfileCompleteness as jest.Mock).mockResolvedValue(undefined)
  })

  describe('Work Sector Field', () => {
    it('should show work sector dropdown for job seekers', () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      expect(screen.getByLabelText(/Type of Work/i)).toBeInTheDocument()
      expect(screen.getByText(/Professional Services/i)).toBeInTheDocument()
      expect(screen.getByText(/Hands-on Work/i)).toBeInTheDocument()
    })

    it('should not show work sector dropdown for employers', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockEmployerUser,
        refreshUser: mockRefreshUser
      })

      render(<BasicInfoForm onBack={mockOnBack} />)

      expect(screen.queryByLabelText(/Type of Work/i)).not.toBeInTheDocument()
    })

    it('should pre-fill work sector from user data', () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      const workSectorSelect = screen.getByLabelText(/Type of Work/i) as HTMLSelectElement
      expect(workSectorSelect.value).toBe('professional')
    })

    it('should allow changing work sector', () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      const workSectorSelect = screen.getByLabelText(/Type of Work/i) as HTMLSelectElement

      fireEvent.change(workSectorSelect, { target: { value: 'informal' } })

      expect(workSectorSelect.value).toBe('informal')
    })

    it('should include workSector in update when changed', async () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      const workSectorSelect = screen.getByLabelText(/Type of Work/i)
      fireEvent.change(workSectorSelect, { target: { value: 'informal' } })

      const submitButton = screen.getByRole('button', { name: /Save Changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(ProfileService.updateProfile).toHaveBeenCalledWith(
          'user-123',
          expect.objectContaining({
            workSector: 'informal'
          })
        )
      })

      expect(mockSuccess).toHaveBeenCalledWith('Profile updated successfully!')
      expect(mockOnBack).toHaveBeenCalled()
    })

    it('should not include workSector for employers', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockEmployerUser,
        refreshUser: mockRefreshUser
      })

      render(<BasicInfoForm onBack={mockOnBack} />)

      const submitButton = screen.getByRole('button', { name: /Save Changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(ProfileService.updateProfile).toHaveBeenCalled()
      })

      const updateCall = (ProfileService.updateProfile as jest.Mock).mock.calls[0][1]
      expect(updateCall).not.toHaveProperty('workSector')
    })

    it('should show help text explaining work sector purpose', () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      expect(screen.getByText(/This determines which profile fields are shown to you/i)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should update all basic info fields', async () => {
      render(<BasicInfoForm onBack={mockOnBack} />)

      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } })
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } })
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+27829876543' } })

      const submitButton = screen.getByRole('button', { name: /Save Changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(ProfileService.updateProfile).toHaveBeenCalledWith(
          'user-123',
          expect.objectContaining({
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+27829876543'
          })
        )
      })
    })
  })
})
