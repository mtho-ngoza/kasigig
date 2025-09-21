'use client'

import { useState } from 'react'

export default function PostGigPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    budget: '',
    duration: '',
    requirements: '',
    urgent: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement gig posting logic
    console.log('Posting gig:', formData)
    alert('Gig posted successfully! You\'ll start receiving applications soon.')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Post a New Gig</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Gig Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Garden cleanup needed"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                <option value="gardening">Gardening</option>
                <option value="cleaning">Cleaning</option>
                <option value="moving">Moving & Delivery</option>
                <option value="events">Event Assistance</option>
                <option value="pet-care">Pet Care</option>
                <option value="handyman">Handyman Tasks</option>
                <option value="admin">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe what needs to be done, any specific requirements, and what you're looking for..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="City, Area, or Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="e.g., 3 hours, Half day"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget (ZAR) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                required
                min="50"
                placeholder="e.g., 300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.budget}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                A 10-15% service fee will be added at checkout
              </p>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements & Skills Needed
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                placeholder="Any specific skills, tools, or requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.requirements}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="urgent"
                name="urgent"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.urgent}
                onChange={handleInputChange}
              />
              <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                This is urgent (additional R50 for priority listing)
              </label>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Pricing Breakdown:</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gig Payment:</span>
                  <span>R{formData.budget || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee (12%):</span>
                  <span>R{formData.budget ? Math.round(parseInt(formData.budget) * 0.12) : '0'}</span>
                </div>
                {formData.urgent && (
                  <div className="flex justify-between">
                    <span>Priority Listing:</span>
                    <span>R50</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Cost:</span>
                  <span>
                    R{formData.budget ?
                      Math.round(parseInt(formData.budget) * 1.12) + (formData.urgent ? 50 : 0) :
                      (formData.urgent ? '50' : '0')
                    }
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Post Gig & Pay
            </button>
          </form>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            By posting a gig, you agree to our terms of service. Payment will be held securely
            until the gig is completed to your satisfaction.
          </p>
        </div>
      </div>
    </div>
  )
}