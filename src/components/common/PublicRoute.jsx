import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingScreen } from './LoadingScreen'

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Loading..." />
  }

  if (isAuthenticated) {
    // If user is already authenticated, redirect to /dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
