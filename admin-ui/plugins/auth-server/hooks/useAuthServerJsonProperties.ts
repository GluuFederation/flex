import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import type { UserAction } from 'Utils/PermChecker'
import {
  fetchAuthServerJsonProperties,
  patchAuthServerJsonProperties,
} from '../services/jsonPropertiesService'

export const authServerJsonPropertiesQueryKey = ['authServer', 'jsonProperties'] as const

export function getAuthServerJsonPropertiesQueryKey() {
  return authServerJsonPropertiesQueryKey
}

export function useAuthServerJsonPropertiesQuery(
  options?: Omit<
    UseQueryOptions<
      Record<string, unknown>,
      Error,
      Record<string, unknown>,
      typeof authServerJsonPropertiesQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: authServerJsonPropertiesQueryKey,
    queryFn: () => fetchAuthServerJsonProperties(),
    staleTime: 30_000,
    ...options,
  })
}

export function usePatchAuthServerJsonPropertiesMutation(
  mutationOptions?: Omit<UseMutationOptions<unknown, Error, UserAction, unknown>, 'mutationFn'>,
) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const {
    onSuccess: userOnSuccess,
    onError: userOnError,
    ...restMutationOptions
  } = mutationOptions ?? {}

  return useMutation({
    mutationFn: (userAction: UserAction) => patchAuthServerJsonProperties(userAction),
    ...restMutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      dispatch(updateToast(true, 'success'))
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        queryClient.setQueryData(authServerJsonPropertiesQueryKey, data as Record<string, unknown>)
      } else {
        queryClient.invalidateQueries({ queryKey: authServerJsonPropertiesQueryKey })
      }
      userOnSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      dispatch(updateToast(true, 'error'))
      userOnError?.(error, variables, onMutateResult, context)
    },
  })
}
