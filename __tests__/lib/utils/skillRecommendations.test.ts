import {
  getRecommendedSkills,
  getTopRecommendedSkills
} from '@/lib/utils/skillRecommendations'

describe('skillRecommendations', () => {
  const availableSkills = [
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

  describe('getRecommendedSkills', () => {
    it('should return empty array when user has no skills', () => {
      const result = getRecommendedSkills(undefined, availableSkills)
      expect(result).toEqual([])
    })

    it('should return empty array when user skills array is empty', () => {
      const result = getRecommendedSkills([], availableSkills)
      expect(result).toEqual([])
    })

    it('should recommend related skills for React developer', () => {
      const userSkills = ['React']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).toContain('JavaScript')
      expect(result).toContain('TypeScript')
      expect(result).toContain('Node.js')
      expect(result).not.toContain('React') // Don't recommend what they already have
    })

    it('should recommend related skills for designer', () => {
      const userSkills = ['Design']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).toContain('React')
      expect(result).toContain('Photography')
      expect(result).toContain('Video Editing')
      expect(result).toContain('Marketing')
      expect(result).not.toContain('Design')
    })

    it('should recommend related skills for construction worker', () => {
      const userSkills = ['Construction']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).toContain('Transportation')
      expect(result).toContain('Cleaning')
      expect(result).not.toContain('Construction')
    })

    it('should recommend related skills for cleaning worker', () => {
      const userSkills = ['Cleaning']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).toContain('Construction')
      expect(result).toContain('Transportation')
      expect(result).toContain('Customer Service')
      expect(result).not.toContain('Cleaning') // Don't recommend what they already have
    })

    it('should not recommend skills user already has', () => {
      const userSkills = ['React', 'JavaScript', 'TypeScript']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).not.toContain('React')
      expect(result).not.toContain('JavaScript')
      expect(result).not.toContain('TypeScript')
    })

    it('should handle case-insensitive skill matching', () => {
      const userSkills = ['react', 'JAVASCRIPT']
      const result = getRecommendedSkills(userSkills, availableSkills)

      expect(result).toContain('TypeScript')
      expect(result).toContain('Node.js')
      expect(result).not.toContain('React')
      expect(result).not.toContain('JavaScript')
    })

    it('should aggregate recommendations from multiple user skills', () => {
      const userSkills = ['React', 'Photography']
      const result = getRecommendedSkills(userSkills, availableSkills)

      // From React cluster
      expect(result).toContain('JavaScript')
      expect(result).toContain('TypeScript')
      // From Photography cluster
      expect(result).toContain('Video Editing')
      expect(result).toContain('Design')
    })

    it('should only return skills that are in availableSkills', () => {
      const limitedSkills = ['React', 'JavaScript', 'TypeScript']
      const userSkills = ['React']
      const result = getRecommendedSkills(userSkills, limitedSkills)

      expect(result).toContain('JavaScript')
      expect(result).toContain('TypeScript')
      expect(result).not.toContain('Node.js') // Not in available skills
      expect(result).not.toContain('Design') // Not in available skills
    })
  })

  describe('getTopRecommendedSkills', () => {
    it('should limit results to 6 recommendations', () => {
      const userSkills = ['React', 'Design', 'Photography']
      const result = getTopRecommendedSkills(userSkills, availableSkills)

      expect(result.length).toBeLessThanOrEqual(6)
    })

    it('should return empty array when no recommendations', () => {
      const result = getTopRecommendedSkills(undefined, availableSkills)
      expect(result).toEqual([])
    })

    it('should return all recommendations if less than 6', () => {
      const userSkills = ['Construction']
      const result = getTopRecommendedSkills(userSkills, availableSkills)

      expect(result.length).toBeLessThanOrEqual(6)
      expect(result).toContain('Transportation')
      expect(result).toContain('Cleaning')
    })
  })
})
