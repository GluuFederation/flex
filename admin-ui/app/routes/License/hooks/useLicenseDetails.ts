import { useRef, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector, getRootState } from '@/redux/hooks'
import {
  useGetAdminuiLicense,
  useLicenseConfigDelete,
  getGetAdminuiLicenseQueryKey,
  type LicenseResponse,
} from 'JansConfigApi'
import { isFourZeroThreeError } from '@/utils/TokenController'
import { postUserAction } from '@/redux/api/backend-api'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { updateToast } from '@/redux/features/toastSlice'
import { REGEX_SURROUNDING_QUOTES } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'
import { isDevelopment } from '@/utils/env'
import { API_LICENSE, createSuccessAuditInit, selectAuditContext, DELETION } from '@/audit'
import type { RootState } from '@/redux/types'
import type { UserActionPayload } from '@/redux/api/types/BackendApi'

interface UseLicenseDetailsOptions {
  onResetSuccess?: () => void
}

const stripSurroundingQuotes = (s: string | undefined): string =>
  s?.replace(REGEX_SURROUNDING_QUOTES, '') ?? ''

const transformLicenseResponse = (
  data: LicenseResponse | undefined,
): LicenseResponse | undefined => {
  if (!data) return undefined
  return {
    ...data,
    companyName: stripSurroundingQuotes(data.companyName),
    customerFirstName: stripSurroundingQuotes(data.customerFirstName),
    customerLastName: stripSurroundingQuotes(data.customerLastName),
    customerEmail: stripSurroundingQuotes(data.customerEmail),
  }
}

const EMPTY_ITEM: LicenseResponse = {}

const createAuditLog = (state: RootState): UserActionPayload | null => {
  const { userinfo } = state.authReducer
  if (!userinfo?.inum || !userinfo?.name) return null
  return createSuccessAuditInit(selectAuditContext(state))
}

export const useLicenseDetails = (options: UseLicenseDetailsOptions = {}) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const pendingMessageRef = useRef<string>('')
  const onResetSuccessRef = useRef(options.onResetSuccess)
  onResetSuccessRef.current = options.onResetSuccess

  const query = useGetAdminuiLicense({
    query: {
      enabled: hasSession === true,
      select: transformLicenseResponse,
    },
  })

  const mutation = useLicenseConfigDelete({
    mutation: {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminuiLicenseQueryKey() })
        const currentState = getRootState()
        const baseAudit = createAuditLog(currentState)
        if (baseAudit) {
          const audit = {
            ...baseAudit,
            action: DELETION,
            resource: API_LICENSE,
            message: pendingMessageRef.current,
          }
          try {
            await postUserAction(audit)
          } catch (e) {
            if (isDevelopment) {
              devLogger.error(
                'License reset audit post failed:',
                e instanceof Error ? e : String(e),
              )
            }
          }
        }
        dispatch(updateToast(true, 'success', t('messages.license_reset_success')))
        onResetSuccessRef.current?.()
      },
      onError: (error: Error) => {
        if (isFourZeroThreeError(error as Parameters<typeof isFourZeroThreeError>[0])) {
          dispatch(auditLogoutLogs({ message: 'Session expired' }))
          return
        }
        const message =
          error instanceof Error ? error.message : t('messages.error_processing_request')
        dispatch(updateToast(true, 'error', message))
        if (isDevelopment && error != null) {
          devLogger.error('License reset failed:', error)
        }
      },
    },
  })

  const item = query.data ?? EMPTY_ITEM
  const loading = query.isLoading

  const resetLicense = useCallback(
    (message?: string) => {
      pendingMessageRef.current = message ?? ''
      mutation.mutate()
    },
    [mutation.mutate],
  )

  return useMemo(
    () => ({
      item,
      loading,
      refetch: query.refetch,
      queryKey: getGetAdminuiLicenseQueryKey(),
      resetLicense,
      isResetting: mutation.isPending,
    }),
    [item, loading, query.refetch, resetLicense, mutation.isPending],
  )
}
