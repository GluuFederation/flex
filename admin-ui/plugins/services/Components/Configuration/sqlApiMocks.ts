import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

export interface SqlConfiguration {
  configId?: string | null
  userName?: string | null
  userPassword?: string | null
  connectionUri?: string[] | null
  schemaName?: string | null
  passwordEncryptionMethod?: string | null
  serverTimezone?: string | null
  binaryAttributes?: string[] | null
  certificateAttributes?: string[] | null
  enabled?: boolean | null
}

export const useGetConfigDatabaseSql = (options?: { query?: { staleTime?: number } }) => {
  return useQuery<SqlConfiguration[]>({
    queryKey: getGetConfigDatabaseSqlQueryKey(),
    queryFn: async () => {
      return [] as SqlConfiguration[]
    },
    staleTime: options?.query?.staleTime ?? 30000,
  })
}

export const usePostConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: unknown, variables: { data: SqlConfiguration }) => void
    onError?: (error: unknown, variables: { data: SqlConfiguration }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.(error, variables)
    },
  })
}

export const usePutConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: unknown, variables: { data: SqlConfiguration }) => void
    onError?: (error: unknown, variables: { data: SqlConfiguration }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.(error, variables)
    },
  })
}

export const useDeleteConfigDatabaseSqlByName = (options?: {
  mutation?: {
    onSuccess?: (data: { name: string }, variables: { name: string }) => void
    onError?: (error: unknown, variables: { name: string }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { name: string }) => {
      return Promise.resolve(variables)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      dispatch(updateToast(true, 'danger'))
      options?.mutation?.onError?.(error, variables)
    },
  })
}

export const usePostConfigDatabaseSqlTest = (options?: {
  mutation?: {
    onSuccess?: (data: void, variables: { data: SqlConfiguration }) => void
    onError?: (error: Error, variables: { data: SqlConfiguration }) => void
  }
}) => {
  return useMutation<void, Error, { data: SqlConfiguration }>({
    mutationFn: async (_variables: { data: SqlConfiguration }): Promise<void> => {
      return Promise.resolve()
    },
    onSuccess: (data, variables) => {
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      options?.mutation?.onError?.(error, variables)
    },
  })
}

export const getGetConfigDatabaseSqlQueryKey = () => {
  return ['/api/v1/config/database'] as const
}
