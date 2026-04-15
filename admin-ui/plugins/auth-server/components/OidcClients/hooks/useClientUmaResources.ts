import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetOauthUmaResourcesByClientid,
  useDeleteOauthUmaResourcesById,
  getGetOauthUmaResourcesByClientidQueryKey,
} from 'JansConfigApi'
import type { UmaResource } from 'JansConfigApi'
import type { AxiosError } from 'axios'
import type { UmaResourceApiError } from '../types'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { REGEX_UMA_REQUIRED_SCOPE } from '@/utils/regex'
import { UMA_I18N_KEYS } from '../constants'

export const useClientUmaResources = (clientId: string | undefined) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const query = useGetOauthUmaResourcesByClientid<UmaResource[], AxiosError<UmaResourceApiError>>(
    clientId ?? '',
    { query: { enabled: !!clientId } },
  )

  useEffect(() => {
    if (!query.isError) return
    const status = query.error?.response?.status
    const rawData = query.error?.response?.data
    const serverMsg = typeof rawData === 'string' ? rawData : rawData?.message
    const rawScopes =
      serverMsg !== undefined ? REGEX_UMA_REQUIRED_SCOPE.exec(serverMsg)?.[1]?.trim() : undefined
    const requiredScope = rawScopes
      ? rawScopes
          .split(',')
          .map((s) => `"${s.trim()}"`)
          .join(', ')
      : undefined
    const msg =
      status === 401
        ? requiredScope
          ? `${t(UMA_I18N_KEYS.ERROR_UNAUTHORIZED)} ${requiredScope}`
          : (serverMsg ?? t(UMA_I18N_KEYS.ERROR_UNAUTHORIZED))
        : (query.error?.message ?? t('messages.error_in_saving'))
    dispatch(updateToast(true, 'error', msg))
    devLogger.error('Failed to load UMA resources:', query.error)
  }, [query.isError, query.error, dispatch, t])

  const umaResources = useMemo<UmaResource[]>(() => query.data ?? [], [query.data])

  const deleteMutation = useDeleteOauthUmaResourcesById()

  const deleteUmaResource = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync({ id })
        dispatch(updateToast(true, 'success'))
        await invalidateQueriesByKey(
          queryClient,
          getGetOauthUmaResourcesByClientidQueryKey(clientId),
        )
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t('messages.error_in_deleting')
        dispatch(updateToast(true, 'error', errorMsg))
        devLogger.error('Failed to delete UMA resource:', error)
        throw error
      }
    },
    [deleteMutation, dispatch, queryClient, clientId, t],
  )

  return {
    umaResources,
    isLoading: query.isLoading,
    deleteUmaResource,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  }
}
