import { ReviewService } from '@/lib/database/reviewService'
import { FirestoreService } from '@/lib/database/firestore'
import { Review } from '@/types/gig'

// Mock FirestoreService
jest.mock('@/lib/database/firestore')

describe('ReviewService', () => {
  const mockReviewId = 'review-123'
  const mockUserId = 'user-456'
  const mockGigId = 'gig-789'
  const mockReviewerId = 'reviewer-111'
  const mockRevieweeId = 'reviewee-222'

  const mockReviewData: Omit<Review, 'id' | 'createdAt'> = {
    gigId: mockGigId,
    reviewerId: mockReviewerId,
    revieweeId: mockRevieweeId,
    rating: 4,
    comment: 'Great work! Very professional and delivered on time.',
    type: 'employer-to-worker',
  }

  const mockReview: Review = {
    id: mockReviewId,
    ...mockReviewData,
    createdAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createReview', () => {
    describe('given valid review data', () => {
      describe('when creating a review', () => {
        it('then creates review and updates user rating', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])
          jest.mocked(FirestoreService.create).mockResolvedValue(mockReviewId)
          jest.mocked(FirestoreService.update).mockResolvedValue()

          // When
          const reviewId = await ReviewService.createReview(mockReviewData)

          // Then
          expect(reviewId).toBe(mockReviewId)
          expect(FirestoreService.create).toHaveBeenCalledWith(
            'reviews',
            expect.objectContaining({
              ...mockReviewData,
              createdAt: expect.any(Date),
            })
          )
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'reviews',
            'revieweeId',
            '==',
            mockRevieweeId,
            'createdAt'
          )
        })
      })
    })

    describe('given rating below 1', () => {
      describe('when creating review', () => {
        it('then throws validation error', async () => {
          // Given
          const invalidReview = { ...mockReviewData, rating: 0 }

          // When & Then
          await expect(ReviewService.createReview(invalidReview)).rejects.toThrow(
            'Rating must be between 1 and 5'
          )
        })
      })
    })

    describe('given rating above 5', () => {
      describe('when creating review', () => {
        it('then throws validation error', async () => {
          // Given
          const invalidReview = { ...mockReviewData, rating: 6 }

          // When & Then
          await expect(ReviewService.createReview(invalidReview)).rejects.toThrow(
            'Rating must be between 1 and 5'
          )
        })
      })
    })

    describe('given duplicate review exists', () => {
      describe('when creating review', () => {
        it('then throws duplicate error', async () => {
          // Given
          const existingReview: Review = {
            ...mockReview,
            reviewerId: mockReviewData.reviewerId,
            revieweeId: mockReviewData.revieweeId,
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([existingReview])

          // When & Then
          await expect(ReviewService.createReview(mockReviewData)).rejects.toThrow(
            'You have already reviewed this user for this gig'
          )
        })
      })
    })
  })

  describe('getUserReviews', () => {
    describe('given user with reviews', () => {
      describe('when getting user reviews', () => {
        it('then returns all reviews for user', async () => {
          // Given
          const reviews = [mockReview, { ...mockReview, id: 'review-2' }]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getUserReviews(mockRevieweeId)

          // Then
          expect(result).toEqual(reviews)
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'reviews',
            'revieweeId',
            '==',
            mockRevieweeId,
            'createdAt'
          )
        })
      })
    })

    describe('given user with no reviews', () => {
      describe('when getting user reviews', () => {
        it('then returns empty array', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])

          // When
          const result = await ReviewService.getUserReviews(mockUserId)

          // Then
          expect(result).toEqual([])
        })
      })
    })
  })

  describe('getGigReviews', () => {
    describe('given gig with reviews', () => {
      describe('when getting gig reviews', () => {
        it('then returns all reviews for gig', async () => {
          // Given
          const reviews = [mockReview]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getGigReviews(mockGigId)

          // Then
          expect(result).toEqual(reviews)
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'reviews',
            'gigId',
            '==',
            mockGigId,
            'createdAt'
          )
        })
      })
    })
  })

  describe('getReviewsByReviewer', () => {
    describe('given reviewer with reviews', () => {
      describe('when getting reviews by reviewer', () => {
        it('then returns all reviews written by reviewer', async () => {
          // Given
          const reviews = [mockReview]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getReviewsByReviewer(mockReviewerId)

          // Then
          expect(result).toEqual(reviews)
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'reviews',
            'reviewerId',
            '==',
            mockReviewerId,
            'createdAt'
          )
        })
      })
    })
  })

  describe('getReviewById', () => {
    describe('given existing review ID', () => {
      describe('when getting review', () => {
        it('then returns the review', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockReview)

          // When
          const result = await ReviewService.getReviewById(mockReviewId)

          // Then
          expect(result).toEqual(mockReview)
          expect(FirestoreService.getById).toHaveBeenCalledWith('reviews', mockReviewId)
        })
      })
    })

    describe('given non-existent review ID', () => {
      describe('when getting review', () => {
        it('then returns null', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(null)

          // When
          const result = await ReviewService.getReviewById('non-existent')

          // Then
          expect(result).toBeNull()
        })
      })
    })
  })

  describe('updateReview', () => {
    describe('given valid update data', () => {
      describe('when updating review', () => {
        it('then updates review and user rating', async () => {
          // Given
          const updates = { rating: 5, comment: 'Updated comment' }
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockReview)
          jest.mocked(FirestoreService.update).mockResolvedValue()
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([mockReview])

          // When
          await ReviewService.updateReview(mockReviewId, updates)

          // Then
          expect(FirestoreService.update).toHaveBeenCalledWith(
            'reviews',
            mockReviewId,
            updates
          )
          expect(FirestoreService.getWhere).toHaveBeenCalledWith(
            'reviews',
            'revieweeId',
            '==',
            mockReview.revieweeId,
            'createdAt'
          )
        })
      })
    })

    describe('given invalid rating in update', () => {
      describe('when updating review', () => {
        it('then throws validation error', async () => {
          // Given
          const updates = { rating: 6 }

          // When & Then
          await expect(ReviewService.updateReview(mockReviewId, updates)).rejects.toThrow(
            'Rating must be between 1 and 5'
          )
        })
      })
    })

    describe('given non-existent review', () => {
      describe('when updating review', () => {
        it('then throws not found error', async () => {
          // Given
          const updates = { comment: 'Updated' }
          jest.mocked(FirestoreService.getById).mockResolvedValue(null)

          // When & Then
          await expect(ReviewService.updateReview(mockReviewId, updates)).rejects.toThrow(
            'Review not found'
          )
        })
      })
    })
  })

  describe('deleteReview', () => {
    describe('given existing review', () => {
      describe('when deleting review', () => {
        it('then deletes review and updates user rating', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(mockReview)
          jest.mocked(FirestoreService.delete).mockResolvedValue()
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])
          jest.mocked(FirestoreService.update).mockResolvedValue()

          // When
          await ReviewService.deleteReview(mockReviewId)

          // Then
          expect(FirestoreService.delete).toHaveBeenCalledWith('reviews', mockReviewId)
          expect(FirestoreService.update).toHaveBeenCalledWith(
            'users',
            mockReview.revieweeId,
            {
              rating: undefined,
              reviewCount: 0,
            }
          )
        })
      })
    })

    describe('given non-existent review', () => {
      describe('when deleting review', () => {
        it('then throws not found error', async () => {
          // Given
          jest.mocked(FirestoreService.getById).mockResolvedValue(null)

          // When & Then
          await expect(ReviewService.deleteReview(mockReviewId)).rejects.toThrow(
            'Review not found'
          )
        })
      })
    })
  })

  describe('getUserRating', () => {
    describe('given user with multiple reviews', () => {
      describe('when getting user rating', () => {
        it('then returns average rating and count', async () => {
          // Given
          const reviews = [
            { ...mockReview, rating: 5 },
            { ...mockReview, id: 'rev-2', rating: 4 },
            { ...mockReview, id: 'rev-3', rating: 5 },
          ]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getUserRating(mockUserId)

          // Then
          expect(result.rating).toBeCloseTo(4.7, 1)
          expect(result.reviewCount).toBe(3)
        })
      })
    })

    describe('given user with no reviews', () => {
      describe('when getting user rating', () => {
        it('then returns null rating and zero count', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])

          // When
          const result = await ReviewService.getUserRating(mockUserId)

          // Then
          expect(result.rating).toBeNull()
          expect(result.reviewCount).toBe(0)
        })
      })
    })

    describe('given user with perfect ratings', () => {
      describe('when getting user rating', () => {
        it('then returns 5.0 rating', async () => {
          // Given
          const reviews = [
            { ...mockReview, rating: 5 },
            { ...mockReview, id: 'rev-2', rating: 5 },
          ]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getUserRating(mockUserId)

          // Then
          expect(result.rating).toBe(5.0)
          expect(result.reviewCount).toBe(2)
        })
      })
    })
  })

  describe('canReview', () => {
    describe('given no existing review', () => {
      describe('when checking if can review', () => {
        it('then returns true', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])

          // When
          const result = await ReviewService.canReview(
            mockReviewerId,
            mockRevieweeId,
            mockGigId
          )

          // Then
          expect(result).toBe(true)
        })
      })
    })

    describe('given existing review from same reviewer', () => {
      describe('when checking if can review', () => {
        it('then returns false', async () => {
          // Given
          const existingReview: Review = {
            ...mockReview,
            reviewerId: mockReviewerId,
            revieweeId: mockRevieweeId,
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([existingReview])

          // When
          const result = await ReviewService.canReview(
            mockReviewerId,
            mockRevieweeId,
            mockGigId
          )

          // Then
          expect(result).toBe(false)
        })
      })
    })

    describe('given existing review from different reviewer', () => {
      describe('when checking if can review', () => {
        it('then returns true', async () => {
          // Given
          const existingReview: Review = {
            ...mockReview,
            reviewerId: 'different-reviewer',
            revieweeId: mockRevieweeId,
          }
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([existingReview])

          // When
          const result = await ReviewService.canReview(
            mockReviewerId,
            mockRevieweeId,
            mockGigId
          )

          // Then
          expect(result).toBe(true)
        })
      })
    })
  })

  describe('getUserReviewStats', () => {
    describe('given user with varied ratings', () => {
      describe('when getting review stats', () => {
        it('then returns average and distribution', async () => {
          // Given
          const reviews = [
            { ...mockReview, rating: 5 },
            { ...mockReview, id: 'rev-2', rating: 4 },
            { ...mockReview, id: 'rev-3', rating: 5 },
            { ...mockReview, id: 'rev-4', rating: 3 },
            { ...mockReview, id: 'rev-5', rating: 5 },
          ]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getUserReviewStats(mockUserId)

          // Then
          expect(result.averageRating).toBeCloseTo(4.4, 1)
          expect(result.totalReviews).toBe(5)
          expect(result.ratingDistribution).toEqual({
            1: 0,
            2: 0,
            3: 1,
            4: 1,
            5: 3,
          })
        })
      })
    })

    describe('given user with no reviews', () => {
      describe('when getting review stats', () => {
        it('then returns null average and empty distribution', async () => {
          // Given
          jest.mocked(FirestoreService.getWhere).mockResolvedValue([])

          // When
          const result = await ReviewService.getUserReviewStats(mockUserId)

          // Then
          expect(result.averageRating).toBeNull()
          expect(result.totalReviews).toBe(0)
          expect(result.ratingDistribution).toEqual({
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          })
        })
      })
    })

    describe('given user with all same ratings', () => {
      describe('when getting review stats', () => {
        it('then returns correct distribution', async () => {
          // Given
          const reviews = [
            { ...mockReview, rating: 4 },
            { ...mockReview, id: 'rev-2', rating: 4 },
            { ...mockReview, id: 'rev-3', rating: 4 },
          ]
          jest.mocked(FirestoreService.getWhere).mockResolvedValue(reviews)

          // When
          const result = await ReviewService.getUserReviewStats(mockUserId)

          // Then
          expect(result.averageRating).toBe(4.0)
          expect(result.totalReviews).toBe(3)
          expect(result.ratingDistribution).toEqual({
            1: 0,
            2: 0,
            3: 0,
            4: 3,
            5: 0,
          })
        })
      })
    })
  })
})
