import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

const ROUTES = {
  HOME_DASHBOARD: '/home/dashboard',
} as const

export const useAppNavigation = () => {
  const navigate = useNavigate()

  const navigateToHome = useCallback((): void => {
    navigate(ROUTES.HOME_DASHBOARD)
  }, [navigate])

  return useMemo(
    () => ({
      navigateToHome,
    }),
    [navigateToHome],
  )
}
