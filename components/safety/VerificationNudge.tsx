'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface VerificationNudgeProps {
  variant?: 'banner' | 'card' | 'inline'
  showStats?: boolean
  compact?: boolean
}

/**
 * VerificationNudge - Soft encouragement for users to get verified
 *
 * Displays informational messages about benefits of verification
 * without being pushy or blocking the user's workflow
 */
export function VerificationNudge({
  variant = 'card',
  showStats = true,
  compact = false
}: VerificationNudgeProps) {
  const router = useRouter()

  const handleVerify = () => {
    router.push('/dashboard/verification')
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900">
                Get Verified, Stand Out
              </h3>
            </div>
            {showStats && (
              <p className="text-sm text-gray-700 mb-3">
                <strong className="text-primary-700">Verified users get 3x more responses</strong> and earn 25% higher trust scores.
                Verification only takes 2 minutes!
              </p>
            )}
            {!showStats && (
              <p className="text-sm text-gray-700 mb-3">
                Increase your chances of landing gigs by verifying your identity.
              </p>
            )}
          </div>
          <Button
            onClick={handleVerify}
            size="sm"
            className="whitespace-nowrap"
          >
            Verify Now
          </Button>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
        <span className="text-xl">🛡️</span>
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            <strong className="text-primary-700">Boost your chances!</strong> Verified workers get 3x more responses.
          </p>
        </div>
        <Button
          onClick={handleVerify}
          size="sm"
          variant="outline"
        >
          Verify
        </Button>
      </div>
    )
  }

  // Default: card variant
  return (
    <Card className="bg-gradient-to-br from-white to-primary-50 border-primary-200">
      <div className={compact ? 'p-4' : 'p-6'}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">🛡️</div>
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
              Unlock More Opportunities with Verification
            </h3>

            {showStats && !compact && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-medium">✓</span>
                  <span><strong>3x more responses</strong> from employers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-medium">✓</span>
                  <span><strong>+25 trust score boost</strong> instantly</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-medium">✓</span>
                  <span><strong>Priority in search results</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-medium">✓</span>
                  <span>Build <strong>trust and credibility</strong></span>
                </div>
              </div>
            )}

            {showStats && compact && (
              <p className="text-sm text-gray-700 mb-3">
                Get 3x more responses and +25 trust score. Quick & easy verification.
              </p>
            )}

            {!showStats && (
              <p className="text-sm text-gray-700 mb-3">
                Stand out from the crowd and build trust with employers.
              </p>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleVerify}
                size={compact ? 'sm' : 'md'}
              >
                Get Verified Now
              </Button>
              <span className="text-xs text-gray-500">Only takes 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
