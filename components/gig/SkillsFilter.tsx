'use client'

import React, { useState } from 'react'
import { User } from '@/types/auth'
import { getRelevantSkills } from '@/lib/utils/skillRecommendations'

interface SkillsFilterProps {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
  currentUser?: User | null
}

export function SkillsFilter({
  selectedSkills,
  onSkillsChange,
  currentUser
}: SkillsFilterProps) {
  const [showAll, setShowAll] = useState(false)

  // Get skills relevant to user's sector
  const relevantSkills = getRelevantSkills(currentUser?.workSector)

  // Show 8 skills initially, expand to show all
  const displayedSkills = showAll ? relevantSkills : relevantSkills.slice(0, 8)

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
      <div className="space-y-2 mb-3">
        {displayedSkills.map((skill) => (
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
      {relevantSkills.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showAll ? 'Show Less' : `Show All (${relevantSkills.length})`}
        </button>
      )}
    </div>
  )
}
