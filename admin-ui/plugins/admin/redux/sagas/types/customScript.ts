// CustomScript saga specific type definitions

import { CustomScriptItem } from '../../features/types/customScript'

// Define the auth state interface
export interface CustomScriptAuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

// Define root state interface for custom script saga
export interface CustomScriptRootState {
  authReducer: CustomScriptAuthState
}

// Custom script API response types
export interface CustomScriptListResponse {
  entries?: CustomScriptItem[]
  totalEntriesCount?: number
  entriesCount?: number
}

// Saga payload types
export interface CustomScriptActionPayload {
  action: Record<string, unknown>
}

export interface CreateCustomScriptSagaPayload {
  payload: {
    action: {
      action_data: CustomScriptItem
    }
  }
}

export interface UpdateCustomScriptSagaPayload {
  payload: {
    action: {
      action_data: CustomScriptItem
    }
  }
}

export interface DeleteCustomScriptSagaPayload {
  action: {
    action_data: string // inum
  }
}

export interface GetCustomScriptsSagaPayload {
  payload?: {
    action: Record<string, unknown>
  }
}

export interface GetCustomScriptsByTypeSagaPayload {
  payload: {
    action: {
      type: string
      [key: string]: unknown
    }
  }
}
