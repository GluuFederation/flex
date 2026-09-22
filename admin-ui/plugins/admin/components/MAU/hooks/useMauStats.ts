import { useCallback, useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { keepPreviousData } from '@tanstack/react-query'
import { useGetStat, type JsonNode } from 'JansConfigApi'
import type { MauStatEntry, MauDateRange, RawStatEntry, MauSummary } from '../types'
import { MAU_CACHE_CONFIG } from '../constants'
import {
  augmentMauData,
  transformRawStatEntry,
  buildStatParams,
  orderMonthRange,
  calculatePercentChange,
} from '../utils'

const EMPTY_DATA: MauStatEntry[] = []

const transformApiResponse = (data: JsonNode[] | undefined): MauStatEntry[] => {
  if (!data || !Array.isArray(data)) {
    return []
  }

  return data.map((item) => {
    const rawEntry = item as RawStatEntry
    return transformRawStatEntry(rawEntry)
  })
}

const computeSummary = (data: MauStatEntry[]): MauSummary => {
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

export const useMauStats = (
  dateRange: MauDateRange,
  options?: {
    enabled?: boolean
  },
) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  const [rangeStart, rangeEnd] = useMemo(
    () => orderMonthRange(dateRange.startDate, dateRange.endDate),
    [dateRange.startDate, dateRange.endDate],
  )

  const params = useMemo(() => buildStatParams(rangeStart, rangeEnd), [rangeStart, rangeEnd])

  const select = useCallback(
    (data: JsonNode[]): MauStatEntry[] =>
      augmentMauData(transformApiResponse(data), rangeStart, rangeEnd),
    [rangeStart, rangeEnd],
  )

  const isEnabled =
    (options?.enabled ?? true) &&
    hasSession === true &&
    !!dateRange.startDate &&
    !!dateRange.endDate

  const query = useGetStat(params, {
    query: {
      enabled: isEnabled,
      staleTime: MAU_CACHE_CONFIG.STALE_TIME,
      gcTime: MAU_CACHE_CONFIG.GC_TIME,
      placeholderData: keepPreviousData,
      select,
    },
  })

  const data = query.data ?? EMPTY_DATA
  const summary = useMemo(() => computeSummary(data), [data])

  return {
    ...query,
    data,
    summary,
  }
}
