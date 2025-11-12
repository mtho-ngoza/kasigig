/**
 * Skill recommendation utility for personalizing filter suggestions
 * Based on user's existing skills, recommends complementary skills
 */

// Map of skills to their complementary/related skills
const SKILL_RELATIONSHIPS: Record<string, string[]> = {
  // Tech skills cluster
  React: ['JavaScript', 'TypeScript', 'Node.js', 'Design'],
  JavaScript: ['React', 'TypeScript', 'Node.js', 'Design'],
  TypeScript: ['React', 'JavaScript', 'Node.js'],
  'Node.js': ['JavaScript', 'TypeScript', 'React', 'Python'],
  Python: ['Node.js', 'Data Entry', 'JavaScript'],

  // Design & creative cluster
  Design: ['React', 'JavaScript', 'Photography', 'Video Editing', 'Marketing'],
  Photography: ['Video Editing', 'Design', 'Marketing'],
  'Video Editing': ['Photography', 'Design', 'Marketing'],

  // Marketing & communication cluster
  Marketing: ['Writing', 'Design', 'Photography', 'Customer Service'],
  Writing: ['Marketing', 'Customer Service', 'Data Entry'],
  'Customer Service': ['Marketing', 'Writing', 'Data Entry'],

  // Manual labor cluster
  Construction: ['Transportation', 'Cleaning'],
  Cleaning: ['Construction', 'Customer Service'],
  Transportation: ['Construction', 'Cleaning'],

  // General office skills
  'Data Entry': ['Writing', 'Customer Service', 'Python']
}

/**
 * Get recommended skills based on user's existing skills
 * @param userSkills - Array of skills the user already has
 * @param availableSkills - All possible skills to choose from
 * @returns Array of recommended skills (excluding ones user already has)
 */
export function getRecommendedSkills(
  userSkills: string[] | undefined,
  availableSkills: string[]
): string[] {
  if (!userSkills || userSkills.length === 0) {
    return []
  }

  const recommendations = new Set<string>()

  // For each user skill, add related skills
  userSkills.forEach((userSkill) => {
    const normalizedUserSkill = userSkill.trim()

    // Look for exact match or partial match in skill relationships
    Object.keys(SKILL_RELATIONSHIPS).forEach((relatedSkill) => {
      if (
        relatedSkill.toLowerCase() === normalizedUserSkill.toLowerCase() ||
        normalizedUserSkill.toLowerCase().includes(relatedSkill.toLowerCase())
      ) {
        SKILL_RELATIONSHIPS[relatedSkill].forEach((rec) => {
          // Only add if it's in available skills and user doesn't already have it
          if (
            availableSkills.includes(rec) &&
            !userSkills.some(
              (us) => us.toLowerCase() === rec.toLowerCase()
            )
          ) {
            recommendations.add(rec)
          }
        })
      }
    })
  })

  // Prioritize recommendations that appear in available skills
  return Array.from(recommendations).filter((skill) =>
    availableSkills.includes(skill)
  )
}

/**
 * Get skills to show in "Based on Your Skills" section
 * Limits to top 6 recommendations
 */
export function getTopRecommendedSkills(
  userSkills: string[] | undefined,
  availableSkills: string[]
): string[] {
  const recommendations = getRecommendedSkills(userSkills, availableSkills)
  return recommendations.slice(0, 6)
}
