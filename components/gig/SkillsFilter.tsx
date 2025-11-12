'use client'

import React, { useState } from 'react'
import { User } from '@/types/auth'
import { getTopRecommendedSkills } from '@/lib/utils/skillRecommendations'

interface SkillsFilterProps {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
  popularSkills?: string[]
  currentUser?: User | null
}

const DEFAULT_POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'Design',
  'Marketing',
  'Writing',
  'Construction',
  'Cleaning',
  'Transportation',
  'Photography',
  'Video Editing',
  'Data Entry',
  'Customer Service'
]

export function SkillsFilter({
  selectedSkills,
  onSkillsChange,
  popularSkills = DEFAULT_POPULAR_SKILLS,
  currentUser
}: SkillsFilterProps) {
  const [showAll, setShowAll] = useState(false)

  // Get recommended skills based on user's existing skills
  const recommendedSkills = currentUser?.skills
    ? getTopRecommendedSkills(currentUser.skills, popularSkills)
    : []

  // Skills to show in "All Skills" section (excluding recommended ones)
  const otherSkills = popularSkills.filter(
    skill => !recommendedSkills.includes(skill)
  )

  const displayedOtherSkills = showAll ? otherSkills : otherSkills.slice(0, 8)

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skill))
    } else {
      onSkillsChange([...selectedSkills, skill])
    }
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Skills</h4>

      {/* Recommended Skills Section - Only show if user has skills */}
      {recommendedSkills.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              💡 Based on Your Skills
            </span>
          </div>
          <div className="space-y-2">
            {recommendedSkills.map((skill) => (
              <label
                key={`recommended-${skill}`}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* All Skills Section */}
      {recommendedSkills.length > 0 && (
        <h5 className="text-xs font-medium text-gray-600 mb-2">All Skills</h5>
      )}
      <div className="space-y-2 mb-3">
        {displayedOtherSkills.map((skill) => (
          <label
            key={skill}
            className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedSkills.includes(skill)}
              onChange={() => handleSkillToggle(skill)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">{skill}</span>
          </label>
        ))}
      </div>
      {otherSkills.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showAll ? 'Show Less' : `Show All (${otherSkills.length})`}
        </button>
      )}
    </div>
  )
}
