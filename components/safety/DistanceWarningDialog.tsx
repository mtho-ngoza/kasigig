'use client'

import { Button } from '@/components/ui/Button'
import { DistanceWarningInfo, formatDistanceWarningMessage } from '@/lib/utils/distanceWarning'

interface DistanceWarningDialogProps {
  warningInfo: DistanceWarningInfo
  gigTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DistanceWarningDialog({
  warningInfo,
  gigTitle,
  onConfirm,
  onCancel
}: DistanceWarningDialogProps) {
  const warningMessage = formatDistanceWarningMessage(warningInfo)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Long Distance Notice
        </h2>

        {/* Gig Title */}
        <p className="text-sm text-gray-600 mb-2 text-center">
          Applying for: <span className="font-medium text-gray-900">{gigTitle}</span>
        </p>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-3">{warningMessage}</p>

          <p className="text-sm text-gray-700">
            Please consider:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Transportation costs and availability</li>
            <li>Travel time to and from the location</li>
            <li>Your ability to reliably attend this gig</li>
          </ul>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          Are you sure you want to apply for this gig?
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 order-1 sm:order-2"
          >
            Yes, Apply Anyway
          </Button>
        </div>

        {/* Safety Tip */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          💡 Tip: Always verify gig details and meet in safe, public locations when possible.
        </p>
      </div>
    </div>
  )
}
