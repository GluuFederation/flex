// Common type definitions for the application

export interface User {
  id: string
  username: string
  email: string
  roles: string[]
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type ApiError = {
  message: string
  code: string
  status: number
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ReduxState {
  loading: LoadingState
  error: ApiError | null
  data: any
}

// Redux Root State interface for auth-related state
export interface AuthRootState {
  authReducer: {
    token: {
      access_token: string
    }
    userinfo: {
      inum?: string
      name?: string
    }
    config: {
      clientId: string
    }
    location: {
      IPv4: string
    }
  }
}
