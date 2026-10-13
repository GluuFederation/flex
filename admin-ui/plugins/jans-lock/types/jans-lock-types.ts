import type { AppConfiguration4 } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { FormikProps } from 'formik'

export type LockConfig = AppConfiguration4

export type PatchOperation = {
  op: 'add' | 'replace'
  path: string
  value: JsonValue
}

type NumberInput = number | ''

export type PolicySourceFormValues = {
  enabled: boolean
  policyStoreUri: string
  authorizationToken: string
}

export type TraceBindingFormValues = {
  clientId: string
  evidenceDomainId: string
  allowedProducerIds: string
}

type CedarlingFormValues = {
  enabled: boolean
  logType: string
  logLevel: string
  externalPolicyStoreUri: string
  maxEntries: NumberInput
  policySources: PolicySourceFormValues[]
}

type GrpcFormValues = {
  serverMode: string
  grpcPort: NumberInput
  useTls: boolean
  tlsCertChainFilePath: string
  tlsPrivateKeyFilePath: string
}

type TraceFormValues = {
  enabled: boolean
  defaultEvidenceDomainId: string
  clientDomainBindings: TraceBindingFormValues[]
  latenessThresholdSeconds: NumberInput
  maxRequestBytes: NumberInput
  maxJsonDepth: NumberInput
  maxStringLength: NumberInput
  maxArrayLength: NumberInput
  maxObjectMembers: NumberInput
  receiptAllocationRetryLimit: NumberInput
  receiptRepairIntervalSeconds: NumberInput
  pendingReceiptTimeoutSeconds: NumberInput
  maxBulkRecords: NumberInput
  maxBulkRequestBytes: NumberInput
}

export type JansLockConfigFormValues = {
  baseDN: string
  baseEndpoint: string
  openIdIssuer: string
  clientId: string
  clientPassword: string
  tokenChannels: string
  messageConsumerType: string
  errorReasonEnabled: boolean
  protectionMode: string
  auditPersistenceMode: string
  statEnabled: boolean
  statTimerIntervalInSeconds: NumberInput
  disableJdkLogger: boolean
  disableExternalLoggerConfiguration: boolean
  loggingLevel: string
  loggingLayout: string
  externalLoggerConfiguration: string
  metricReporterEnabled: boolean
  metricReporterInterval: NumberInput
  metricReporterKeepDataDays: NumberInput
  cleanServiceInterval: NumberInput
  cleanServiceBatchChunkSize: NumberInput
  cedarlingConfiguration: CedarlingFormValues
  grpcConfiguration: GrpcFormValues
  traceConfiguration: TraceFormValues
}

export type LockSectionKey = 'cedarlingConfiguration' | 'grpcConfiguration' | 'traceConfiguration'

export type LockSections = Record<LockSectionKey, boolean>

type FieldKind = 'string' | 'number' | 'boolean' | 'csv'

export type FieldType = 'text' | 'number' | 'select' | 'toggle' | 'password'

export type FieldConfig = {
  name: string
  label: string
  type: FieldType
  readOnly?: boolean
  required?: boolean
  selectOptions?: readonly string[]
  colSize?: number
  placeholder?: string
  docEntry?: string
}

export type LockFieldSpec = {
  path: string
  kind: FieldKind
  label: string
  defaultValue?: boolean | string
  readOnly?: boolean
  section?: LockSectionKey
}

export type LockListKey =
  'cedarlingConfiguration.policySources' | 'traceConfiguration.clientDomainBindings'

type LockListConfig = {
  name: LockListKey
  title: string
  addLabel: string
  emptyText: string
  fields: FieldConfig[]
  newItem: PolicySourceFormValues | TraceBindingFormValues
}

export type LockFormSection = {
  id: string
  title: string
  requires?: LockSectionKey
  fields: FieldConfig[]
  list?: LockListConfig
}

export type JansLockFormClasses = {
  section: string
  accordionSpacing: string
  fieldsGrid: string
  formLabels: string
  formWithInputs: string
  fieldItem: string
  fieldItemFullWidth: string
  listBox: string
  listBoxEmpty: string
  listHeader: string
  listTitle: string
  listBody: string
  listRow: string
  listRowFields: string
  listEmpty: string
  listActionBtn: string
  listActionIcon: string
}

export type JansLockConfigurationProps = {
  lockConfig: LockConfig
  onUpdate: (patches: PatchOperation[]) => void
  isSubmitting?: boolean
  canWriteLock?: boolean
  classes: JansLockFormClasses
}

export type JansLockFieldRendererProps = {
  config: FieldConfig
  formik: FormikProps<JansLockConfigFormValues>
  fieldItemClass: string
  fieldItemFullWidthClass: string
  viewOnly: boolean
}

export type JansLockListEditorProps = {
  config: LockListConfig
  formik: FormikProps<JansLockConfigFormValues>
  classes: JansLockFormClasses
  viewOnly: boolean
}
