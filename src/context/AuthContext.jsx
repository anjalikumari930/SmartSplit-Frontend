import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'smartsplit_token'
const USER_KEY = 'smartsplit_user'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem(USER_KEY)
        return null
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Verify and hydrate session on initial mount
  const initializeAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    try {
      // Fetch fresh profile from backend
      const user = await userService.getCurrentUser()
      setCurrentUser(user)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (err) {
      console.warn('Session expired or invalid token:', err.message)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setToken(null)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeAuth()

    // Listen for global 401 unauthorized events from Axios interceptor
    const handleUnauthorized = () => {
      setToken(null)
      setCurrentUser(null)
    }

    window.addEventListener('smartsplit_unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('smartsplit_unauthorized', handleUnauthorized)
    }
  }, [initializeAuth])

  /**
   * Log in user with credentials
   */
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const jwtToken = await authService.login({ email, password })
      localStorage.setItem(TOKEN_KEY, jwtToken)
      setToken(jwtToken)

      // Fetch user profile using the new token
      const user = await userService.getCurrentUser()
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setCurrentUser(user)

      return user
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Sign up new user
   */
  const register = async (name, email, password) => {
    return await authService.signup({ name, email, password })
  }

  /**
   * Log out user and purge storage
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setCurrentUser(null)
  }

  const value = {
    token,
    currentUser,
    isAuthenticated: Boolean(token && currentUser),
    isLoading,
    login,
    register,
    logout,
    refreshUser: initializeAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
