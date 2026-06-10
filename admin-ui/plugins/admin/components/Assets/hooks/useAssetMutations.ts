import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDeleteAsset, getGetAllAssetsQueryKey } from 'JansConfigApi'
import { customInstance } from 'Orval'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { useAssetAudit } from './useAssetAudit'
import { CREATE, UPDATE, DELETION, ASSET } from '@/audit'
import { T_KEYS } from '../constants'
import { logger } from '@/utils/logger'
import type {
  AssetApiError,
  AssetMutationError,
  AssetMutationCallbacks,
  AssetAuditActionType,
  Document,
  AssetFormData,
} from '../types'

const ASSET_UPLOAD_URL = '/api/v1/jans-assets/upload'

const extractAssetErrorMessage = (error: AssetMutationError, fallback: string): string =>
  (error as AssetApiError)?.response?.data?.responseMessage || (error as Error)?.message || fallback

const buildAssetUploadFormData = (body: AssetFormData, isUpdate: boolean): FormData => {
  const document: Document = {
    fileName: body.fileName,
    description: body.description,
    document: body.fileName,
    service: body?.service,
    enabled: body.enabled,
    ...(isUpdate ? { inum: body.inum, dn: body.dn, baseDn: body.baseDn } : {}),
  }
  const assetFile: Blob | File =
    body.document instanceof File
      ? body.document
      : body.document instanceof Blob
        ? body.document
        : new Blob([body.document as BlobPart], { type: 'application/octet-stream' })
  const formData = new FormData()
  formData.append(
    'document',
    new Blob([JSON.stringify({ ...document })], { type: 'application/json' }),
  )
  formData.append('assetFile', assetFile)
  return formData
}

const useAssetSaveMutation = (
  method: 'POST' | 'PUT',
  isUpdate: boolean,
  auditAction: AssetAuditActionType,
  callbacks?: AssetMutationCallbacks,
) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAction } = useAssetAudit()
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks
  const mutation = useMutation({
    mutationFn: (body: AssetFormData) =>
      customInstance<Document>({
        url: ASSET_UPLOAD_URL,
        method,
        data: buildAssetUploadFormData(body, isUpdate),
      }),
  })

  const save = useCallback(
    async (body: AssetFormData, userMessage?: string) => {
      try {
        const result = await mutation.mutateAsync(body)
        logAction(auditAction, ASSET, { action_message: userMessage, action_data: body }).catch(
          (err) => {
            const auditError = err instanceof Error ? err : new Error(String(err))
            logger.error('[Asset audit] logAction failed', auditError)
          },
        )
        await invalidateQueriesByKey(queryClient, getGetAllAssetsQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as AssetMutationError
        dispatch(updateToast(true, 'error', extractAssetErrorMessage(err, 'Unknown error')))
        callbacksRef.current?.onError?.(err instanceof Error ? err : new Error(String(err)))
        throw error
      }
    },
    [mutation, logAction, auditAction, dispatch, queryClient],
  )

  return { save, isLoading: mutation.isPending, isError: mutation.isError, error: mutation.error }
}

export const useCreateAssetWithAudit = (callbacks?: AssetMutationCallbacks) => {
  const { save, ...rest } = useAssetSaveMutation('POST', false, CREATE, callbacks)
  return { createAsset: save, ...rest }
}

export const useUpdateAssetWithAudit = (callbacks?: AssetMutationCallbacks) => {
  const { save, ...rest } = useAssetSaveMutation('PUT', true, UPDATE, callbacks)
  return { updateAsset: save, ...rest }
}

export const useDeleteAssetWithAudit = (callbacks?: AssetMutationCallbacks) => {
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
        logAction(DELETION, ASSET, {
          action_message: userMessage,
          action_data: { inum },
        }).catch((err) => {
          const auditError = err instanceof Error ? err : new Error(String(err))
          callbacksRef.current?.onError?.(auditError)
          logger.error(`[Asset audit] logAction failed for asset inum=${inum}`, auditError)
        })
        dispatch(updateToast(true, 'success', t(T_KEYS.MSG_ASSET_DELETED_SUCCESSFULLY)))
        await invalidateQueriesByKey(queryClient, getGetAllAssetsQueryKey())
        callbacksRef.current?.onSuccess?.()
        return result
      } catch (error) {
        const err = error as AssetMutationError
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
