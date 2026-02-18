import React, { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { ROUTES } from '@/helpers/navigation'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.authReducer.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ROOT} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
