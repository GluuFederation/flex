import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { UseMutationResult } from '@tanstack/react-query'

interface UseMutationEffectsOptions<TData = unknown, TError = unknown, TVariables = unknown> {
  mutation: UseMutationResult<TData, TError, TVariables, unknown>
  successMessage: string
  errorMessage: string
  navigateOnSuccess?: boolean
}

export function useMutationEffects<TData = unknown, TError = unknown, TVariables = unknown>({
  mutation,
  successMessage,
  errorMessage,
  navigateOnSuccess = true,
}: UseMutationEffectsOptions<TData, TError, TVariables>) {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const successHandledRef = useRef(false)
  const errorHandledRef = useRef(false)

  useEffect(() => {
    if (mutation.isSuccess && !successHandledRef.current) {
      successHandledRef.current = true
      dispatch(updateToast(true, 'success', t(successMessage)))
      if (navigateOnSuccess) {
        navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
      }
    }
    if (mutation.isIdle) {
      successHandledRef.current = false
    }
  }, [
    mutation.isSuccess,
    mutation.isIdle,
    navigateBack,
    dispatch,
    t,
    successMessage,
    navigateOnSuccess,
  ])

  useEffect(() => {
    if (mutation.isError && !errorHandledRef.current) {
      errorHandledRef.current = true
      const error = mutation.error
      const errorMsg =
        error instanceof Error
          ? error.message
          : error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : t(errorMessage)
      dispatch(updateToast(true, 'error', errorMsg))
    }
    if (mutation.isIdle) {
      errorHandledRef.current = false
    }
  }, [mutation.isError, mutation.isIdle, mutation.error, dispatch, t, errorMessage])
}
