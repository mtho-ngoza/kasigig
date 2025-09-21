import { User } from '@/types/auth'

export const INFORMAL_WORK_CATEGORIES = [
  'Construction', 'Transportation', 'Cleaning', 'Healthcare', 'Other'
]

export const INFORMAL_SKILLS = [
  'Construction', 'Plumbing', 'Electrical', 'Painting', 'Carpentry',
  'House Cleaning', 'Garden Maintenance', 'Moving Services', 'Handyman',
  'Vehicle Maintenance', 'Catering', 'Event Setup', 'Security', 'Childcare',
  'Elderly Care', 'Pet Care', 'Landscaping', 'Roof Repair', 'Tiling',
  'Bricklaying', 'Welding', 'Fencing', 'Pool Maintenance'
]

export function isInformalWorker(user: User): boolean {
  // First check if user has explicitly set work sector during signup
  if (user.workSector) {
    return user.workSector === 'informal'
  }

  // Fallback to skill-based detection for existing users
  if (!user.skills || user.skills.length === 0) {
    return false
  }

  // Check if user has any informal work skills
  const hasInformalSkills = user.skills.some(skill =>
    INFORMAL_SKILLS.some(informalSkill =>
      skill.toLowerCase().includes(informalSkill.toLowerCase()) ||
      informalSkill.toLowerCase().includes(skill.toLowerCase())
    )
  )

  return hasInformalSkills
}

export function getProfileSectionConfig(user: User, section: string) {
  const isInformal = isInformalWorker(user)

  const configs = {
    photo: {
      formal: {
        title: 'Profile Photo',
        description: 'Upload a professional photo to build trust with employers.',
        guidelines: [
          'Use a clear, well-lit photo of your face',
          'Look professional and approachable',
          'Avoid group photos, selfies, or distracting backgrounds',
          'Make sure you\'re looking directly at the camera',
          'Keep it recent (within the last 2 years)'
        ]
      },
      informal: {
        title: 'Your Photo',
        description: 'Add a photo so people can see who they\'re working with.',
        guidelines: [
          'Use a clear photo where we can see your face',
          'Smile and look friendly',
          'No need to be too formal - just be yourself',
          'Take the photo in good light',
          'A recent photo works best'
        ]
      }
    },

    skills: {
      formal: {
        title: 'Skills & Expertise',
        description: 'Add your skills, languages, and certifications to showcase your expertise.',
        skillsLabel: 'Skills & Expertise',
        certificationsLabel: 'Certifications & Qualifications',
        certificationsDescription: 'Add your professional certifications and qualifications'
      },
      informal: {
        title: 'What You Can Do',
        description: 'Tell people what kind of work you do and what you\'re good at.',
        skillsLabel: 'What kind of work do you do?',
        certificationsLabel: 'Do you have any certificates?',
        certificationsDescription: 'Any certificates or training you have (this is optional)'
      }
    },

    portfolio: {
      formal: {
        title: 'Portfolio',
        description: 'Showcase your best work to attract potential clients.',
        addItemText: 'Add Portfolio Item',
        emptyTitle: 'No Portfolio Items Yet',
        emptyDescription: 'Start building your portfolio by adding your best work. This helps clients see what you can deliver.'
      },
      informal: {
        title: 'Show Your Work',
        description: 'Add photos of good work you\'ve done before.',
        addItemText: 'Add Work Example',
        emptyTitle: 'No Work Examples Yet',
        emptyDescription: 'Show people the good work you do! Add photos of jobs you\'ve completed to help people trust you.'
      }
    },

    experience: {
      formal: {
        title: 'Experience & Rates',
        description: 'Add your experience level, rates, and availability to help clients understand your expertise.',
        experienceLabel: 'Experience Level',
        rateLabel: 'Hourly Rate (ZAR)',
        rateDescription: 'Set your hourly rate to help clients understand your pricing.',
        availabilityLabel: 'Availability',
        educationLabel: 'Education Level'
      },
      informal: {
        title: 'Your Experience & Rates',
        description: 'Tell people how long you\'ve been doing this work and what you charge.',
        experienceLabel: 'How long have you been doing this work?',
        rateLabel: 'What do you charge per hour? (ZAR)',
        rateDescription: 'What do you usually charge for your work? This helps people know what to expect.',
        availabilityLabel: 'When can you work?',
        educationLabel: 'School/Training'
      }
    }
  }

  const sectionConfig = configs[section as keyof typeof configs]
  if (!sectionConfig) return null

  return isInformal ? sectionConfig.informal : sectionConfig.formal
}

export function getProfileSectionIcon(section: string, isInformal: boolean) {
  const icons = {
    photo: isInformal ? '📷' : '📸',
    skills: isInformal ? '🔨' : '🛠️',
    portfolio: isInformal ? '📋' : '💼',
    experience: isInformal ? '⏰' : '🎯'
  }

  return icons[section as keyof typeof icons] || '📊'
}