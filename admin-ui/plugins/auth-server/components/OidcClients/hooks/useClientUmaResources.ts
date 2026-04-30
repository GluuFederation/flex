import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetOauthUmaResourcesByClientid,
  useDeleteOauthUmaResourcesById,
  getGetOauthUmaResourcesByClientidQueryKey,
} from 'JansConfigApi'
import type { UmaResource } from 'JansConfigApi'
import type { AxiosError } from 'axios'
import type { UmaResourceApiError } from '../types'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'

export const useClientUmaResources = (clientId: string | undefined) => {
  const queryClient = useQueryClient()

  const query = useGetOauthUmaResourcesByClientid<UmaResource[], AxiosError<UmaResourceApiError>>(
    clientId ?? '',
    { query: { enabled: !!clientId } },
  )

  const umaResources = useMemo<UmaResource[]>(() => query.data ?? [], [query.data])

  const deleteMutation = useDeleteOauthUmaResourcesById()

  const deleteUmaResource = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync({ id })
        await invalidateQueriesByKey(
          queryClient,
          getGetOauthUmaResourcesByClientidQueryKey(clientId),
        )
      } catch (error) {
        devLogger.error(
          'Failed to delete UMA resource:',
          error instanceof Error ? error : String(error),
        )
        throw error
      }
    },
    [deleteMutation, queryClient, clientId],
  )

  return {
    umaResources,
    isLoading: query.isLoading,
    deleteUmaResource,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  }
}
