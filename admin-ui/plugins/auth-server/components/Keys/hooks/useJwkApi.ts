import { useEffect } from 'react'
import { useGetConfigJwks } from 'JansConfigApi'
import { devLogger } from '@/utils/devLogger'
import type { UseJwkApiResult } from '../types'

const stringifyError = (value: unknown): string => {
  if (value === null || value === undefined) return 'Unknown error'
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const useJwkApi = (): UseJwkApiResult => {
  const { data, isLoading, error, refetch } = useGetConfigJwks()

  useEffect(() => {
    if (error) {
      devLogger.error('Failed to fetch JWKs:', error)
    }
  }, [error])

  const normalizedError: Error | null = error ? new Error(stringifyError(error)) : null

  return {
    jwks: data,
    isLoading,
    error: normalizedError,
    refetch,
  }
}
