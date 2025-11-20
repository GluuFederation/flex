import type { Logging } from 'JansConfigApi'

// Redux state interface for logging
export interface LoggingReducerState {
  logging: Logging | null
  loading: boolean
}

// Root state interface for logging selectors
export interface RootState {
  loggingReducer: LoggingReducerState
}
