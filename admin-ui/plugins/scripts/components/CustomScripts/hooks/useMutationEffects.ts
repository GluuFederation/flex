import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { UseMutationResult } from '@tanstack/react-query'

interface UseMutationEffectsOptions<
  TData = object,
  TError = Error,
  TVariables = void,
  TContext = void,
> {
  mutation: UseMutationResult<TData, TError, TVariables, TContext>
  successMessage: string
  errorMessage: string
  navigateOnSuccess?: boolean
}

export const useMutationEffects = <
  TData = object,
  TError = Error,
  TVariables = void,
  TContext = void,
>({
  mutation,
  successMessage,
  errorMessage,
  navigateOnSuccess = true,
}: UseMutationEffectsOptions<TData, TError, TVariables, TContext>) => {
  const dispatch = useAppDispatch()
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
            ? String((error as { message: string }).message)
            : t(errorMessage)
      dispatch(updateToast(true, 'error', errorMsg))
    }
    if (mutation.isIdle) {
      errorHandledRef.current = false
    }
  }, [mutation.isError, mutation.isIdle, mutation.error, dispatch, t, errorMessage])
}
