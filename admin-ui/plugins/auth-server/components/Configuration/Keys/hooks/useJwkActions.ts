import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'

/**
 * Provides actions related to JWK configuration, including navigation to the keys list.
 *
 * @returns An object with `navigateToKeysList` — a function that navigates to the keys list route.
 */
export function useJwkActions() {
  const navigate = useNavigate()

  const navigateToKeysList = useCallback(() => {
    navigate(ROUTES.KEYS_LIST)
  }, [navigate])

  return {
    navigateToKeysList,
  }
}