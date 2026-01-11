import toast from 'react-hot-toast'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isRegistered: boolean
  error: string | null
  
  // Actions
  login: (data: { email: string; password: string }) => Promise<void>
  registers: (data: { name: string; email: string; password: string; image?: string }) => Promise<void>
  logout: () => Promise<void>
  getProfile: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
}

// API base URL
const API_URL = 'http://localhost:8080/api/v1'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isRegistered: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Important for cookies
            body: JSON.stringify(data),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.errors || 'Login failed')
          }
          
          const userData = await response.json()
          
          set({ 
            user: userData.data, 
            isAuthenticated: true, 
            isLoading: false 
          })

          toast.success(userData?.message || 'Login successful!');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          })
          throw error
        }
      },

      registers: async (data) => {
        set({ isRegistered: true, error: null })
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Important for cookies
            body: JSON.stringify(data),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.errors || 'Registration failed')
          }
          
          const userData = await response.json()
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isRegistered: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isRegistered: false 
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          })
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, isAuthenticated: false, error: null })
        }
      },

      getProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_URL}/auth/get-profile`, {
            method: 'GET',
            credentials: 'include',
          })
          
          if (!response.ok) {
            throw new Error('Failed to get profile')
          }
          
          const userData = await response.json()
          
          set({ 
            user: userData.data, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          })
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
