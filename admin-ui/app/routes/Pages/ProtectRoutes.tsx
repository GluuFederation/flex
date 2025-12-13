import React, { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/helpers/navigation'
import type { AuthState } from '@/redux/features/types/authTypes'

interface ProtectedRouteProps {
  children: ReactNode
}

interface RootState {
  authReducer: AuthState
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.authReducer.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ROOT} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
