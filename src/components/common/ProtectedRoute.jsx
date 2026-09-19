import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingScreen } from './LoadingScreen'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Checking authorization..." />
  }

  if (!isAuthenticated) {
    // Redirect to /login and preserve destination in state for post-login redirection
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
