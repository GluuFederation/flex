import { useMemo } from 'react'
import { useGetAttributes, useGetConfigScripts } from 'JansConfigApi'
import type { GetAttributesParams } from 'JansConfigApi'
import type { ScopeScript, ScopeClaim } from '../types'
import { SCOPE_CACHE_CONFIG, DEFAULT_ATTRIBUTES_LIMIT } from '../constants'

export const useScopeAttributes = (params?: GetAttributesParams) => {
  const queryParams = useMemo<GetAttributesParams>(
    () => ({
      limit: DEFAULT_ATTRIBUTES_LIMIT,
      ...params,
    }),
    [params],
  )

  const queryOptions = useMemo(
    () => ({
      query: {
        staleTime: SCOPE_CACHE_CONFIG.staleTime,
        gcTime: SCOPE_CACHE_CONFIG.gcTime,
        refetchOnWindowFocus: false,
        retry: false,
      },
    }),
    [],
  )

  const { data, isLoading, error } = useGetAttributes(queryParams, queryOptions)

  const attributes = useMemo<ScopeClaim[]>(() => {
    if (!data?.entries) return []
    return (data.entries as unknown as ScopeClaim[]).map((item) => ({
      dn: item.dn,
      name: item.name,
      key: item.key,
    }))
  }, [data])

  return { attributes, isLoading, error }
}

export const useScopeScripts = () => {
  const queryOptions = useMemo(
    () => ({
      query: {
        staleTime: SCOPE_CACHE_CONFIG.staleTime,
        gcTime: SCOPE_CACHE_CONFIG.gcTime,
        refetchOnWindowFocus: false,
        retry: false,
      },
    }),
    [],
  )

  const { data, isLoading, error } = useGetConfigScripts(undefined, queryOptions)

  const scripts = useMemo<ScopeScript[]>(() => {
    if (!data?.entries) return []
    return (data.entries as unknown as ScopeScript[]).map((item) => ({
      dn: item.dn,
      name: item.name,
      inum: item.inum,
      scriptType: item.scriptType,
      enabled: item.enabled,
    }))
  }, [data])

  return { scripts, isLoading, error }
}
