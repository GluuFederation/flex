import type { Logging } from 'JansConfigApi'

export type ChangedFields<T extends object> = {
  [K in keyof T]?: { oldValue: T[K]; newValue: T[K] }
}

// Redux state interface for logging
export interface LoggingReducerState {
  logging: Logging | null
  loading: boolean
}

// Root state interface for logging selectors
export interface LoggingModuleRootState {
  loggingReducer: LoggingReducerState
}

export interface EditLoggingPayload {
  data: Record<string, string>
  otherFields: {
    userMessage: string
    changedFields: ChangedFields<Logging>
  }
}
