import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsFilter } from '@/components/gig/SkillsFilter'

describe('SkillsFilter', () => {
  const mockOnSkillsChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render skills filter with default popular skills', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should display only 8 skills initially', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(8)
  })

  it('should show "Show All" button when more than 8 skills', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    expect(screen.getByText(/Show All/)).toBeInTheDocument()
  })

  it('should expand to show all skills when "Show All" is clicked', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    const showAllButton = screen.getByText(/Show All/)
    fireEvent.click(showAllButton)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(8)
    expect(screen.getByText('Show Less')).toBeInTheDocument()
  })

  it('should call onSkillsChange when skill is selected', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
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
      />
    )

    const reactCheckbox = screen.getByLabelText('React')
    fireEvent.click(reactCheckbox)

    expect(mockOnSkillsChange).toHaveBeenCalledWith(['JavaScript'])
  })

  it('should show checked state for selected skills', () => {
    render(
      <SkillsFilter
        selectedSkills={['React', 'TypeScript']}
        onSkillsChange={mockOnSkillsChange}
      />
    )

    const reactCheckbox = screen.getByLabelText('React') as HTMLInputElement
    const typescriptCheckbox = screen.getByLabelText(
      'TypeScript'
    ) as HTMLInputElement
    const javascriptCheckbox = screen.getByLabelText(
      'JavaScript'
    ) as HTMLInputElement

    expect(reactCheckbox.checked).toBe(true)
    expect(typescriptCheckbox.checked).toBe(true)
    expect(javascriptCheckbox.checked).toBe(false)
  })

  it('should handle multiple skill selections', () => {
    const { rerender } = render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    const reactCheckbox = screen.getByLabelText('React')
    fireEvent.click(reactCheckbox)
    expect(mockOnSkillsChange).toHaveBeenCalledWith(['React'])

    rerender(
      <SkillsFilter
        selectedSkills={['React']}
        onSkillsChange={mockOnSkillsChange}
      />
    )

    const javascriptCheckbox = screen.getByLabelText('JavaScript')
    fireEvent.click(javascriptCheckbox)
    expect(mockOnSkillsChange).toHaveBeenCalledWith(['React', 'JavaScript'])
  })

  it('should accept custom popular skills', () => {
    const customSkills = ['Skill A', 'Skill B', 'Skill C']

    render(
      <SkillsFilter
        selectedSkills={[]}
        onSkillsChange={mockOnSkillsChange}
        popularSkills={customSkills}
      />
    )

    expect(screen.getByText('Skill A')).toBeInTheDocument()
    expect(screen.getByText('Skill B')).toBeInTheDocument()
    expect(screen.getByText('Skill C')).toBeInTheDocument()
  })

  it('should not show "Show All" button when 8 or fewer skills', () => {
    const fewSkills = ['Skill A', 'Skill B', 'Skill C']

    render(
      <SkillsFilter
        selectedSkills={[]}
        onSkillsChange={mockOnSkillsChange}
        popularSkills={fewSkills}
      />
    )

    expect(screen.queryByText(/Show All/)).not.toBeInTheDocument()
  })

  it('should toggle between "Show All" and "Show Less"', () => {
    render(
      <SkillsFilter selectedSkills={[]} onSkillsChange={mockOnSkillsChange} />
    )

    const showAllButton = screen.getByText(/Show All/)
    fireEvent.click(showAllButton)

    expect(screen.getByText('Show Less')).toBeInTheDocument()

    const showLessButton = screen.getByText('Show Less')
    fireEvent.click(showLessButton)

    expect(screen.getByText(/Show All/)).toBeInTheDocument()
  })

  describe('Personalized recommendations', () => {
    const mockCurrentUser = {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+27123456789',
      location: 'Cape Town',
      userType: 'job-seeker' as const,
      skills: ['React', 'Design'],
      createdAt: new Date()
    }

    it('should show "Based on Your Skills" section when user has skills', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={mockCurrentUser}
        />
      )

      expect(screen.getByText('💡 Based on Your Skills')).toBeInTheDocument()
    })

    it('should not show "Based on Your Skills" section when user has no skills', () => {
      const userWithoutSkills = {
        ...mockCurrentUser,
        skills: undefined
      }

      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={userWithoutSkills}
        />
      )

      expect(
        screen.queryByText('💡 Based on Your Skills')
      ).not.toBeInTheDocument()
    })

    it('should not show "Based on Your Skills" section when user is not logged in', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={null}
        />
      )

      expect(
        screen.queryByText('💡 Based on Your Skills')
      ).not.toBeInTheDocument()
    })

    it('should show "All Skills" heading when recommendations are present', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={mockCurrentUser}
        />
      )

      expect(screen.getByText('All Skills')).toBeInTheDocument()
    })

    it('should not duplicate skills between recommended and all sections', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={mockCurrentUser}
        />
      )

      // Count how many times JavaScript appears (should be once, in recommended section)
      const javascriptLabels = screen.getAllByText('JavaScript')
      expect(javascriptLabels.length).toBe(1)
    })

    it('should allow selecting skills from recommended section', () => {
      render(
        <SkillsFilter
          selectedSkills={[]}
          onSkillsChange={mockOnSkillsChange}
          currentUser={mockCurrentUser}
        />
      )

      // JavaScript should be in recommended section (related to React)
      const javascriptCheckbox = screen.getByLabelText('JavaScript')
      fireEvent.click(javascriptCheckbox)

      expect(mockOnSkillsChange).toHaveBeenCalledWith(['JavaScript'])
    })

    it('should show selected state for skills in recommended section', () => {
      render(
        <SkillsFilter
          selectedSkills={['JavaScript']}
          onSkillsChange={mockOnSkillsChange}
          currentUser={mockCurrentUser}
        />
      )

      const javascriptCheckbox = screen.getByLabelText(
        'JavaScript'
      ) as HTMLInputElement
      expect(javascriptCheckbox.checked).toBe(true)
    })
  })
})
