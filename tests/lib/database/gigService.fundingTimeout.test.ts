import { GigService } from '@/lib/database/gigService'
import { FirestoreService } from '@/lib/database/firestore'
import { GigApplication } from '@/types/gig'

// Mock FirestoreService
jest.mock('@/lib/database/firestore')

describe('GigService Funding Timeout Functions', () => {
  const mockApplication: GigApplication = {
    id: 'app-1',
    gigId: 'gig-1',
    applicantId: 'worker-1',
    applicantName: 'Worker Name',
    proposedRate: 1000,
    status: 'accepted',
    createdAt: new Date(),
    acceptedAt: new Date()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console methods to reduce noise in test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('timeoutUnfundedApplications', () => {
    it('should timeout accepted applications older than 48 hours', async () => {
      const oldApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 49 * 60 * 60 * 1000), // 49 hours ago
        status: 'accepted' as const
      }

      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([oldApplication])
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.timeoutUnfundedApplications()

      expect(result).toEqual({
        timedOut: 1
      })
      expect(FirestoreService.update).toHaveBeenCalledWith('applications', 'app-1', {
        status: 'rejected'
      })
      expect(FirestoreService.update).toHaveBeenCalledWith('gigs', 'gig-1', {
        assignedTo: undefined,
        updatedAt: expect.any(Date)
      })
    })

    it('should not timeout accepted applications within 48 hours', async () => {
      const recentApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        status: 'accepted' as const
      }

      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([recentApplication])
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.timeoutUnfundedApplications()

      expect(result).toEqual({
        timedOut: 0
      })
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should not timeout applications without acceptedAt timestamp', async () => {
      const noTimestampApp = {
        ...mockApplication,
        acceptedAt: undefined,
        status: 'accepted' as const
      }

      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([noTimestampApp])
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.timeoutUnfundedApplications()

      expect(result).toEqual({
        timedOut: 0
      })
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should timeout multiple old applications', async () => {
      const app1 = {
        ...mockApplication,
        id: 'app-1',
        gigId: 'gig-1',
        acceptedAt: new Date(Date.now() - 50 * 60 * 60 * 1000), // 50 hours ago
        status: 'accepted' as const
      }

      const app2 = {
        ...mockApplication,
        id: 'app-2',
        gigId: 'gig-2',
        acceptedAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 72 hours ago
        status: 'accepted' as const
      }

      const app3 = {
        ...mockApplication,
        id: 'app-3',
        gigId: 'gig-3',
        acceptedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago (should not timeout)
        status: 'accepted' as const
      }

      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([app1, app2, app3])
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.timeoutUnfundedApplications()

      expect(result).toEqual({
        timedOut: 2
      })
      expect(FirestoreService.update).toHaveBeenCalledTimes(4) // 2 apps + 2 gigs
    })

    it('should handle errors gracefully and continue processing', async () => {
      const app1 = {
        ...mockApplication,
        id: 'app-1',
        acceptedAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
        status: 'accepted' as const
      }

      const app2 = {
        ...mockApplication,
        id: 'app-2',
        acceptedAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
        status: 'accepted' as const
      }

      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([app1, app2])
      ;(FirestoreService.update as jest.Mock)
        .mockResolvedValueOnce(undefined) // app-1 application update
        .mockResolvedValueOnce(undefined) // app-1 gig update
        .mockRejectedValueOnce(new Error('Network error')) // app-2 fails

      const result = await GigService.timeoutUnfundedApplications()

      // Should still timeout app-1 despite error on app-2
      expect(result.timedOut).toBe(1)
      expect(console.error).toHaveBeenCalledWith(
        'Error timing out application app-2:',
        expect.any(Error)
      )
    })

    it('should handle no accepted applications', async () => {
      ;(FirestoreService.getWhere as jest.Mock).mockResolvedValue([])

      const result = await GigService.timeoutUnfundedApplications()

      expect(result).toEqual({
        timedOut: 0
      })
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })
  })

  describe('checkAndTimeoutApplication', () => {
    it('should timeout an accepted application older than 48 hours', async () => {
      const oldApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 50 * 60 * 60 * 1000), // 50 hours ago
        status: 'accepted' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(oldApplication)
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(true)
      expect(FirestoreService.update).toHaveBeenCalledWith('applications', 'app-1', {
        status: 'rejected'
      })
      expect(FirestoreService.update).toHaveBeenCalledWith('gigs', 'gig-1', {
        assignedTo: undefined,
        updatedAt: expect.any(Date)
      })
    })

    it('should not timeout a recent accepted application', async () => {
      const recentApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        status: 'accepted' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(recentApplication)
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should not timeout a funded application', async () => {
      const fundedApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 60 * 60 * 60 * 1000), // 60 hours ago
        status: 'funded' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(fundedApplication)
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should return false for non-existent application', async () => {
      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(null)

      const result = await GigService.checkAndTimeoutApplication('non-existent')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should not timeout applications without acceptedAt timestamp', async () => {
      const noTimestampApp = {
        ...mockApplication,
        acceptedAt: undefined,
        status: 'accepted' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(noTimestampApp)
      ;(FirestoreService.update as jest.Mock).mockResolvedValue(undefined)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should not timeout pending applications', async () => {
      const pendingApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
        status: 'pending' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(pendingApplication)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })

    it('should not timeout rejected applications', async () => {
      const rejectedApplication = {
        ...mockApplication,
        acceptedAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
        status: 'rejected' as const
      }

      ;(FirestoreService.getById as jest.Mock).mockResolvedValue(rejectedApplication)

      const result = await GigService.checkAndTimeoutApplication('app-1')

      expect(result).toBe(false)
      expect(FirestoreService.update).not.toHaveBeenCalled()
    })
  })
})
