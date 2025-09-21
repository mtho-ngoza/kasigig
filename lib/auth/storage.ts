import { User } from '@/types/auth'

const AUTH_STORAGE_KEY = 'gig-sa-auth'
const USERS_STORAGE_KEY = 'gig-sa-users'

export const storage = {
  // Get current authenticated user
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null

    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)
      return authData ? JSON.parse(authData) : null
    } catch (error) {
      console.error('Error getting user from storage:', error)
      return null
    }
  },

  // Set current authenticated user
  setUser: (user: User | null): void => {
    if (typeof window === 'undefined') return

    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error setting user in storage:', error)
    }
  },

  // Get all registered users (simulating a database)
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return []

    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Error getting users from storage:', error)
      return []
    }
  },

  // Add a new user to storage
  addUser: (user: User): void => {
    if (typeof window === 'undefined') return

    try {
      const users = storage.getUsers()
      users.push(user)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error adding user to storage:', error)
    }
  },

  // Find user by email
  findUserByEmail: (email: string): User | null => {
    const users = storage.getUsers()
    return users.find(user => user.email === email) || null
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window === 'undefined') return

    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}