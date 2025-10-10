import { JsonPatch } from 'JansConfigApi'

// Form values for Jans Lock Configuration
export interface JansLockConfigFormValues {
  tokenChannels: string[]
  disableJdkLogger: boolean | string
  loggingLevel: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterEnabled: boolean | string
  metricReporterInterval: number | string
  metricReporterKeepDataDays: number | string
  cleanServiceInterval: number | string
  cleanServiceBatchChunkSize: number | string
  baseDN?: string
  baseEndpoint?: string
  clientId?: string
  endpointDetails?: Record<string, unknown>
  endpointGroups?: Record<string, unknown>
  errorReasonEnabled?: boolean | string
  messageConsumerType?: string
  openIdIssuer?: string
  statEnabled?: boolean | string
  statTimerIntervalInSeconds?: number | string
  tokenUrl?: string
}

export interface JansLockConfigurationProps {
  // Component props can be added here if needed in the future
}

export interface CreateJansLockPayloadParams {
  formValues: JansLockConfigFormValues
  originalConfig: Record<string, unknown>
}

// Use JsonPatch type from JansConfigApi
export type PatchOperation = JsonPatch
