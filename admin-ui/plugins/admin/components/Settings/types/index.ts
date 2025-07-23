import { CedarlingLogType } from '@/cedarling'

// Define types for the Redux state
export interface AuthState {
  loadingConfig: boolean
  config: {
    additionalParameters?: any[]
    acrValues?: string
    sessionTimeoutInMins?: number
    cedarlingLogType?: CedarlingLogType
  }
}

export interface InitState {
  loadingScripts: boolean
  scripts: Script[]
}

export interface Script {
  scriptType: string
  enabled: boolean
  name: string
}

export interface RootState {
  authReducer: AuthState
  initReducer: InitState
}

// Define formik values interface
export interface FormValues {
  sessionTimeoutInMins: number
  acrValues: string
  cedarlingLogType: CedarlingLogType
}
