import { useCallback } from 'react'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

export function useJwkActions() {
  const { navigateToRoute } = useAppNavigation()

  const navigateToKeysList = useCallback(() => {
    navigateToRoute(ROUTES.AUTH_SERVER_CONFIG_KEYS)
  }, [navigateToRoute])

  return {
    navigateToKeysList,
  }
}
