'use client'

import React from 'react'

interface RatingDisplayProps {
  rating: number | null | undefined
  reviewCount?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function RatingDisplay({
  rating,
  reviewCount = 0,
  showCount = true,
  size = 'md',
  showLabel = false,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const starSize = sizeClasses[size]
  const textSize = textSizeClasses[size]

  // If no rating, show empty state
  if (!rating || rating === 0) {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSize} text-gray-300 fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        <span className={`${textSize} text-gray-400 ml-1`}>No reviews yet</span>
      </div>
    )
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center space-x-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <svg
          key={`full-${index}`}
          className={`${starSize} text-yellow-400 fill-current`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <svg
            className={`${starSize} text-gray-300 fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <svg
              className={`${starSize} text-yellow-400 fill-current`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <svg
          key={`empty-${index}`}
          className={`${starSize} text-gray-300 fill-current`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}

      {/* Rating value and count */}
      <div className={`${textSize} flex items-center space-x-1 ml-2`}>
        {showLabel && <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>}
        {showCount && reviewCount > 0 && (
          <span className="text-gray-500">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>
    </div>
  )
}
