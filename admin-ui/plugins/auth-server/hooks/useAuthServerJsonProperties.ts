import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import type { UserAction } from 'Utils/PermChecker'
import type { AppConfiguration } from '../components/AuthServerProperties/types'
import {
  fetchAuthServerJsonProperties,
  patchAuthServerJsonProperties,
} from '../services/jsonPropertiesService'

export const authServerJsonPropertiesQueryKey = ['authServer', 'jsonProperties'] as const

export const getAuthServerJsonPropertiesQueryKey = () => {
  return authServerJsonPropertiesQueryKey
}

export const useAuthServerJsonPropertiesQuery = (
  options?: Omit<
    UseQueryOptions<
      AppConfiguration,
      Error,
      AppConfiguration,
      typeof authServerJsonPropertiesQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: authServerJsonPropertiesQueryKey,
    queryFn: () => fetchAuthServerJsonProperties(),
    staleTime: 30_000,
    ...options,
  })
}

export const usePatchAuthServerJsonPropertiesMutation = (
  mutationOptions?: Omit<
    UseMutationOptions<AppConfiguration, Error, UserAction, AppConfiguration>,
    'mutationFn'
  >,
) => {
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
        queryClient.setQueryData(authServerJsonPropertiesQueryKey, data)
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
