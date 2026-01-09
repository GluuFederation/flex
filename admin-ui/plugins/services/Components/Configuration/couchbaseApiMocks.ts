import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

const USE_REAL_COUCHBASE_API = process.env.REACT_APP_USE_REAL_COUCHBASE_API === 'true'
const DEFAULT_STALE_TIME_MS = 30000
const PRODUCTION_ENV = 'production'
const PRODUCTION_ERROR_MESSAGE =
  'Couchbase configuration API is not available. Mock data is disabled in production.'

function throwIfMocksDisabled(): void {
  if (!USE_REAL_COUCHBASE_API && process.env.NODE_ENV === PRODUCTION_ENV) {
    throw new Error(PRODUCTION_ERROR_MESSAGE)
  }
}

export interface CouchbaseConfiguration {
  configId?: string | null
  userName?: string | null
  userPassword?: string | null
  servers?: string[] | null
  defaultBucket?: string | null
  buckets?: string[] | null
  passwordEncryptionMethod?: string | null
  connectTimeout?: number | null
  computationPoolSize?: number | null
  useSSL?: boolean | null
  sslTrustStoreFile?: string | null
  sslTrustStorePin?: string | null
  sslTrustStoreFormat?: string | null
  enabled?: boolean | null
  binaryAttributes?: string[] | null
  certificateAttributes?: string[] | null
}

export const getGetConfigDatabaseCouchbaseQueryKey = () => {
  return ['config', 'database', 'couchbase'] as const
}

export const useGetConfigDatabaseCouchbase = (options?: { query?: { staleTime?: number } }) => {
  return useQuery<CouchbaseConfiguration[]>({
    queryKey: getGetConfigDatabaseCouchbaseQueryKey(),
    queryFn: async () => {
      if (USE_REAL_COUCHBASE_API) {
        throw new Error('Real Couchbase API not yet implemented.')
      }
      throwIfMocksDisabled()
      if (process.env.NODE_ENV !== PRODUCTION_ENV) {
        // eslint-disable-next-line no-console
        console.warn('[Couchbase API Mocks] useGetConfigDatabaseCouchbase: Returning mock data.')
      }
      return []
    },
    staleTime: options?.query?.staleTime ?? DEFAULT_STALE_TIME_MS,
    retry: false,
  })
}

export const usePutConfigDatabaseCouchbase = (options?: {
  mutation?: {
    onSuccess?: (data: CouchbaseConfiguration, variables: { data: CouchbaseConfiguration }) => void
    onError?: (error: Error, variables: { data: CouchbaseConfiguration }) => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation<CouchbaseConfiguration, Error, { data: CouchbaseConfiguration }>({
    mutationFn: async (variables: { data: CouchbaseConfiguration }) => {
      if (USE_REAL_COUCHBASE_API) {
        throw new Error('Real Couchbase API not yet implemented.')
      }
      throwIfMocksDisabled()
      if (process.env.NODE_ENV !== PRODUCTION_ENV) {
        // eslint-disable-next-line no-console
        console.warn('[Couchbase API Mocks] usePutConfigDatabaseCouchbase: Using mock.')
      }
      return Promise.resolve(variables.data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseCouchbaseQueryKey() })
      options?.mutation?.onSuccess?.(data, variables)
    },
    onError: (error, variables) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update Couchbase configuration'
      dispatch(updateToast(true, 'error', errorMessage))
      // eslint-disable-next-line no-console
      console.error('[Couchbase API] PUT error:', error)
      options?.mutation?.onError?.(error, variables)
    },
  })
}
