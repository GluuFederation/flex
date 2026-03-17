import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { UseMutationResult } from '@tanstack/react-query'

interface ApiErrorResponseData {
  message: string
}

interface ApiErrorWithResponse {
  response?: {
    data?: string | ApiErrorResponseData
  }
}

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
        navigateBack(ROUTES.ATTRIBUTES_LIST)
      }
    }
    if (!mutation.isSuccess) {
      successHandledRef.current = false
    }
  }, [mutation.isSuccess, navigateBack, dispatch, t, successMessage, navigateOnSuccess])

  useEffect(() => {
    if (mutation.isError && !errorHandledRef.current) {
      errorHandledRef.current = true
      const error = mutation.error
      const axiosData =
        error && typeof error === 'object' && 'response' in error
          ? (error as ApiErrorWithResponse).response?.data
          : undefined
      const responseMessage =
        typeof axiosData === 'string'
          ? axiosData
          : axiosData && typeof axiosData === 'object' && 'message' in axiosData
            ? (axiosData as ApiErrorResponseData).message
            : undefined
      const errorMsg =
        responseMessage || (error instanceof Error ? error.message : undefined) || t(errorMessage)
      dispatch(updateToast(true, 'error', errorMsg))
    }
    if (!mutation.isError) {
      errorHandledRef.current = false
    }
  }, [mutation.isError, mutation.error, dispatch, t, errorMessage])
}
