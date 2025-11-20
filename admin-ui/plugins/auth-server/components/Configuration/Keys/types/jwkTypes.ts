import type { JSONWebKey, WebKeysConfiguration } from 'JansConfigApi'

// Re-export orval types for convenience
export type { JSONWebKey, WebKeysConfiguration }

// Component prop types
export interface JwkItemProps {
  item: JSONWebKey
  index: number
}

// Hook return types
export interface UseJwkApiResult {
  jwks: WebKeysConfiguration | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
