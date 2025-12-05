import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import {
  useGetOauthOpenidClients,
  useGetOauthOpenidClientsByInum,
  usePostOauthOpenidClient,
  usePutOauthOpenidClient,
  useDeleteOauthOpenidClientByInum,
  getGetOauthOpenidClientsQueryKey,
} from 'JansConfigApi'
import type { Client, ClientListOptions } from '../types'

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

  return useGetOauthOpenidClientsByInum(inum, queryOptions)
}

export function useCreateClient(onSuccess?: () => void, onError?: (error: Error) => void) {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const handleSuccess = useCallback(
    (data: Client) => {
      dispatch(updateToast(true, 'success'))
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0] as string
          return queryKey === getGetOauthOpenidClientsQueryKey()[0]
        },
      })
      dispatch(triggerWebhook({ createdFeatureValue: data }))
      onSuccess?.()
    },
    [dispatch, queryClient, onSuccess],
  )

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to create client'
      dispatch(updateToast(true, 'error', errorMessage))
      onError?.(error)
    },
    [dispatch, onError],
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

  const handleSuccess = useCallback(
    (data: Client) => {
      dispatch(updateToast(true, 'success'))
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0] as string
          return (
            queryKey === getGetOauthOpenidClientsQueryKey()[0] ||
            queryKey === 'getOauthOpenidClientsByInum'
          )
        },
      })
      dispatch(triggerWebhook({ createdFeatureValue: data }))
      onSuccess?.()
    },
    [dispatch, queryClient, onSuccess],
  )

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to update client'
      dispatch(updateToast(true, 'error', errorMessage))
      onError?.(error)
    },
    [dispatch, onError],
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

  const handleSuccess = useCallback(() => {
    dispatch(updateToast(true, 'success'))
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string
        return queryKey === getGetOauthOpenidClientsQueryKey()[0]
      },
    })
    onSuccess?.()
  }, [dispatch, queryClient, onSuccess])

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to delete client'
      dispatch(updateToast(true, 'error', errorMessage))
      onError?.(error)
    },
    [dispatch, onError],
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
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string
        return (
          queryKey === getGetOauthOpenidClientsQueryKey()[0] ||
          queryKey === 'getOauthOpenidClientsByInum'
        )
      },
    })
  }, [queryClient])
}
