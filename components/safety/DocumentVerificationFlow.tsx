'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { DocumentStorageService } from '@/lib/services/documentStorageService'
import { VerificationDocument } from '@/types/auth'
import DocumentUpload from './DocumentUpload'

interface DocumentVerificationFlowProps {
  verificationLevel: 'basic' | 'enhanced' | 'premium'
  onBack: () => void
  onComplete: () => void
}

export default function DocumentVerificationFlow({
  verificationLevel,
  onBack,
  onComplete
}: DocumentVerificationFlowProps) {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadExistingDocuments()
  }, [user, verificationLevel])

  const loadExistingDocuments = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // Load documents from Firebase Storage service
      const userDocs = await DocumentStorageService.getUserDocuments(user.id, verificationLevel)
      setDocuments(userDocs)
    } catch (error) {
      console.error('Error loading documents:', error)
      showError('Failed to load existing documents')
    } finally {
      setIsLoading(false)
    }
  }

  const getRequiredDocuments = () => {
    const commonFormats = ['pdf', 'jpg', 'png']

    switch (verificationLevel) {
      case 'basic':
        return [
          {
            type: 'sa_id' as const,
            title: 'South African ID Document',
            description: 'Upload a clear photo of your SA ID (both sides) or passport',
            acceptedFormats: commonFormats,
            maxSize: 10,
            required: true
          }
        ]

      case 'enhanced':
        return [
          {
            type: 'proof_of_address' as const,
            title: 'Proof of Address',
            description: 'Recent utility bill, bank statement, or municipal bill (not older than 3 months)',
            acceptedFormats: commonFormats,
            maxSize: 10,
            required: true
          },
          {
            type: 'bank_statement' as const,
            title: 'Bank Statement',
            description: 'Latest bank statement for financial verification',
            acceptedFormats: commonFormats,
            maxSize: 10,
            required: true
          }
        ]

      case 'premium':
        return [
          {
            type: 'employment_letter' as const,
            title: 'Employment Letter',
            description: 'Letter from current or recent employer, or business registration certificate',
            acceptedFormats: commonFormats,
            maxSize: 10,
            required: true
          },
          {
            type: 'reference_letter' as const,
            title: 'Reference Letters',
            description: 'At least 2 professional or character references',
            acceptedFormats: commonFormats,
            maxSize: 10,
            required: true
          }
        ]

      default:
        return []
    }
  }

  const handleDocumentUpload = async (documentType: string, documentData: VerificationDocument) => {
    try {
      // Document is already uploaded to Firebase Storage via DocumentStorageService
      // Just update local state to reflect the new document
      setDocuments(prev => {
        const existing = prev.findIndex(doc => doc.type === documentType)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = documentData
          return updated
        }
        return [...prev, documentData]
      })

      const docTitle = getRequiredDocuments().find(doc => doc.type === documentType)?.title || 'Document'
      success(`${docTitle} uploaded successfully! You can now submit for review.`)
    } catch (error) {
      console.error('Error updating document state:', error)
      showError('Failed to update document. Please try again.')
    }
  }

  const handleDocumentRemove = async (documentType: VerificationDocument['type'], silent = false) => {
    if (!user) return

    try {
      // Find the document to remove
      const documentToRemove = documents.find(doc => doc.type === documentType)
      if (!documentToRemove) {
        if (!silent) {
          showError('Document not found')
        }
        return
      }

      // Delete from Firebase Storage and database
      await DocumentStorageService.deleteDocument(documentToRemove.id, user.id)

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.type !== documentType))

      // Only show success message if not silent (i.e., explicit deletion, not replacement)
      if (!silent) {
        const docTitle = getRequiredDocuments().find(doc => doc.type === documentType)?.title || 'Document'
        success(`${docTitle} removed successfully.`)
      }
    } catch (error) {
      console.error('Error removing document:', error)
      showError(error instanceof Error ? error.message : 'Failed to remove document. Please try again.')
    }
  }

  const handleSubmitForReview = async () => {
    if (!user) return

    try {
      setIsSubmitting(true)

      // Update all draft documents to pending status
      const draftDocuments = documents.filter(doc => doc.status === 'draft')
      const updatePromises = draftDocuments.map(doc =>
        DocumentStorageService.updateDocumentStatus(doc.id, 'pending', undefined, undefined)
      )

      await Promise.all(updatePromises)

      // Update local state to reflect the status changes
      setDocuments(prev =>
        prev.map(doc =>
          doc.status === 'draft'
            ? { ...doc, status: 'pending' as const, submittedAt: new Date() }
            : doc
        )
      )

      success(`${verificationLevel.charAt(0).toUpperCase() + verificationLevel.slice(1)} verification submitted! You'll receive an email within 24-48 hours with the review results.`)
      onComplete()
    } catch (error) {
      console.error('Error submitting for review:', error)
      showError('Failed to submit verification. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const requiredDocs = getRequiredDocuments()
  const uploadedDocs = documents.reduce((acc, doc) => {
    acc[doc.type] = doc
    return acc
  }, {} as Record<string, VerificationDocument>)

  const allRequiredDocsUploaded = requiredDocs.every(reqDoc =>
    uploadedDocs[reqDoc.type] && uploadedDocs[reqDoc.type].status !== 'rejected'
  )

  const getVerificationTitle = () => {
    switch (verificationLevel) {
      case 'basic': return 'Basic Identity Verification'
      case 'enhanced': return 'Enhanced Background Check'
      case 'premium': return 'Premium Verification with References'
      default: return 'Document Verification'
    }
  }

  const getVerificationDescription = () => {
    switch (verificationLevel) {
      case 'basic':
        return 'Verify your identity with official South African documents. This helps employers trust you and gives you access to more opportunities.'
      case 'enhanced':
        return 'Enhanced verification includes address and financial checks. This significantly increases your trust score and access to higher-paying gigs.'
      case 'premium':
        return 'Premium verification includes comprehensive background checks and reference validation. This gives you the highest trust level on the platform.'
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getVerificationTitle()}</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            {getVerificationDescription()}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Verification
        </Button>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Verification Progress</p>
              <p className="text-sm text-gray-600">
                {Object.keys(uploadedDocs).length} of {requiredDocs.length} documents uploaded
              </p>
            </div>
            <div className="flex space-x-2">
              {requiredDocs.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < Object.keys(uploadedDocs).length
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Sections */}
      <div className="space-y-6">
        {requiredDocs.map((reqDoc) => (
          <DocumentUpload
            key={reqDoc.type}
            documentType={reqDoc.type}
            verificationLevel={verificationLevel}
            title={reqDoc.title}
            description={reqDoc.description}
            acceptedFormats={reqDoc.acceptedFormats}
            maxSize={reqDoc.maxSize}
            onUploadComplete={(docData) => handleDocumentUpload(reqDoc.type, docData)}
            onDocumentRemove={handleDocumentRemove}
            existingDocument={uploadedDocs[reqDoc.type]}
            canEdit={true} // Allow editing until submitted for review
          />
        ))}
      </div>

      {/* Submit Button */}
      {allRequiredDocsUploaded && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSubmitForReview}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? 'Submitting for Review...' : 'Submit for Review'}
          </Button>
        </div>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                1
              </div>
              <p>Upload all required documents using the forms above</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                2
              </div>
              <p>Our verification team will review your documents within 24-48 hours</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                3
              </div>
              <p>You'll receive an email with the verification results and any next steps</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                4
              </div>
              <p>Once verified, your trust score will be updated and you'll gain access to more opportunities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}