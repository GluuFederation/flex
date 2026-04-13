import type { UseMutationResult } from '@tanstack/react-query'

export type ApiErrorResponseData = {
  message?: string
}

export type ApiErrorWithResponse = {
  response?: {
    data?: string | ApiErrorResponseData
  }
}

export type UseMutationEffectsOptions<
  TData = object,
  TError = Error,
  TVariables = void,
  TContext = void,
> = {
  mutation: UseMutationResult<TData, TError, TVariables, TContext>
  successMessage: string
  errorMessage: string
  navigateOnSuccess?: boolean
}
