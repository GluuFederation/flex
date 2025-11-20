import type { Logging } from 'JansConfigApi'

// Redux state interface for logging
export interface LoggingReducerState {
  logging: Logging | null
  loading: boolean
}

// Root state interface for logging selectors
export interface LoggingModuleRootState {
  loggingReducer: LoggingReducerState
}

// Payload type for editLoggingConfig action
export interface EditLoggingPayload {
  data: Record<string, string>
  otherFields: {
    userMessage: string
    changedFields: Record<string, { oldValue: unknown; newValue: unknown }>
  }
}
