import { useRef, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hooks'
import {
  useGetAdminuiLicense,
  useLicenseConfigDelete,
  getGetAdminuiLicenseQueryKey,
  type LicenseResponse,
} from 'JansConfigApi'
import { addAdditionalData, isFourZeroThreeError } from '@/utils/TokenController'
import { postUserAction } from '@/redux/api/backend-api'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { updateToast } from '@/redux/features/toastSlice'
import { REGEX_SURROUNDING_QUOTES } from '@/utils/regex'
import { API_LICENSE } from '@/audit/Resources'
import { DELETION } from '@/audit/UserActionType'
import store from 'Redux/store'
import type { RootState } from '@/redux/types'
import type { AuditLog } from '@/redux/sagas/types/audit'

interface UseLicenseDetailsOptions {
  onResetSuccess?: () => void
}

const LICENSE_DETAILS_STALE_TIME = 30 * 1000

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

const createAuditLog = (state: RootState): AuditLog | null => {
  const { userinfo, config, location } = state.authReducer
  if (!userinfo?.inum || !userinfo?.name) return null
  return {
    status: 'success',
    performedBy: { user_inum: userinfo.inum, userId: userinfo.name },
    client_id: config?.clientId,
    ip_address: location?.IPv4,
  }
}

export const useLicenseDetails = (options: UseLicenseDetailsOptions = {}) => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)
  const pendingMessageRef = useRef<string>('')
  const onResetSuccessRef = useRef(options.onResetSuccess)
  onResetSuccessRef.current = options.onResetSuccess

  const query = useGetAdminuiLicense({
    query: {
      enabled: hasSession === true,
      staleTime: LICENSE_DETAILS_STALE_TIME,
      select: transformLicenseResponse,
    },
  })

  const mutation = useLicenseConfigDelete({
    mutation: {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminuiLicenseQueryKey() })
        const currentState = store.getState() as unknown as RootState
        const audit = createAuditLog(currentState)
        if (audit) {
          addAdditionalData(audit, DELETION, API_LICENSE, {})
          audit.message = pendingMessageRef.current
          try {
            await postUserAction(audit)
          } catch (e) {
            console.error('License reset audit post failed:', e)
          }
        }
        dispatch(updateToast(true, 'success', t('messages.license_reset_success')))
        onResetSuccessRef.current?.()
      },
      onError: (error: unknown) => {
        if (isFourZeroThreeError(error as Parameters<typeof isFourZeroThreeError>[0])) {
          dispatch(auditLogoutLogs({ message: 'Session expired' }))
          return
        }
        const message =
          error instanceof Error ? error.message : t('messages.error_processiong_request')
        dispatch(updateToast(true, 'error', message))
        if (process.env.NODE_ENV === 'development' && error != null) {
          console.error('License reset failed:', error)
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
