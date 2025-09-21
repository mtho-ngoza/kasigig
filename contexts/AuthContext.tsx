'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth'
import { FirebaseAuthService } from '@/lib/auth/firebase'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount and listen for auth changes
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      const user = await FirebaseAuthService.signIn(credentials)
      setUser(user)
      setIsLoading(false)
      return { success: true, message: 'Login successful!' }
    } catch (error: any) {
      setIsLoading(false)
      return { success: false, message: error.message || 'An error occurred during login' }
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validation
      if (data.password !== data.confirmPassword) {
        setIsLoading(false)
        return { success: false, message: 'Passwords do not match' }
      }

      if (data.password.length < 6) {
        setIsLoading(false)
        return { success: false, message: 'Password must be at least 6 characters long' }
      }

      // Check if user already exists
      const existingUser = storage.findUserByEmail(data.email)
      if (existingUser) {
        setIsLoading(false)
        return { success: false, message: 'An account with this email already exists' }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Simple ID generation for demo
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        location: data.location,
        userType: data.userType,
        idNumber: data.idNumber,
        rating: 0,
        completedGigs: 0,
        skills: [],
        badges: [],
        bio: '',
        createdAt: new Date()
      }

      // Save user to storage
      storage.addUser(newUser)

      // Log user in automatically
      setUser(newUser)
      storage.setUser(newUser)
      setIsLoading(false)

      return { success: true, message: 'Account created successfully!' }
    } catch (error) {
      setIsLoading(false)
      return { success: false, message: 'An error occurred during registration' }
    }
  }

  const logout = () => {
    setUser(null)
    storage.clearAuth()
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      storage.setUser(updatedUser)

      // Also update in users storage
      const users = storage.getUsers()
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('gig-sa-users', JSON.stringify(users))
      }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}