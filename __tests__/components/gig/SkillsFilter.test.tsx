import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsFilter } from '@/components/gig/SkillsFilter'

describe('SkillsFilter', () => {
  const mockOnSkillsChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Anonymous user (no sector)', () => {
    it('should render all 15 skills for anonymous user', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      expect(screen.getByText('Skills')).toBeInTheDocument()
      // Should show first 8 skills initially
      expect(screen.getAllByRole('checkbox').length).toBe(8)
    })

    it('should show "Show All (15)" button for anonymous user', () => {
      render(
        <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} currentUser={null} />
      )

      expect(screen.getByText(/Show All \(15\)/)).toBeInTheDocument()
    })

    it('should expand to show all 15 skills when "Show All" is clicked', () => {
      render(
        <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} currentUser={null} />
      )

      const showAllButton = screen.getByText(/Show All/)
      fireEvent.click(showAllButton)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(15)
      expect(screen.getByText('Show Less')).toBeInTheDocument()
    })
  })

  describe('Professional sector user', () => {
    const professionalUser = {
      id: 'user-1',
      email: 'pro@test.com',
      firstName: 'Professional',
      lastName: 'User',
      phone: '+27123456789',
      location: 'Cape Town',
      userType: 'job-seeker' as const,
      workSector: 'professional' as const,
      createdAt: new Date()
    }

    it('should show only professional skills (12 total)', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={professionalUser}
        />
      )

      // Click Show All to see all skills
      const showAllButton = screen.getByText(/Show All/)
      fireEvent.click(showAllButton)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(12) // Professional skills only
    })

    it('should show professional skills like React, JavaScript, Design', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={professionalUser}
        />
      )

      // Show all skills first
      fireEvent.click(screen.getByText(/Show All/))

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
    })

    it('should NOT show informal sector skills like Construction, Cleaning', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={professionalUser}
        />
      )

      // Show all skills
      fireEvent.click(screen.getByText(/Show All/))

      expect(screen.queryByText('Construction')).not.toBeInTheDocument()
      expect(screen.queryByText('Cleaning')).not.toBeInTheDocument()
      expect(screen.queryByText('Transportation')).not.toBeInTheDocument()
    })
  })

  describe('Informal sector user', () => {
    const informalUser = {
      id: 'user-2',
      email: 'informal@test.com',
      firstName: 'Informal',
      lastName: 'Worker',
      phone: '+27987654321',
      location: 'Johannesburg',
      userType: 'job-seeker' as const,
      workSector: 'informal' as const,
      createdAt: new Date()
    }

    it('should show only informal skills (4 total)', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={informalUser}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(4) // All 4 informal skills fit without "Show All"
    })

    it('should show informal skills like Construction, Cleaning, Transportation', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={informalUser}
        />
      )

      expect(screen.getByText('Construction')).toBeInTheDocument()
      expect(screen.getByText('Cleaning')).toBeInTheDocument()
      expect(screen.getByText('Transportation')).toBeInTheDocument()
      expect(screen.getByText('Customer Service')).toBeInTheDocument()
    })

    it('should NOT show professional skills like React, JavaScript', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={informalUser}
        />
      )

      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
      expect(screen.queryByText('Design')).not.toBeInTheDocument()
    })

    it('should NOT show "Show All" button since only 4 skills (less than 8)', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={informalUser}
        />
      )

      expect(screen.queryByText(/Show All/)).not.toBeInTheDocument()
    })
  })

  describe('Skill selection', () => {
    it('should call onSkillsChange when skill is selected', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      const reactCheckbox = screen.getByLabelText('React')
      fireEvent.click(reactCheckbox)

      expect(mockOnSkillsChange).toHaveBeenCalledWith(['React'])
    })

    it('should call onSkillsChange when skill is deselected', () => {
      render(
        <SkillsFilter
          selectedSkills={['React', 'JavaScript']}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      const reactCheckbox = screen.getByLabelText('React')
      fireEvent.click(reactCheckbox)

      expect(mockOnSkillsChange).toHaveBeenCalledWith(['JavaScript'])
    })

    it('should show checked state for selected skills', () => {
      render(
        <SkillsFilter
          selectedSkills={['React', 'Design']}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      const reactCheckbox = screen.getByLabelText('React') as HTMLInputElement
      const designCheckbox = screen.getByLabelText('Design') as HTMLInputElement
      const javascriptCheckbox = screen.getByLabelText('JavaScript') as HTMLInputElement

      expect(reactCheckbox.checked).toBe(true)
      expect(designCheckbox.checked).toBe(true)
      expect(javascriptCheckbox.checked).toBe(false)
    })
  })

  describe('Show All / Show Less toggle', () => {
    it('should toggle between "Show All" and "Show Less"', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      const showAllButton = screen.getByText(/Show All/)
      fireEvent.click(showAllButton)

      expect(screen.getByText('Show Less')).toBeInTheDocument()

      const showLessButton = screen.getByText('Show Less')
      fireEvent.click(showLessButton)

      expect(screen.getByText(/Show All/)).toBeInTheDocument()
    })
  })
})
