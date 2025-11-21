import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'

export function useJwkActions() {
  const navigate = useNavigate()

  const navigateToKeysList = useCallback(() => {
    navigate(ROUTES.KEYS_LIST)
  }, [navigate])

  return {
    navigateToKeysList,
  }
}
