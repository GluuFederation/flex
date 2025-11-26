import { useEffect } from 'react'
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

  useEffect(() => {
    let mounted = true

    if (mutation.isSuccess && mounted) {
      dispatch(updateToast(true, 'success', t(successMessage)))
      if (navigateOnSuccess) {
        navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
      }
    }

    return () => {
      mounted = false
    }
  }, [mutation.isSuccess, navigateBack, dispatch, t, successMessage, navigateOnSuccess])

  useEffect(() => {
    let mounted = true

    if (mutation.isError && mounted) {
      const errorMsg = mutation.error instanceof Error ? mutation.error.message : t(errorMessage)
      dispatch(updateToast(true, 'error', errorMsg))
    }

    return () => {
      mounted = false
    }
  }, [mutation.isError, mutation.error, dispatch, t, errorMessage])
}
