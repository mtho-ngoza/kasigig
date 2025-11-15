/**
 * VerificationNudge Component Tests
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { VerificationNudge } from '@/components/safety/VerificationNudge'
import { useRouter } from 'next/navigation'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('VerificationNudge', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  describe('banner variant', () => {
    it('should render banner variant with stats', () => {
      render(<VerificationNudge variant="banner" showStats={true} />)

      expect(screen.getByText('Get Verified, Stand Out')).toBeInTheDocument()
      expect(screen.getByText(/Verified users get 3x more responses/)).toBeInTheDocument()
      expect(screen.getByText(/25% higher trust scores/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Verify Now' })).toBeInTheDocument()
    })

    it('should render banner variant without stats', () => {
      render(<VerificationNudge variant="banner" showStats={false} />)

      expect(screen.getByText('Get Verified, Stand Out')).toBeInTheDocument()
      expect(screen.getByText(/Increase your chances of landing gigs/)).toBeInTheDocument()
      expect(screen.queryByText(/3x more responses/)).not.toBeInTheDocument()
    })

    it('should navigate to verification page on button click', () => {
      render(<VerificationNudge variant="banner" />)

      const button = screen.getByRole('button', { name: 'Verify Now' })
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/dashboard/verification')
    })
  })

  describe('inline variant', () => {
    it('should render inline variant', () => {
      render(<VerificationNudge variant="inline" />)

      expect(screen.getByText(/Boost your chances!/)).toBeInTheDocument()
      expect(screen.getByText(/Verified workers get 3x more responses/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Verify' })).toBeInTheDocument()
    })

    it('should navigate to verification page on button click', () => {
      render(<VerificationNudge variant="inline" />)

      const button = screen.getByRole('button', { name: 'Verify' })
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/dashboard/verification')
    })
  })

  describe('card variant (default)', () => {
    it('should render card variant with stats', () => {
      render(<VerificationNudge showStats={true} />)

      expect(screen.getByText('Unlock More Opportunities with Verification')).toBeInTheDocument()
      expect(screen.getByText(/3x more responses/)).toBeInTheDocument()
      expect(screen.getByText(/\+25 trust score boost/)).toBeInTheDocument()
      expect(screen.getByText(/Priority in search results/)).toBeInTheDocument()
      expect(screen.getByText(/trust and credibility/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Get Verified Now' })).toBeInTheDocument()
    })

    it('should render compact card variant', () => {
      render(<VerificationNudge showStats={true} compact={true} />)

      expect(screen.getByText('Unlock More Opportunities with Verification')).toBeInTheDocument()
      expect(screen.getByText(/Get 3x more responses and \+25 trust score/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Get Verified Now' })).toBeInTheDocument()
    })

    it('should render card variant without stats', () => {
      render(<VerificationNudge showStats={false} />)

      expect(screen.getByText('Unlock More Opportunities with Verification')).toBeInTheDocument()
      expect(screen.getByText(/Stand out from the crowd/)).toBeInTheDocument()
      expect(screen.queryByText(/3x more responses/)).not.toBeInTheDocument()
    })

    it('should show time estimate', () => {
      render(<VerificationNudge />)

      expect(screen.getByText('Only takes 2 minutes')).toBeInTheDocument()
    })

    it('should navigate to verification page on button click', () => {
      render(<VerificationNudge />)

      const button = screen.getByRole('button', { name: 'Get Verified Now' })
      fireEvent.click(button)

      expect(mockPush).toHaveBeenCalledWith('/dashboard/verification')
    })
  })

  describe('accessibility', () => {
    it('should have accessible button', () => {
      render(<VerificationNudge variant="banner" />)

      const button = screen.getByRole('button', { name: 'Verify Now' })
      expect(button).toHaveAccessibleName()
    })

    it('should be keyboard navigable', () => {
      render(<VerificationNudge variant="inline" />)

      const button = screen.getByRole('button', { name: 'Verify' })
      button.focus()
      expect(button).toHaveFocus()
    })
  })
})
