import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export function ProtectedRoute({ children, requireAuth = true, requireAdmin = false }) {
  const { currentUser } = useApp()

  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && (!currentUser || !currentUser.isAdmin)) {
    return <Navigate to="/" replace />
  }

  return children
}
