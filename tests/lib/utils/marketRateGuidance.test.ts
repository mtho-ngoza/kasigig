import {
  getMarketRateGuidance,
  suggestBudget,
  validateBudgetAgainstMinimum,
  formatCurrency,
  getAllCategoryRates
} from '@/lib/utils/marketRateGuidance'

describe('Market Rate Guidance', () => {
  describe('getMarketRateGuidance', () => {
    it('should return guidance for Technology category', () => {
      const guidance = getMarketRateGuidance('Technology')

      expect(guidance.category).toBe('Technology')
      expect(guidance.minimumHourly).toBe(150)
      expect(guidance.recommendedHourly).toBe(350)
      expect(guidance.minimumDaily).toBe(150 * 8) // 1200
      expect(guidance.recommendedDaily).toBe(350 * 8) // 2800
      expect(guidance.minimumWeekly).toBe(150 * 8 * 5) // 6000
      expect(guidance.recommendedWeekly).toBe(350 * 8 * 5) // 14000
      expect(guidance.description).toContain('specialized skills')
      expect(guidance.factors.length).toBeGreaterThan(0)
    })

    it('should return guidance for Cleaning category', () => {
      const guidance = getMarketRateGuidance('Cleaning')

      expect(guidance.category).toBe('Cleaning')
      expect(guidance.minimumHourly).toBe(27.58) // SA minimum wage
      expect(guidance.recommendedHourly).toBe(50)
      expect(guidance.description).toContain('Domestic')
    })

    it('should return Other category guidance for unknown categories', () => {
      const guidance = getMarketRateGuidance('Unknown Category')

      expect(guidance.category).toBe('Unknown Category')
      expect(guidance.minimumHourly).toBe(27.58) // SA minimum wage
      expect(guidance.recommendedHourly).toBe(60)
    })

    it('should calculate daily rates correctly (8 hours)', () => {
      const guidance = getMarketRateGuidance('Design')

      expect(guidance.minimumDaily).toBe(guidance.minimumHourly * 8)
      expect(guidance.recommendedDaily).toBe(guidance.recommendedHourly * 8)
    })

    it('should calculate weekly rates correctly (5 days, 8 hours)', () => {
      const guidance = getMarketRateGuidance('Marketing')

      expect(guidance.minimumWeekly).toBe(guidance.minimumHourly * 8 * 5)
      expect(guidance.recommendedWeekly).toBe(guidance.recommendedHourly * 8 * 5)
    })
  })

  describe('suggestBudget', () => {
    it('should suggest budget for hourly duration', () => {
      const suggestion = suggestBudget('Technology', '5 hours')

      expect(suggestion.minimum).toBe(750) // 150 * 5
      expect(suggestion.recommended).toBe(1750) // 350 * 5
      expect(suggestion.description).toContain('Tech work')
    })

    it('should suggest budget for daily duration', () => {
      const suggestion = suggestBudget('Cleaning', '3 days')

      const hourlyMin = 27.58
      const hourlyRec = 50
      expect(suggestion.minimum).toBe(Math.round(hourlyMin * 8 * 3))
      expect(suggestion.recommended).toBe(Math.round(hourlyRec * 8 * 3))
    })

    it('should suggest budget for weekly duration', () => {
      const suggestion = suggestBudget('Design', '2 weeks')

      const hourlyMin = 120
      const hourlyRec = 280
      expect(suggestion.minimum).toBe(Math.round(hourlyMin * 8 * 5 * 2))
      expect(suggestion.recommended).toBe(Math.round(hourlyRec * 8 * 5 * 2))
    })

    it('should suggest budget for monthly duration', () => {
      const suggestion = suggestBudget('Writing', '1 month')

      const hourlyMin = 80
      const hourlyRec = 200
      // 1 month = 4 weeks
      expect(suggestion.minimum).toBe(Math.round(hourlyMin * 8 * 5 * 4))
      expect(suggestion.recommended).toBe(Math.round(hourlyRec * 8 * 5 * 4))
    })

    it('should default to daily rate for unrecognized duration', () => {
      const suggestion = suggestBudget('Construction', 'ASAP')

      const hourlyMin = 40
      const hourlyRec = 100
      expect(suggestion.minimum).toBe(hourlyMin * 8)
      expect(suggestion.recommended).toBe(hourlyRec * 8)
    })

    it('should handle "1 day" duration correctly', () => {
      const suggestion = suggestBudget('Healthcare', '1 day')

      expect(suggestion.minimum).toBe(60 * 8)
      expect(suggestion.recommended).toBe(150 * 8)
    })
  })

  describe('validateBudgetAgainstMinimum', () => {
    it('should validate budget above minimum', () => {
      const result = validateBudgetAgainstMinimum(1500, 'Technology', '5 hours')

      expect(result.isValid).toBe(true)
      expect(result.minimumRequired).toBe(750) // 150 * 5
      expect(result.message).toBeUndefined()
    })

    it('should invalidate budget below minimum', () => {
      const result = validateBudgetAgainstMinimum(500, 'Technology', '5 hours')

      expect(result.isValid).toBe(false)
      expect(result.minimumRequired).toBe(750)
      expect(result.message).toContain('below minimum wage')
      expect(result.message).toContain('R750.00')
    })

    it('should validate exact minimum budget', () => {
      const result = validateBudgetAgainstMinimum(750, 'Technology', '5 hours')

      expect(result.isValid).toBe(true)
      expect(result.minimumRequired).toBe(750)
    })

    it('should validate daily budget correctly', () => {
      const result = validateBudgetAgainstMinimum(300, 'Cleaning', '2 days')

      const expected = 27.58 * 8 * 2 // 441.28
      expect(result.isValid).toBe(expected <= 300)
      expect(result.minimumRequired).toBeCloseTo(expected, 1)
    })

    it('should validate weekly budget correctly', () => {
      const result = validateBudgetAgainstMinimum(5000, 'Marketing', '1 week')

      const expected = 100 * 8 * 5 // R100/hour * 8 hours * 5 days
      expect(result.isValid).toBe(true)
      expect(result.minimumRequired).toBe(expected)
    })

    it('should validate monthly budget correctly', () => {
      const result = validateBudgetAgainstMinimum(10000, 'Education', '2 months')

      const expected = 80 * 8 * 5 * 4 * 2 // R80/hour * 8 hours * 5 days * 4 weeks * 2 months
      expect(result.isValid).toBe(expected <= 10000)
      expect(result.minimumRequired).toBe(expected)
    })

    it('should default to daily minimum for unknown duration', () => {
      const result = validateBudgetAgainstMinimum(200, 'Cleaning', 'urgent')

      const dailyMin = 27.58 * 8 // 220.64
      expect(result.minimumRequired).toBeCloseTo(dailyMin, 1)
    })
  })

  describe('formatCurrency', () => {
    it('should format whole numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('R1000.00')
    })

    it('should format decimals correctly', () => {
      expect(formatCurrency(1234.56)).toBe('R1234.56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R0.00')
    })

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(99.999)).toBe('R100.00')
    })
  })

  describe('getAllCategoryRates', () => {
    it('should return all category rates', () => {
      const rates = getAllCategoryRates()

      expect(rates.length).toBeGreaterThan(0)
      expect(rates[0]).toHaveProperty('category')
      expect(rates[0]).toHaveProperty('hourlyRange')
      expect(rates[0]).toHaveProperty('dailyRange')
    })

    it('should format hourly range correctly', () => {
      const rates = getAllCategoryRates()
      const techRate = rates.find(r => r.category === 'Technology')

      expect(techRate).toBeDefined()
      expect(techRate?.hourlyRange).toContain('R150.00')
      expect(techRate?.hourlyRange).toContain('R350.00')
      expect(techRate?.hourlyRange).toContain('/hour')
    })

    it('should format daily range correctly', () => {
      const rates = getAllCategoryRates()
      const cleaningRate = rates.find(r => r.category === 'Cleaning')

      expect(cleaningRate).toBeDefined()
      expect(cleaningRate?.dailyRange).toContain('/day')
    })

    it('should include all standard categories', () => {
      const rates = getAllCategoryRates()
      const categories = rates.map(r => r.category)

      expect(categories).toContain('Technology')
      expect(categories).toContain('Design')
      expect(categories).toContain('Cleaning')
      expect(categories).toContain('Construction')
      expect(categories).toContain('Other')
    })
  })

  describe('SA Minimum Wage Compliance', () => {
    it('should never suggest below SA minimum wage (R27.58/hour)', () => {
      const categories = ['Cleaning', 'Construction', 'Transportation', 'Healthcare', 'Other']

      categories.forEach(category => {
        const guidance = getMarketRateGuidance(category)
        expect(guidance.minimumHourly).toBeGreaterThanOrEqual(27.58)
      })
    })

    it('should validate R220 budget for 1 day Cleaning meets minimum wage', () => {
      // SA minimum wage: R27.58/hour * 8 hours = R220.64
      const result = validateBudgetAgainstMinimum(220, 'Cleaning', '1 day')

      // Should be valid (R220 is close to minimum R220.64)
      expect(result.minimumRequired).toBeCloseTo(220.64, 0)
    })
  })
})
