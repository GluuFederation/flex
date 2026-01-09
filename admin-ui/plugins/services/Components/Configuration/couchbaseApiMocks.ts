import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'

export interface CouchbaseConfiguration {
  configId?: string
  userName?: string
  userPassword?: string
  servers?: string[]
  defaultBucket?: string
  buckets?: string[]
  passwordEncryptionMethod?: string
  connectTimeout?: number
  computationPoolSize?: number
  useSSL?: boolean
  sslTrustStoreFile?: string
  sslTrustStorePin?: string
  sslTrustStoreFormat?: string
  enabled?: boolean
  binaryAttributes?: string[]
  certificateAttributes?: string[]
}

export const useGetConfigDatabaseCouchbase = (options?: { query?: { staleTime?: number } }) => {
  return useQuery({
    queryKey: ['/api/v1/config/database'],
    queryFn: async () => {
      return [] as CouchbaseConfiguration[]
    },
    staleTime: options?.query?.staleTime ?? 30000,
  })
}

export const usePutConfigDatabaseCouchbase = (options?: {
  mutation?: {
    onSuccess?: (data: unknown, variables: { data: CouchbaseConfiguration }) => void
    onError?: () => void
  }
}) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { data: CouchbaseConfiguration }) => {
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

export const getGetConfigDatabaseCouchbaseQueryKey = () => {
  return ['/api/v1/config/database'] as const
}
