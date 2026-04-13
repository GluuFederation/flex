import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetOauthUmaResourcesByClientid,
  useDeleteOauthUmaResourcesById,
  getGetOauthUmaResourcesByClientidQueryKey,
} from 'JansConfigApi'
import type { UmaResource } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'

export const useClientUmaResources = (clientId: string | undefined) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const query = useGetOauthUmaResourcesByClientid(clientId ?? '', {
    query: { enabled: !!clientId },
  })

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
