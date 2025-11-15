/**
 * Market Rate Guidance Utility
 *
 * Provides category-specific minimum wage suggestions based on:
 * - South African National Minimum Wage (R27.58/hour as of 2024)
 * - Industry-specific rates and market standards
 * - Skill level and complexity of work
 */

export interface MarketRateGuidance {
  category: string
  minimumHourly: number // Minimum hourly rate in ZAR
  recommendedHourly: number // Recommended hourly rate in ZAR
  minimumDaily: number // Minimum daily rate (8 hours)
  recommendedDaily: number // Recommended daily rate
  minimumWeekly: number // Minimum weekly rate (5 days)
  recommendedWeekly: number // Recommended weekly rate
  description: string
  factors: string[] // Factors affecting rate
}

// South African National Minimum Wage (2024)
const SA_MINIMUM_WAGE_HOURLY = 27.58

/**
 * Get market rate guidance for a specific category
 */
export function getMarketRateGuidance(category: string): MarketRateGuidance {
  const guidance = MARKET_RATES[category] || MARKET_RATES['Other']

  return {
    ...guidance,
    category,
    minimumDaily: guidance.minimumHourly * 8,
    recommendedDaily: guidance.recommendedHourly * 8,
    minimumWeekly: guidance.minimumHourly * 8 * 5,
    recommendedWeekly: guidance.recommendedHourly * 8 * 5,
  }
}

/**
 * Validate if a budget meets minimum wage requirements for a category
 */
export function validateBudgetAgainstMinimum(
  budget: number,
  category: string,
  duration: string
): {
  isValid: boolean
  minimumRequired: number
  message?: string
} {
  const guidance = getMarketRateGuidance(category)
  let minimumRequired = 0

  // Parse duration to estimate hours/days
  const durationLower = duration.toLowerCase()

  if (durationLower.includes('hour')) {
    const hours = parseInt(durationLower) || 1
    minimumRequired = guidance.minimumHourly * hours
  } else if (durationLower.includes('day')) {
    const days = parseInt(durationLower) || 1
    minimumRequired = guidance.minimumDaily * days
  } else if (durationLower.includes('week')) {
    const weeks = parseInt(durationLower) || 1
    minimumRequired = guidance.minimumWeekly * weeks
  } else if (durationLower.includes('month')) {
    const months = parseInt(durationLower) || 1
    // Assume 4 weeks per month
    minimumRequired = guidance.minimumWeekly * 4 * months
  } else {
    // Default to 1 day minimum
    minimumRequired = guidance.minimumDaily
  }

  const isValid = budget >= minimumRequired

  return {
    isValid,
    minimumRequired,
    message: isValid
      ? undefined
      : `Budget is below minimum wage. Minimum required: R${minimumRequired.toFixed(2)} for ${duration} of ${category} work.`
  }
}

/**
 * Get budget suggestion based on category and duration
 */
export function suggestBudget(category: string, duration: string): {
  minimum: number
  recommended: number
  description: string
} {
  const guidance = getMarketRateGuidance(category)
  const durationLower = duration.toLowerCase()

  let minimum = 0
  let recommended = 0

  if (durationLower.includes('hour')) {
    const hours = parseInt(durationLower) || 1
    minimum = guidance.minimumHourly * hours
    recommended = guidance.recommendedHourly * hours
  } else if (durationLower.includes('day')) {
    const days = parseInt(durationLower) || 1
    minimum = guidance.minimumDaily * days
    recommended = guidance.recommendedDaily * days
  } else if (durationLower.includes('week')) {
    const weeks = parseInt(durationLower) || 1
    minimum = guidance.minimumWeekly * weeks
    recommended = guidance.recommendedWeekly * weeks
  } else if (durationLower.includes('month')) {
    const months = parseInt(durationLower) || 1
    minimum = guidance.minimumWeekly * 4 * months
    recommended = guidance.recommendedWeekly * 4 * months
  } else {
    // Default to daily rate
    minimum = guidance.minimumDaily
    recommended = guidance.recommendedDaily
  }

  return {
    minimum: Math.round(minimum),
    recommended: Math.round(recommended),
    description: guidance.description
  }
}

/**
 * Market rates by category
 * Based on SA minimum wage and industry standards
 */
const MARKET_RATES: Record<string, Omit<MarketRateGuidance, 'category' | 'minimumDaily' | 'recommendedDaily' | 'minimumWeekly' | 'recommendedWeekly'>> = {
  // Professional/Digital Work Categories
  'Technology': {
    minimumHourly: 150, // R150/hour minimum for tech work
    recommendedHourly: 350, // R350/hour recommended (skilled developers)
    description: 'Tech work typically requires specialized skills and commands higher rates',
    factors: ['Programming language expertise', 'Years of experience', 'Complexity of project', 'Technology stack']
  },

  'Design': {
    minimumHourly: 120,
    recommendedHourly: 280,
    description: 'Design work varies by experience and type (graphic, UI/UX, etc.)',
    factors: ['Design complexity', 'Experience level', 'Software proficiency', 'Portfolio quality']
  },

  'Writing': {
    minimumHourly: 80,
    recommendedHourly: 200,
    description: 'Writing rates depend on content type, research required, and expertise',
    factors: ['Content type', 'Research depth', 'Word count', 'Subject matter expertise']
  },

  'Marketing': {
    minimumHourly: 100,
    recommendedHourly: 250,
    description: 'Marketing rates vary by channel, campaign complexity, and results expected',
    factors: ['Marketing channel', 'Campaign scope', 'Analytics requirements', 'Brand size']
  },

  'Education': {
    minimumHourly: 80,
    recommendedHourly: 180,
    description: 'Tutoring and teaching rates depend on subject, level, and qualifications',
    factors: ['Subject difficulty', 'Student level', 'Teaching credentials', 'One-on-one vs group']
  },

  'Finance': {
    minimumHourly: 120,
    recommendedHourly: 300,
    description: 'Financial services require professional qualifications and accuracy',
    factors: ['Professional certification', 'Complexity of work', 'Compliance requirements', 'Business size']
  },

  'Legal': {
    minimumHourly: 150,
    recommendedHourly: 400,
    description: 'Legal work requires professional qualifications and carries responsibility',
    factors: ['Legal qualification', 'Case complexity', 'Risk level', 'Time sensitivity']
  },

  // Informal Work Categories
  'Cleaning': {
    minimumHourly: SA_MINIMUM_WAGE_HOURLY, // R27.58/hour
    recommendedHourly: 50, // R50/hour is common market rate
    description: 'Domestic and office cleaning at minimum wage or above',
    factors: ['Type of cleaning', 'Size of area', 'Deep clean vs maintenance', 'Equipment provided']
  },

  'Construction': {
    minimumHourly: 40, // Slightly above minimum wage for physical labor
    recommendedHourly: 100, // Skilled trades command higher rates
    description: 'Construction work varies greatly by skill level and specialization',
    factors: ['Skill level', 'Trade specialization', 'Experience', 'Safety requirements', 'Tools provided']
  },

  'Transportation': {
    minimumHourly: 35,
    recommendedHourly: 80,
    description: 'Transport rates depend on distance, vehicle type, and cargo',
    factors: ['Distance', 'Vehicle type', 'Cargo weight/size', 'Fuel costs', 'Loading/unloading']
  },

  'Healthcare': {
    minimumHourly: 60, // Healthcare work often requires certification
    recommendedHourly: 150,
    description: 'Home healthcare requires certification and carries responsibility',
    factors: ['Certification level', 'Care complexity', 'Patient needs', 'Schedule flexibility']
  },

  'Other': {
    minimumHourly: SA_MINIMUM_WAGE_HOURLY,
    recommendedHourly: 60,
    description: 'General labor and services at minimum wage or above',
    factors: ['Physical demands', 'Skill requirements', 'Working conditions', 'Hours/scheduling']
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `R${amount.toFixed(2)}`
}

/**
 * Get all available categories with their rate ranges
 */
export function getAllCategoryRates(): Array<{
  category: string
  hourlyRange: string
  dailyRange: string
}> {
  return Object.keys(MARKET_RATES).map(category => {
    const guidance = getMarketRateGuidance(category)
    return {
      category,
      hourlyRange: `${formatCurrency(guidance.minimumHourly)} - ${formatCurrency(guidance.recommendedHourly)}/hour`,
      dailyRange: `${formatCurrency(guidance.minimumDaily)} - ${formatCurrency(guidance.recommendedDaily)}/day`
    }
  })
}
