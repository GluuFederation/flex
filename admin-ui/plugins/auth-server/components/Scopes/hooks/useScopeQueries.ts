import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAttributes, useGetConfigScripts, useGetOauthScopes } from 'JansConfigApi'
import type { GetAttributesParams, GetOauthScopesParams } from 'JansConfigApi'
import type { ScopeScript, ScopeClaim } from '../types'
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

interface AttributeEntry {
  dn?: string
  name?: string
  key?: string
}

interface ConfigScriptEntry {
  dn?: string
  name?: string
  inum?: string
  scriptType?: string
  enabled?: boolean
}

export const useScopeAttributes = (params?: GetAttributesParams) => {
  const baseParams = useMemo<GetAttributesParams>(() => ({ ...params }), [params])

  const { data, isLoading, error } = useQuery<AttributeEntry[], Error>({
    queryKey: ['scope-all-attributes', baseParams],
    queryFn: async ({ signal }) => {
      const pageSize = baseParams.limit ?? DEFAULT_ATTRIBUTES_LIMIT
      const aggregated: AttributeEntry[] = []
      let startIndex = 0

      // Iterate pages until the API returns fewer than pageSize entries
      // (or until totalEntriesCount is reached) so no claims are truncated.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const page = await getAttributes(
          { ...baseParams, limit: pageSize, startIndex },
          undefined,
          signal,
        )
        const entries = (page?.entries ?? []) as AttributeEntry[]
        aggregated.push(...entries)

        const total = page?.totalEntriesCount
        if (entries.length < pageSize) break
        if (typeof total === 'number' && aggregated.length >= total) break

        startIndex += pageSize
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
