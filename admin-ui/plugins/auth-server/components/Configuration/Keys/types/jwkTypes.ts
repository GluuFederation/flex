import type { JSONWebKey, WebKeysConfiguration } from 'JansConfigApi'

// Re-export orval types for convenience
export type { JSONWebKey, WebKeysConfiguration }

export type JwkItemProps = {
  item: JSONWebKey
  index: number
}

export type ReadOnlyFieldProps = {
  label: string
  value: string
  type?: 'text' | 'textarea'
  lsize?: number
  rsize?: number
  emptyPlaceholder?: string
}

export type JwkItemWithClassesProps = JwkItemProps & {
  classes: Record<string, string>
}

export type JwkListPageProps = {
  classes: Record<string, string>
}

export type UseJwkApiResult = {
  jwks: WebKeysConfiguration | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
