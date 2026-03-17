import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteAsset, getGetAllAssetsQueryKey } from 'JansConfigApi'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { useAssetAudit, DELETION } from './useAssetAudit'
import { T_KEYS } from '../constants'

interface AssetApiError {
  response?: { data?: { responseMessage?: string } }
}

type MutationError = Error | AssetApiError

const extractAssetErrorMessage = (error: MutationError, fallback: string): string =>
  (error as AssetApiError)?.response?.data?.responseMessage || (error as Error)?.message || fallback

export const useDeleteAssetWithAudit = (callbacks?: {
  onSuccess?: () => void
  onError?: (err: Error) => void
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useAssetAudit()
  const mutation = useDeleteAsset()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const deleteAsset = useCallback(
    async (inum: string, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync({ inum })
        logAction(DELETION, 'asset', {
          action_message: userMessage,
          action_data: { inum },
        }).catch((err) => {
          const auditError = err instanceof Error ? err : new Error(String(err))
          callbacksRef.current?.onError?.(auditError)
          console.error(`[Asset audit] logAction failed for asset inum=${inum}`, auditError)
        })
        dispatch(updateToast(true, 'success', t(T_KEYS.MSG_ASSET_DELETED_SUCCESSFULLY)))
        await invalidateQueriesByKey(queryClient, getGetAllAssetsQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as MutationError
        dispatch(
          updateToast(
            true,
            'error',
            extractAssetErrorMessage(err, t(T_KEYS.MSG_FAILED_TO_DELETE_ASSET)),
          ),
        )
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, dispatch, queryClient, t],
  )

  return {
    deleteAsset,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
