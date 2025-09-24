export interface SafetyReport {
  id: string
  reporterId: string
  reporteeId: string
  gigId?: string
  type: 'harassment' | 'unsafe_location' | 'fraud' | 'inappropriate_behavior' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  location?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface SafetyCheckIn {
  id: string
  userId: string
  gigId: string
  type: 'start' | 'progress' | 'complete' | 'emergency'
  location?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  message?: string
  emergencyContacted?: boolean
  createdAt: Date
}

export interface LocationSafetyRating {
  id: string
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  overallRating: number // 1-5 scale
  totalReports: number
  recentIncidents: number
  safetyScore: number // calculated score
  lastUpdated: Date
}

export interface TrustScoreHistory {
  id: string
  userId: string
  action: 'gig_completed' | 'positive_review' | 'verification_added' | 'report_filed' | 'report_against'
  scoreChange: number
  newScore: number
  reason: string
  gigId?: string
  createdAt: Date
}

export interface BackgroundCheck {
  id: string
  userId: string
  provider: string // e.g., 'persona', 'onfido', 'local_provider'
  status: 'pending' | 'verified' | 'failed' | 'expired'
  checkType: 'basic' | 'enhanced' | 'premium'
  results?: {
    criminalRecord: boolean
    identityVerified: boolean
    addressVerified: boolean
    employmentHistory?: boolean
    notes?: string
  }
  cost: number
  subsidized: boolean // for informal workers
  requestedAt: Date
  completedAt?: Date
  expiresAt?: Date
}

export interface SafeMeetingLocation {
  id: string
  name: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  type: 'shopping_mall' | 'library' | 'coffee_shop' | 'community_center' | 'police_station'
  safetyRating: number
  operatingHours: {
    [key: string]: { open: string; close: string } | null // null for closed days
  }
  amenities: string[]
  verified: boolean
  createdAt: Date
}