import { useMemo, useState, useCallback } from 'react'
import { useGetOauthScopes } from 'JansConfigApi'
import { transformScopesResponse } from '../helper/utils'
import { DEFAULT_SCOPE_SEARCH_LIMIT } from '../helper/constants'
import { useDebounce } from './useDebounce'

export const useClientScopes = (initialLimit = DEFAULT_SCOPE_SEARCH_LIMIT) => {
  const [scopeSearchPattern, setScopeSearchPattern] = useState('')
  const debouncedSearchPattern = useDebounce(scopeSearchPattern, 300)

  const scopeQueryParams = useMemo(
    () => ({
      limit: initialLimit,
      pattern: debouncedSearchPattern || undefined,
    }),
    [initialLimit, debouncedSearchPattern],
  )

  const {
    data: scopesResponse,
    isLoading: scopesLoading,
    error: scopesError,
  } = useGetOauthScopes(scopeQueryParams, {
    query: {
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  })

  const scopes = useMemo(
    () => transformScopesResponse(scopesResponse?.entries),
    [scopesResponse?.entries],
  )

  const handleScopeSearch = useCallback((pattern: string) => {
    setScopeSearchPattern(pattern)
  }, [])

  return {
    scopes,
    scopesLoading,
    scopesError,
    handleScopeSearch,
    scopeSearchPattern,
  }
}
