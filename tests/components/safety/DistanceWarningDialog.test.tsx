import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DistanceWarningDialog from '@/components/safety/DistanceWarningDialog'
import { DistanceWarningInfo } from '@/lib/utils/distanceWarning'

describe('DistanceWarningDialog Component', () => {
  const mockWarningInfo: DistanceWarningInfo = {
    distance: 55.5,
    travelTime: 67,
    gigLocation: { latitude: -26.1076, longitude: 28.0567 },
    userLocation: { latitude: -26.2041, longitude: 28.0473 },
    shouldWarn: true
  }

  const mockProps = {
    warningInfo: mockWarningInfo,
    gigTitle: 'Garden Maintenance in Pretoria',
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the dialog with warning icon', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByRole('heading', { name: /long distance notice/i })).toBeInTheDocument()
    })

    it('should display the gig title', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByText(/applying for:/i)).toBeInTheDocument()
      expect(screen.getByText('Garden Maintenance in Pretoria')).toBeInTheDocument()
    })

    it('should display the formatted distance warning message', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      // Check that distance is shown (56km rounded from 55.5)
      expect(screen.getByText(/56km/i)).toBeInTheDocument()

      // Check that travel time is shown
      expect(screen.getByText(/1 hours 7 minutes/i)).toBeInTheDocument()
    })

    it('should display safety considerations', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByText(/please consider:/i)).toBeInTheDocument()
      expect(screen.getByText(/transportation costs and availability/i)).toBeInTheDocument()
      expect(screen.getByText(/travel time to and from the location/i)).toBeInTheDocument()
      expect(screen.getByText(/your ability to reliably attend this gig/i)).toBeInTheDocument()
    })

    it('should display confirmation question', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByText(/are you sure you want to apply for this gig/i)).toBeInTheDocument()
    })

    it('should display safety tip', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByText(/always verify gig details and meet in safe, public locations/i)).toBeInTheDocument()
    })

    it('should render Cancel and Apply buttons', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /yes, apply anyway/i })).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onConfirm when "Yes, Apply Anyway" is clicked', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      const applyButton = screen.getByRole('button', { name: /yes, apply anyway/i })
      fireEvent.click(applyButton)

      expect(mockProps.onConfirm).toHaveBeenCalledTimes(1)
      expect(mockProps.onCancel).not.toHaveBeenCalled()
    })

    it('should call onCancel when "Cancel" is clicked', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
      expect(mockProps.onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('Distance Formatting', () => {
    it('should display distance with one decimal for < 10km', () => {
      const shortDistanceInfo: DistanceWarningInfo = {
        ...mockWarningInfo,
        distance: 5.7,
        travelTime: 7
      }

      render(
        <DistanceWarningDialog
          {...mockProps}
          warningInfo={shortDistanceInfo}
        />
      )

      expect(screen.getByText(/5\.7km/i)).toBeInTheDocument()
    })

    it('should display distance rounded for >= 10km', () => {
      const longDistanceInfo: DistanceWarningInfo = {
        ...mockWarningInfo,
        distance: 125.8,
        travelTime: 151
      }

      render(
        <DistanceWarningDialog
          {...mockProps}
          warningInfo={longDistanceInfo}
        />
      )

      expect(screen.getByText(/126km/i)).toBeInTheDocument()
    })
  })

  describe('Travel Time Formatting', () => {
    it('should display travel time in minutes when < 60', () => {
      const shortTimeInfo: DistanceWarningInfo = {
        ...mockWarningInfo,
        distance: 25.0,
        travelTime: 30
      }

      render(
        <DistanceWarningDialog
          {...mockProps}
          warningInfo={shortTimeInfo}
        />
      )

      expect(screen.getByText(/30 minutes/i)).toBeInTheDocument()
    })

    it('should display travel time in hours and minutes when >= 60', () => {
      const longTimeInfo: DistanceWarningInfo = {
        ...mockWarningInfo,
        distance: 100.0,
        travelTime: 125
      }

      render(
        <DistanceWarningDialog
          {...mockProps}
          warningInfo={longTimeInfo}
        />
      )

      expect(screen.getByText(/2 hours 5 minutes/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have a proper heading structure', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      const heading = screen.getByRole('heading', { name: /long distance notice/i })
      expect(heading).toHaveClass('text-xl', 'font-semibold')
    })

    it('should have properly labeled buttons', () => {
      render(<DistanceWarningDialog {...mockProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      const applyButton = screen.getByRole('button', { name: /yes, apply anyway/i })

      expect(cancelButton).toBeVisible()
      expect(applyButton).toBeVisible()
    })
  })
})
