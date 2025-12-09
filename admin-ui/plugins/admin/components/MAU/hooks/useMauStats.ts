import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetStat, type GetStatParams, type JsonNode } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import type { MauStatEntry, MauDateRange, RawStatEntry, MauSummary } from '../types'
import { MAU_CACHE_CONFIG } from '../constants'
import {
  augmentMauData,
  transformRawStatEntry,
  formatDateForApi,
  calculatePercentChange,
} from '../utils'

function transformApiResponse(data: JsonNode[] | undefined): MauStatEntry[] {
  if (!data || !Array.isArray(data)) {
    return []
  }

  return data.map((item) => {
    const rawEntry = item as unknown as RawStatEntry
    return transformRawStatEntry(rawEntry)
  })
}

function computeSummary(data: MauStatEntry[]): MauSummary {
  if (data.length === 0) {
    return {
      totalMau: 0,
      totalTokens: 0,
      clientCredentialsTokens: 0,
      authCodeTokens: 0,
      mauChange: 0,
      tokenChange: 0,
    }
  }

  const totalMau = data.reduce((sum, entry) => sum + entry.mau, 0)
  const clientCredentialsTokens = data.reduce(
    (sum, entry) => sum + entry.client_credentials_access_token_count,
    0,
  )
  const authCodeTokens = data.reduce(
    (sum, entry) => sum + entry.authz_code_access_token_count + entry.authz_code_idtoken_count,
    0,
  )
  const totalTokens = clientCredentialsTokens + authCodeTokens

  if (data.length === 1) {
    return {
      totalMau,
      totalTokens,
      clientCredentialsTokens,
      authCodeTokens,
      mauChange: 0,
      tokenChange: 0,
    }
  }

  const midpoint = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, midpoint)
  const secondHalf = data.slice(midpoint)

  const firstHalfMau = firstHalf.reduce((sum, entry) => sum + entry.mau, 0)
  const secondHalfMau = secondHalf.reduce((sum, entry) => sum + entry.mau, 0)
  const firstHalfTokens = firstHalf.reduce(
    (sum, entry) =>
      sum +
      entry.client_credentials_access_token_count +
      entry.authz_code_access_token_count +
      entry.authz_code_idtoken_count,
    0,
  )
  const secondHalfTokens = secondHalf.reduce(
    (sum, entry) =>
      sum +
      entry.client_credentials_access_token_count +
      entry.authz_code_access_token_count +
      entry.authz_code_idtoken_count,
    0,
  )

  const mauChange = calculatePercentChange(secondHalfMau, firstHalfMau)
  const tokenChange = calculatePercentChange(secondHalfTokens, firstHalfTokens)

  return {
    totalMau,
    totalTokens,
    clientCredentialsTokens,
    authCodeTokens,
    mauChange,
    tokenChange,
  }
}

export function useMauStats(
  dateRange: MauDateRange,
  options?: {
    enabled?: boolean
  },
) {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  const params: GetStatParams = {
    start_month: formatDateForApi(dateRange.startDate),
    end_month: formatDateForApi(dateRange.endDate),
  }

  const isEnabled =
    (options?.enabled ?? true) && !!authToken && !!dateRange.startDate && !!dateRange.endDate

  const query = useGetStat(params, {
    query: {
      enabled: isEnabled,
      staleTime: MAU_CACHE_CONFIG.STALE_TIME,
      gcTime: MAU_CACHE_CONFIG.GC_TIME,
      select: (data: JsonNode[]): MauStatEntry[] => {
        const transformed = transformApiResponse(data)
        return augmentMauData(transformed, dateRange.startDate, dateRange.endDate)
      },
    },
  })

  const data = query.data ?? []
  const summary = useMemo(() => computeSummary(data), [data])

  return {
    ...query,
    data,
    summary,
  }
}
