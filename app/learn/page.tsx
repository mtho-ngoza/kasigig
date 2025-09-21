'use client'

import { useState } from 'react'

interface SkillModule {
  id: string
  title: string
  description: string
  duration: string
  category: 'soft-skills' | 'practical-skills' | 'safety'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  badge: string
  completed: boolean
}

const skillModules: SkillModule[] = [
  {
    id: '1',
    title: 'Professional Communication',
    description: 'Learn how to communicate effectively with employers and clients',
    duration: '15 min',
    category: 'soft-skills',
    difficulty: 'beginner',
    badge: '💬',
    completed: false
  },
  {
    id: '2',
    title: 'Time Management Basics',
    description: 'Master the art of managing your time and meeting deadlines',
    duration: '20 min',
    category: 'soft-skills',
    difficulty: 'beginner',
    badge: '⏰',
    completed: true
  },
  {
    id: '3',
    title: 'Customer Service Excellence',
    description: 'Provide outstanding service that keeps clients coming back',
    duration: '25 min',
    category: 'soft-skills',
    difficulty: 'intermediate',
    badge: '⭐',
    completed: false
  },
  {
    id: '4',
    title: 'Basic Budgeting',
    description: 'Learn to manage your earnings and plan for the future',
    duration: '30 min',
    category: 'practical-skills',
    difficulty: 'beginner',
    badge: '💰',
    completed: false
  },
  {
    id: '5',
    title: 'Workplace Safety',
    description: 'Essential safety practices for various work environments',
    duration: '18 min',
    category: 'safety',
    difficulty: 'beginner',
    badge: '🛡️',
    completed: false
  },
  {
    id: '6',
    title: 'Building Your Reputation',
    description: 'How to build trust and get positive reviews',
    duration: '22 min',
    category: 'soft-skills',
    difficulty: 'intermediate',
    badge: '🏆',
    completed: false
  }
]

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [modules, setModules] = useState(skillModules)

  const filteredModules = modules.filter(module =>
    selectedCategory === 'all' || module.category === selectedCategory
  )

  const completedCount = modules.filter(m => m.completed).length
  const totalCount = modules.length

  const handleStartModule = (moduleId: string) => {
    // TODO: Implement module content view
    console.log('Starting module:', moduleId)
    alert('Module content would open here. This will include video lessons, quizzes, and practical exercises.')
  }

  const categories = [
    { value: 'all', label: 'All Skills', icon: '📚' },
    { value: 'soft-skills', label: 'Soft Skills', icon: '🤝' },
    { value: 'practical-skills', label: 'Practical Skills', icon: '🔧' },
    { value: 'safety', label: 'Safety', icon: '🛡️' }
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">GIG-Skills Learning Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build essential skills to become a more successful and reliable gig worker
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-blue-600">{completedCount}</span>
              <span className="text-gray-600">/{totalCount} modules completed</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">Skill Badges Earned</div>
              <div className="flex gap-2 mt-2">
                {modules.filter(m => m.completed).map(module => (
                  <span key={module.id} className="text-2xl" title={module.title}>
                    {module.badge}
                  </span>
                ))}
                {completedCount === 0 && (
                  <span className="text-gray-400">Complete modules to earn badges</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <div
              key={module.id}
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all hover:shadow-lg ${
                module.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{module.badge}</div>
                <div className="flex items-center gap-2">
                  {module.completed && (
                    <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Completed
                    </div>
                  )}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    module.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {module.difficulty}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⏱️ {module.duration}</span>
                <span className="capitalize">{module.category.replace('-', ' ')}</span>
              </div>

              <button
                onClick={() => handleStartModule(module.id)}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  module.completed
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {module.completed ? 'Review Module' : 'Start Learning'}
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Boost Your Earning Potential</h2>
          <p className="text-lg mb-6 opacity-90">
            Complete skill modules to earn badges on your profile and attract more employers
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm opacity-75">More applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">40%</div>
              <div className="text-sm opacity-75">Higher ratings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">R250</div>
              <div className="text-sm opacity-75">Average earnings boost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}