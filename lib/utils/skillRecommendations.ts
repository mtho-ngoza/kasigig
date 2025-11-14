/**
 * Skill recommendation utility for sector-based skill filtering
 * Shows relevant skills based on user's work sector (professional vs informal)
 */

// Professional sector: Tech, creative, office work
const PROFESSIONAL_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'Design',
  'Marketing',
  'Writing',
  'Photography',
  'Video Editing',
  'Data Entry',
  'Customer Service'
]

// Informal sector: Manual labor, services
const INFORMAL_SKILLS = [
  'Construction',
  'Cleaning',
  'Transportation',
  'Customer Service'
]

// All available skills (for anonymous users or when sector is not specified)
const ALL_SKILLS = [
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

/**
 * Get relevant skills based on user's work sector
 * @param workerSector - User's work sector ('professional' or 'informal')
 * @returns Array of skills relevant to the sector
 */
export function getSkillsBySector(
  workerSector: 'professional' | 'informal' | undefined
): string[] {
  if (!workerSector) {
    return ALL_SKILLS
  }

  return workerSector === 'professional' ? PROFESSIONAL_SKILLS : INFORMAL_SKILLS
}

/**
 * Get skills to display in filter (sector-aware)
 * @param workerSector - User's work sector
 * @param availableSkills - All possible skills (for filtering)
 * @returns Array of skills to display
 */
export function getRelevantSkills(
  workerSector: 'professional' | 'informal' | undefined,
  availableSkills: string[] = ALL_SKILLS
): string[] {
  const sectorSkills = getSkillsBySector(workerSector)

  // Filter to only include skills that are in the available skills list
  return sectorSkills.filter(skill => availableSkills.includes(skill))
}
