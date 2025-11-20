import { useEffect } from 'react'
import { useGetConfigJwks } from 'JansConfigApi'
import type { UseJwkApiResult } from '../types'

export const useJwkApi = (): UseJwkApiResult => {
  const { data, isLoading, error, refetch } = useGetConfigJwks()

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch JWKs:', error)
    }
  }, [error])

  const normalizedError = error ? (error instanceof Error ? error : new Error(String(error))) : null

  return {
    jwks: data,
    isLoading,
    error: normalizedError,
    refetch,
  }
}
