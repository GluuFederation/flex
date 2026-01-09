import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

export interface SqlConfiguration {
  configId?: string
  userName?: string
  userPassword?: string
  connectionUri?: string[]
  schemaName?: string
  passwordEncryptionMethod?: string
  serverTimezone?: string
  binaryAttributes?: string[]
  certificateAttributes?: string[]
  enabled?: boolean
}

export const useGetConfigDatabaseSql = (options?: { query?: { staleTime?: number } }) => {
  return useQuery({
    queryKey: ['/api/v1/config/database'],
    queryFn: async () => {
      return [] as SqlConfiguration[]
    },
    staleTime: options?.query?.staleTime ?? 30000,
  })
}

export const usePostConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: unknown, variables: { data: SqlConfiguration }) => void
    onError?: () => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/config/database'] })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: () => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.()
    },
  })
}

export const usePutConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: unknown, variables: { data: SqlConfiguration }) => void
    onError?: () => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/config/database'] })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: () => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.()
    },
  })
}

export const useDeleteConfigDatabaseSqlByName = (options?: {
  mutation?: {
    onSuccess?: () => void
    onError?: () => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (_variables: { name: string }) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/config/database'] })
      options?.mutation?.onSuccess?.()
    },
    onError: () => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.()
    },
  })
}

export const usePostConfigDatabaseSqlTest = (options?: {
  mutation?: {
    onSuccess?: () => void
    onError?: () => void
  }
}) => {
  return useMutation({
    mutationFn: async (_variables: { data: SqlConfiguration }) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      options?.mutation?.onSuccess?.()
    },
    onError: () => {
      options?.mutation?.onError?.()
    },
  })
}
