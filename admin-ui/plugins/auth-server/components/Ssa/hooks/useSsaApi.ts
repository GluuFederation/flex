import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import type { SsaData, SsaJwtResponse, SsaCreatePayload } from '../types'

interface AuthState {
  token: {
    access_token: string
  }
  config: {
    authServerHost: string
  }
}

interface RootState {
  authReducer: AuthState
}

interface ApiError extends Error {
  status?: number
}

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
      throw new Error('Network error: Unable to reach the server. Please check your connection.')
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
      throw new Error('Network error: Unable to reach the server. Please check your connection.')
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
      throw new Error('Network error: Unable to reach the server. Please check your connection.')
    }
    throw error
  }
}

export const useGetAllSsas = (): UseQueryResult<SsaData[], Error> => {
  const token = useSelector((state: RootState) => state.authReducer.token.access_token)
  const authServerHost = useSelector((state: RootState) => state.authReducer.config.authServerHost)

  return useQuery<SsaData[], Error>({
    queryKey: ['ssas'],
    queryFn: ({ signal }) => fetchAllSsas(token, authServerHost, signal),
    enabled: !!token && !!authServerHost,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.status === 401 || apiError.status === 403) {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useCreateSsa = (): UseMutationResult<SsaData, Error, SsaCreatePayload, unknown> => {
  const token = useSelector((state: RootState) => state.authReducer.token.access_token)
  const authServerHost = useSelector((state: RootState) => state.authReducer.config.authServerHost)
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
      queryClient.invalidateQueries({ queryKey: ['ssas'] })
    },
  })
}

export const useGetSsaJwt = (): UseMutationResult<SsaJwtResponse, Error, string, unknown> => {
  const token = useSelector((state: RootState) => state.authReducer.token.access_token)
  const authServerHost = useSelector((state: RootState) => state.authReducer.config.authServerHost)

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
