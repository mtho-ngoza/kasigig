'use client'

import { useState, useEffect } from 'react'

interface Gig {
  id: string
  title: string
  description: string
  location: string
  category: string
  budget: number
  duration: string
  postedDate: Date
  employer: {
    name: string
    rating: number
  }
  urgent: boolean
}

const mockGigs: Gig[] = [
  {
    id: '1',
    title: 'Garden Cleanup',
    description: 'Need help cleaning up my garden, removing weeds and trimming bushes.',
    location: 'Sandton, Johannesburg',
    category: 'Gardening',
    budget: 300,
    duration: '4 hours',
    postedDate: new Date(),
    employer: {
      name: 'Sarah M.',
      rating: 4.8
    },
    urgent: false
  },
  {
    id: '2',
    title: 'Moving Help - Furniture',
    description: 'Looking for 2 people to help move furniture from apartment to new house.',
    location: 'Cape Town Central',
    category: 'Moving',
    budget: 600,
    duration: '6 hours',
    postedDate: new Date(),
    employer: {
      name: 'John D.',
      rating: 4.5
    },
    urgent: true
  },
  {
    id: '3',
    title: 'Event Setup Assistant',
    description: 'Help setting up tables, chairs and decorations for birthday party.',
    location: 'Durban North',
    category: 'Events',
    budget: 250,
    duration: '3 hours',
    postedDate: new Date(),
    employer: {
      name: 'Lisa P.',
      rating: 4.9
    },
    urgent: false
  }
]

export default function BrowseGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [filter, setFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    // Simulate API call
    setGigs(mockGigs)
  }, [])

  const filteredGigs = gigs.filter(gig => {
    const matchesCategory = filter === '' || gig.category.toLowerCase().includes(filter.toLowerCase())
    const matchesLocation = locationFilter === '' || gig.location.toLowerCase().includes(locationFilter.toLowerCase())
    return matchesCategory && matchesLocation
  })

  const handleApply = (gigId: string) => {
    // TODO: Implement application logic
    console.log('Applying to gig:', gigId)
    alert('Application sent! The employer will contact you if you\'re selected.')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Available Gigs</h1>

        {/* Filters */}
        <div className="mb-6 grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="gardening">Gardening</option>
              <option value="moving">Moving</option>
              <option value="events">Events</option>
              <option value="cleaning">Cleaning</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter city or area"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Gigs List */}
        <div className="space-y-4">
          {filteredGigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{gig.title}</h3>
                    {gig.urgent && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{gig.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>📍 {gig.location}</span>
                    <span>⏱️ {gig.duration}</span>
                    <span>🏷️ {gig.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    R{gig.budget}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {gig.employer.name} ⭐ {gig.employer.rating}
                  </div>
                  <button
                    onClick={() => handleApply(gig.id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGigs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No gigs found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}