import { useState, useCallback } from 'react'
import { cedarlingClient } from '../CedarlingClient'

export function useCedarling() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const authorize = useCallback(async (request) => {
    setIsLoading(true)
    setError(null)

    try {
      if (
        import.meta.env.REACT_APP_ENFORCE_WITH_CEDARLING &&
        import.meta.env.REACT_APP_ENFORCE_WITH_CEDARLING === 'true'
      ) {
        console.log('Enforcing Cedarling authorization')
        console.log('Request:', request)

        return await cedarlingClient.authorize(request)
      }

      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authorization failed')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { authorize, isLoading, error }
}
