import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

/**
 * Feature flag to control SQL API behavior.
 *
 * TODO: Replace mock implementation with real JansConfigApi integration when backend endpoints are available.
 * Tracking: Backend SQL configuration API endpoints need to be implemented.
 * Timeline: TBD - pending backend work.
 *
 * When real API is available:
 * 1. Set USE_REAL_SQL_API to true
 * 2. Import and use real JansConfigApi hooks (e.g., useGetConfigDatabaseSql, usePostConfigDatabaseSql, etc.)
 * 3. Remove mock implementations
 * 4. Update error handling to use real API error responses
 *
 * Current behavior: All hooks return mock data (empty arrays, resolved promises) to allow UI development
 * without backend dependencies. In production, this will surface errors instead of silently returning empty data.
 */
const USE_REAL_SQL_API = false

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

/**
 * Hook to fetch SQL database configurations.
 *
 * @param options - Query options including staleTime
 * @returns React Query hook result with SQL configurations
 *
 * NOTE: Currently returns mock data. When USE_REAL_SQL_API is true, will call real API.
 * In production with mocks enabled, will throw error to prevent silent data masking.
 */
export const useGetConfigDatabaseSql = (options?: { query?: { staleTime?: number } }) => {
  return useQuery<SqlConfiguration[]>({
    queryKey: getGetConfigDatabaseSqlQueryKey(),
    queryFn: async () => {
      if (USE_REAL_SQL_API) {
        // TODO: Replace with real API call when available
        // Example: return await getConfigDatabaseSql()
        throw new Error(
          'Real SQL API not yet implemented. Backend endpoints need to be added to JansConfigApi.',
        )
      }

      // Mock implementation - in production, throw error to prevent silent empty data
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'SQL configuration API is not available. Mock data is disabled in production to prevent data masking.',
        )
      }

      // Development: return empty array for UI development
      console.warn(
        '[SQL API Mocks] useGetConfigDatabaseSql: Returning mock empty array. Real API not yet implemented.',
      )
      return [] as SqlConfiguration[]
    },
    staleTime: options?.query?.staleTime ?? 30000,
    retry: false, // Don't retry mock failures
  })
}

/**
 * Hook to create a new SQL database configuration.
 *
 * @param options - Mutation options with onSuccess and onError callbacks
 * @returns React Query mutation hook
 *
 * NOTE: Currently uses mock implementation. When USE_REAL_SQL_API is true, will call real API.
 */
export const usePostConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: SqlConfiguration, variables: { data: SqlConfiguration }) => void
    onError?: (error: Error, variables: { data: SqlConfiguration }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation<SqlConfiguration, Error, { data: SqlConfiguration }>({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      if (USE_REAL_SQL_API) {
        // TODO: Replace with real API call when available
        // Example: return await postConfigDatabaseSql({ data: variables.data })
        throw new Error(
          'Real SQL API not yet implemented. Backend endpoints need to be added to JansConfigApi.',
        )
      }

      // Mock implementation - simulate successful creation
      console.warn(
        '[SQL API Mocks] usePostConfigDatabaseSql: Using mock implementation. Real API not yet implemented.',
      )
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create SQL configuration'
      dispatch(updateToast(true, 'error', errorMessage))
      console.error('[SQL API] POST error:', error)
      options?.mutation?.onError?.(error, variables)
    },
  })
}

/**
 * Hook to update an existing SQL database configuration.
 *
 * @param options - Mutation options with onSuccess and onError callbacks
 * @returns React Query mutation hook
 *
 * NOTE: Currently uses mock implementation. When USE_REAL_SQL_API is true, will call real API.
 */
export const usePutConfigDatabaseSql = (options?: {
  mutation?: {
    onSuccess?: (data: SqlConfiguration, variables: { data: SqlConfiguration }) => void
    onError?: (error: Error, variables: { data: SqlConfiguration }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation<SqlConfiguration, Error, { data: SqlConfiguration }>({
    mutationFn: async (variables: { data: SqlConfiguration }) => {
      if (USE_REAL_SQL_API) {
        // TODO: Replace with real API call when available
        // Example: return await putConfigDatabaseSql({ data: variables.data })
        throw new Error(
          'Real SQL API not yet implemented. Backend endpoints need to be added to JansConfigApi.',
        )
      }

      // Mock implementation - simulate successful update
      console.warn(
        '[SQL API Mocks] usePutConfigDatabaseSql: Using mock implementation. Real API not yet implemented.',
      )
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update SQL configuration'
      dispatch(updateToast(true, 'error', errorMessage))
      console.error('[SQL API] PUT error:', error)
      options?.mutation?.onError?.(error, variables)
    },
  })
}

/**
 * Hook to delete a SQL database configuration by name.
 *
 * @param options - Mutation options with onSuccess and onError callbacks
 * @returns React Query mutation hook
 *
 * NOTE: Currently uses mock implementation. When USE_REAL_SQL_API is true, will call real API.
 */
export const useDeleteConfigDatabaseSqlByName = (options?: {
  mutation?: {
    onSuccess?: (data: { name: string }, variables: { name: string }) => void
    onError?: (error: Error, variables: { name: string }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation<{ name: string }, Error, { name: string }>({
    mutationFn: async (variables: { name: string }) => {
      if (USE_REAL_SQL_API) {
        // TODO: Replace with real API call when available
        // Example: return await deleteConfigDatabaseSqlByName({ name: variables.name })
        throw new Error(
          'Real SQL API not yet implemented. Backend endpoints need to be added to JansConfigApi.',
        )
      }

      // Mock implementation - simulate successful deletion
      console.warn(
        '[SQL API Mocks] useDeleteConfigDatabaseSqlByName: Using mock implementation. Real API not yet implemented.',
      )
      return Promise.resolve(variables)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete SQL configuration'
      dispatch(updateToast(true, 'error', errorMessage))
      console.error('[SQL API] DELETE error:', error)
      options?.mutation?.onError?.(error, variables)
    },
  })
}

/**
 * Hook to test a SQL database configuration connection.
 *
 * @param options - Mutation options with onSuccess and onError callbacks
 * @returns React Query mutation hook
 *
 * NOTE: Currently uses mock implementation. When USE_REAL_SQL_API is true, will call real API.
 */
export const usePostConfigDatabaseSqlTest = (options?: {
  mutation?: {
    onSuccess?: (data: void, variables: { data: SqlConfiguration }) => void
    onError?: (error: Error, variables: { data: SqlConfiguration }) => void
  }
}) => {
  return useMutation<void, Error, { data: SqlConfiguration }>({
    mutationFn: async (_variables: { data: SqlConfiguration }): Promise<void> => {
      if (USE_REAL_SQL_API) {
        // TODO: Replace with real API call when available
        // Example: return await postConfigDatabaseSqlTest({ data: _variables.data })
        throw new Error(
          'Real SQL API not yet implemented. Backend endpoints need to be added to JansConfigApi.',
        )
      }

      // Mock implementation - simulate successful test
      console.warn(
        '[SQL API Mocks] usePostConfigDatabaseSqlTest: Using mock implementation. Real API not yet implemented.',
      )
      return Promise.resolve()
    },
    onSuccess: (data, variables) => {
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      console.error('[SQL API] TEST error:', error)
      options?.mutation?.onError?.(error, variables)
    },
  })
}

export const getGetConfigDatabaseSqlQueryKey = () => {
  return ['/api/v1/config/database'] as const
}
