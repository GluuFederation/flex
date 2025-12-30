import { useCallback, useMemo } from 'react'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import {
  useGetOauthOpenidClients,
  usePostOauthOpenidClient,
  usePutOauthOpenidClient,
  useDeleteOauthOpenidClientByInum,
  getGetOauthOpenidClientsQueryKey,
} from 'JansConfigApi'
import type { Client, ClientListOptions } from '../types'

interface MutationHandlerOptions {
  dispatch: Dispatch
  queryClient: QueryClient
  errorMessageFallback: string
  triggerWebhookOnSuccess?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

function createMutationHandlers<T = Client>(options: MutationHandlerOptions) {
  const {
    dispatch,
    queryClient,
    errorMessageFallback,
    triggerWebhookOnSuccess = true,
    onSuccess,
    onError,
  } = options

  const handleSuccess = (data: T) => {
    dispatch(updateToast(true, 'success'))
    queryClient.invalidateQueries({ queryKey: getGetOauthOpenidClientsQueryKey() })
    if (triggerWebhookOnSuccess && data) {
      dispatch(triggerWebhook({ createdFeatureValue: data }))
    }
    onSuccess?.()
  }

  const handleError = (error: Error) => {
    dispatch(updateToast(true, 'error', error?.message || errorMessageFallback))
    onError?.(error)
  }

  return { handleSuccess, handleError }
}

export function useClientList(params: ClientListOptions) {
  const queryOptions = useMemo(
    () => ({
      query: {
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 30000,
      },
    }),
    [],
  )

  return useGetOauthOpenidClients(params, queryOptions)
}

export function useClientById(inum: string, enabled = true) {
  const queryOptions = useMemo(
    () => ({
      query: {
        enabled,
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: false,
        staleTime: 30000,
      },
    }),
    [enabled],
  )

  const { data, ...rest } = useGetOauthOpenidClients({ pattern: inum, limit: 1 }, queryOptions)

  const client = useMemo(() => {
    return data?.entries?.find((c: Client) => c.inum === inum)
  }, [data?.entries, inum])

  return { data: client, ...rest }
}

export function useCreateClient(onSuccess?: () => void, onError?: (error: Error) => void) {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const { handleSuccess, handleError } = useMemo(
    () =>
      createMutationHandlers({
        dispatch,
        queryClient,
        errorMessageFallback: 'Failed to create client',
        onSuccess,
        onError,
      }),
    [dispatch, queryClient, onSuccess, onError],
  )

  return usePostOauthOpenidClient({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })
}

export function useUpdateClient(onSuccess?: () => void, onError?: (error: Error) => void) {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const { handleSuccess, handleError } = useMemo(
    () =>
      createMutationHandlers({
        dispatch,
        queryClient,
        errorMessageFallback: 'Failed to update client',
        onSuccess,
        onError,
      }),
    [dispatch, queryClient, onSuccess, onError],
  )

  return usePutOauthOpenidClient({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })
}

export function useDeleteClient(onSuccess?: () => void, onError?: (error: Error) => void) {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const { handleSuccess, handleError } = useMemo(
    () =>
      createMutationHandlers<null>({
        dispatch,
        queryClient,
        errorMessageFallback: 'Failed to delete client',
        triggerWebhookOnSuccess: false,
        onSuccess,
        onError,
      }),
    [dispatch, queryClient, onSuccess, onError],
  )

  return useDeleteOauthOpenidClientByInum({
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  })
}

export function useInvalidateClientQueries() {
  const queryClient = useQueryClient()

  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getGetOauthOpenidClientsQueryKey(),
    })
  }, [queryClient])
}
