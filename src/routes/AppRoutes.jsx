import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { PublicRoute } from '../components/common/PublicRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Dashboard } from '../pages/Dashboard'
import { GroupDetails } from '../pages/GroupDetails'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes (guests only) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes (authenticated only) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
        </Route>
      </Route>

      {/* Default fallback route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
