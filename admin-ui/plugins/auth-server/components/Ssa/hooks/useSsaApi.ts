import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hooks'
import { invalidateQueriesByKey, queryDefaults } from '@/utils/queryUtils'
import type { SsaData, SsaJwtResponse, SsaCreatePayload } from '../types'

interface ApiError extends Error {
  status?: number
}

export const SSA_QUERY_KEYS = {
  all: ['ssas'] as const,
  detail: (jti: string) => ['ssas', jti] as const,
} as const

const SSA_API_BASE_PATH = '/jans-auth/restv1/ssa'

const buildSsaUrl = (authServerHost: string, path: string = ''): string => {
  return `${authServerHost}${SSA_API_BASE_PATH}${path}`
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Request failed'

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.description || errorData.error || errorMessage
    } catch (parseError) {
      errorMessage = `${errorMessage}: ${response.statusText} (Failed to parse error response: ${parseError instanceof Error ? parseError.message : 'Unknown error'})`
    }

    const error = new Error(errorMessage) as ApiError
    error.status = response.status
    throw error
  }

  try {
    return await response.json()
  } catch (parseError) {
    throw new Error(
      `Failed to parse successful response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      { cause: parseError },
    )
  }
}

const fetchAllSsas = async (
  token: string,
  authServerHost: string,
  signal?: AbortSignal,
): Promise<SsaData[]> => {
  try {
    const response = await fetch(buildSsaUrl(authServerHost), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
      signal,
    })

    return await handleResponse<SsaData[]>(response)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the server. Please check your connection.', {
        cause: error,
      })
    }
    throw error
  }
}

const createSsa = async (
  payload: SsaCreatePayload,
  token: string,
  authServerHost: string,
  signal?: AbortSignal,
): Promise<SsaData> => {
  try {
    const response = await fetch(buildSsaUrl(authServerHost), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
      signal,
    })

    return await handleResponse<SsaData>(response)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the server. Please check your connection.', {
        cause: error,
      })
    }
    throw error
  }
}

const getSsaJwt = async (
  jti: string,
  token: string,
  authServerHost: string,
  signal?: AbortSignal,
): Promise<SsaJwtResponse> => {
  try {
    const params = new URLSearchParams({ jti })
    const response = await fetch(`${buildSsaUrl(authServerHost, '/jwt')}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
      signal,
    })

    return await handleResponse<SsaJwtResponse>(response)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the server. Please check your connection.', {
        cause: error,
      })
    }
    throw error
  }
}

export const useGetAllSsas = (): UseQueryResult<SsaData[], Error> => {
  const token = useAppSelector((state) => state.authReducer.jwtToken)
  const authServerHost = String(
    useAppSelector((state) => state.authReducer.config.authServerHost) ?? '',
  )

  return useQuery<SsaData[], Error>({
    queryKey: SSA_QUERY_KEYS.all,
    queryFn: ({ signal }) => fetchAllSsas(token ?? '', authServerHost, signal),
    enabled: !!token && !!authServerHost,
    ...queryDefaults.queryOptions,
  })
}

export const useSsaJwtQuery = (
  jti: string | null,
  enabled: boolean,
): UseQueryResult<SsaJwtResponse, Error> => {
  const token = useAppSelector((state) => state.authReducer.jwtToken)
  const authServerHost = String(
    useAppSelector((state) => state.authReducer.config.authServerHost) ?? '',
  )

  return useQuery<SsaJwtResponse, Error>({
    queryKey: SSA_QUERY_KEYS.detail(jti ?? 'pending'),
    queryFn: ({ signal }) => {
      if (!jti) {
        throw new Error('No SSA selected')
      }
      return getSsaJwt(jti, token ?? '', authServerHost, signal)
    },
    enabled: enabled && !!jti && !!token && !!authServerHost,
    ...queryDefaults.queryOptions,
  })
}

export const useCreateSsa = () => {
  const token = useAppSelector((state) => state.authReducer.jwtToken)
  const authServerHost = String(
    useAppSelector((state) => state.authReducer.config.authServerHost) ?? '',
  )
  const queryClient = useQueryClient()

  return useMutation<SsaData, Error, SsaCreatePayload>({
    mutationFn: (payload: SsaCreatePayload) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!authServerHost) {
        throw new Error('Auth server host not configured')
      }
      return createSsa(payload, token, authServerHost)
    },
    onSuccess: () => {
      invalidateQueriesByKey(queryClient, SSA_QUERY_KEYS.all)
    },
  })
}

export const useGetSsaJwt = () => {
  const token = useAppSelector((state) => state.authReducer.jwtToken)
  const authServerHost = String(
    useAppSelector((state) => state.authReducer.config.authServerHost) ?? '',
  )

  return useMutation<SsaJwtResponse, Error, string>({
    mutationFn: (jti: string) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!authServerHost) {
        throw new Error('Auth server host not configured')
      }
      return getSsaJwt(jti, token, authServerHost)
    },
  })
}
