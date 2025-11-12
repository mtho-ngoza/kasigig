import {
  getSkillsBySector,
  getRelevantSkills
} from '@/lib/utils/skillRecommendations'

describe('skillRecommendations - Sector-based filtering', () => {
  describe('getSkillsBySector', () => {
    it('should return professional skills for professional sector', () => {
      const result = getSkillsBySector('professional')

      expect(result).toContain('React')
      expect(result).toContain('JavaScript')
      expect(result).toContain('TypeScript')
      expect(result).toContain('Node.js')
      expect(result).toContain('Python')
      expect(result).toContain('Design')
      expect(result).toContain('Marketing')
      expect(result).toContain('Writing')
      expect(result).toContain('Photography')
      expect(result).toContain('Video Editing')
      expect(result).toContain('Data Entry')
      expect(result).toContain('Customer Service')

      // Should not contain informal sector skills (except Customer Service which is in both)
      expect(result).not.toContain('Construction')
      expect(result).not.toContain('Cleaning')
      expect(result).not.toContain('Transportation')
    })

    it('should return informal skills for informal sector', () => {
      const result = getSkillsBySector('informal')

      expect(result).toContain('Construction')
      expect(result).toContain('Cleaning')
      expect(result).toContain('Transportation')
      expect(result).toContain('Customer Service')

      // Should not contain professional skills
      expect(result).not.toContain('React')
      expect(result).not.toContain('JavaScript')
      expect(result).not.toContain('Design')
      expect(result).not.toContain('Marketing')
    })

    it('should return all skills when sector is undefined', () => {
      const result = getSkillsBySector(undefined)

      // Should contain both professional and informal skills
      expect(result).toContain('React')
      expect(result).toContain('Construction')
      expect(result).toContain('Cleaning')
      expect(result).toContain('Design')
      expect(result).toContain('Marketing')
      expect(result).toContain('Transportation')
      expect(result.length).toBe(15) // All skills
    })
  })

  describe('getRelevantSkills', () => {
    it('should filter by available skills for professional sector', () => {
      const availableSkills = ['React', 'JavaScript', 'Construction']
      const result = getRelevantSkills('professional', availableSkills)

      expect(result).toContain('React')
      expect(result).toContain('JavaScript')
      expect(result).not.toContain('Construction') // Not in professional skills
      expect(result).not.toContain('TypeScript') // Not in available skills
    })

    it('should filter by available skills for informal sector', () => {
      const availableSkills = ['Construction', 'React', 'Cleaning']
      const result = getRelevantSkills('informal', availableSkills)

      expect(result).toContain('Construction')
      expect(result).toContain('Cleaning')
      expect(result).not.toContain('React') // Not in informal skills
      expect(result).not.toContain('Transportation') // Not in available skills
    })

    it('should return all available skills when sector is undefined', () => {
      const availableSkills = ['React', 'Construction', 'Design']
      const result = getRelevantSkills(undefined, availableSkills)

      expect(result).toContain('React')
      expect(result).toContain('Construction')
      expect(result).toContain('Design')
      expect(result.length).toBe(3)
    })

    it('should use default ALL_SKILLS when availableSkills not provided', () => {
      const result = getRelevantSkills('professional')

      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('React')
      expect(result).toContain('JavaScript')
    })
  })

  describe('Customer Service - appears in both sectors', () => {
    it('should include Customer Service in professional skills', () => {
      const result = getSkillsBySector('professional')
      expect(result).toContain('Customer Service')
    })

    it('should include Customer Service in informal skills', () => {
      const result = getSkillsBySector('informal')
      expect(result).toContain('Customer Service')
    })
  })

  describe('Skill counts', () => {
    it('should have 12 professional skills', () => {
      const result = getSkillsBySector('professional')
      expect(result.length).toBe(12)
    })

    it('should have 4 informal skills', () => {
      const result = getSkillsBySector('informal')
      expect(result.length).toBe(4)
    })

    it('should have 15 total unique skills', () => {
      const result = getSkillsBySector(undefined)
      expect(result.length).toBe(15)
    })
  })
})
