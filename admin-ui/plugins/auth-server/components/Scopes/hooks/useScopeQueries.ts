import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAttributes, useGetConfigScripts, useGetOauthScopes } from 'JansConfigApi'
import type { GetAttributesParams, GetOauthScopesParams } from 'JansConfigApi'
import type { ScopeScript, ScopeClaim, AttributeEntry, ConfigScriptEntry } from '../types'
import { SCOPE_CACHE_CONFIG, DEFAULT_ATTRIBUTES_LIMIT } from '../constants'

export const useScopes = (params: GetOauthScopesParams) => {
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

  return useGetOauthScopes(params, queryOptions)
}

export const useScopeAttributes = (params?: GetAttributesParams) => {
  const baseParams = useMemo<GetAttributesParams>(() => ({ ...params }), [params])

  const { data, isLoading, error } = useQuery<AttributeEntry[], Error>({
    queryKey: ['scope-all-attributes', baseParams],
    queryFn: async ({ signal }) => {
      const pageSizeClamped = Math.max(1, baseParams.limit ?? DEFAULT_ATTRIBUTES_LIMIT)
      const aggregated: AttributeEntry[] = []
      let startIndex = 0

      while (true) {
        const page = await getAttributes(
          { ...baseParams, limit: pageSizeClamped, startIndex },
          undefined,
          signal,
        )
        const entries = (page?.entries ?? []) as AttributeEntry[]
        aggregated.push(...entries)

        if (entries.length === 0) break
        const total = page?.totalEntriesCount
        if (entries.length < pageSizeClamped) break
        if (typeof total === 'number' && aggregated.length >= total) break

        startIndex += pageSizeClamped
      }

      return aggregated
    },
    staleTime: SCOPE_CACHE_CONFIG.staleTime,
    gcTime: SCOPE_CACHE_CONFIG.gcTime,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const attributes = useMemo<ScopeClaim[]>(() => {
    if (!data) return []
    return data.map((item) => ({
      dn: item.dn ?? '',
      name: item.name ?? '',
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
    return (data.entries as ConfigScriptEntry[]).map((item) => ({
      dn: item.dn ?? '',
      name: item.name ?? '',
      inum: item.inum,
      scriptType: item.scriptType,
      enabled: item.enabled,
    }))
  }, [data])

  return { scripts, isLoading, error }
}
