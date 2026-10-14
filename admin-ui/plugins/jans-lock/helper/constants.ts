import type {
  AppConfiguration4AuditPersistenceMode,
  AppConfiguration4ProtectionMode,
  CedarlingConfiguration1LogLevel,
  CedarlingConfiguration1LogType,
  GrpcConfigurationServerMode,
} from 'JansConfigApi'
import { LOGGING_LEVELS } from '@/constants'
import type { LockFieldSpec, LockListKey, LockSectionKey } from '../types'

const PROTECTION_MODES: readonly AppConfiguration4ProtectionMode[] = ['oauth', 'cedarling']
const AUDIT_PERSISTENCE_MODES: readonly AppConfiguration4AuditPersistenceMode[] = [
  'internal',
  'config-api',
]
const CEDARLING_LOG_TYPES: readonly CedarlingConfiguration1LogType[] = ['OFF', 'MEMORY', 'STD_OUT']
const CEDARLING_LOG_LEVELS: readonly CedarlingConfiguration1LogLevel[] = [
  'FATAL',
  'ERROR',
  'WARN',
  'INFO',
  'DEBUG',
  'TRACE',
]
const GRPC_SERVER_MODES: readonly GrpcConfigurationServerMode[] = [
  'disabled',
  'bridge',
  'plain_server',
  'tls_server',
]

const CEDARLING: LockSectionKey = 'cedarlingConfiguration'
const GRPC: LockSectionKey = 'grpcConfiguration'
const TRACE: LockSectionKey = 'traceConfiguration'

export const LOCK_FIELD_SPECS: readonly LockFieldSpec[] = [
  { path: 'baseDN', kind: 'string', label: 'fields.base_dn', readOnly: true },
  { path: 'baseEndpoint', kind: 'string', label: 'fields.lock_base_endpoint' },
  { path: 'openIdIssuer', kind: 'string', label: 'fields.lock_openid_issuer' },
  { path: 'clientId', kind: 'string', label: 'fields.client_id' },
  { path: 'clientPassword', kind: 'string', label: 'fields.client_password', readOnly: true },
  { path: 'tokenChannels', kind: 'csv', label: 'fields.token_channels' },
  { path: 'messageConsumerType', kind: 'string', label: 'fields.lock_message_consumer_type' },
  {
    path: 'errorReasonEnabled',
    kind: 'boolean',
    label: 'fields.error_reason_enabled',
    defaultValue: false,
  },
  {
    path: 'protectionMode',
    kind: 'string',
    label: 'fields.lock_protection_mode',
    defaultValue: PROTECTION_MODES[0],
  },
  {
    path: 'auditPersistenceMode',
    kind: 'string',
    label: 'fields.lock_audit_persistence_mode',
    defaultValue: AUDIT_PERSISTENCE_MODES[0],
  },
  {
    path: 'cedarlingConfiguration.enabled',
    kind: 'boolean',
    label: 'fields.lock_cedarling_enabled',
    defaultValue: false,
    section: CEDARLING,
  },
  {
    path: 'cedarlingConfiguration.logType',
    kind: 'string',
    label: 'fields.lock_cedarling_log_type',
    defaultValue: 'STD_OUT',
    section: CEDARLING,
  },
  {
    path: 'cedarlingConfiguration.logLevel',
    kind: 'string',
    label: 'fields.lock_cedarling_log_level',
    defaultValue: 'INFO',
    section: CEDARLING,
  },
  {
    path: 'cedarlingConfiguration.externalPolicyStoreUri',
    kind: 'string',
    label: 'fields.lock_external_policy_store_uri',
    section: CEDARLING,
  },
  {
    path: 'cedarlingConfiguration.maxEntries',
    kind: 'number',
    label: 'fields.lock_max_entries',
    section: CEDARLING,
  },
  {
    path: 'grpcConfiguration.serverMode',
    kind: 'string',
    label: 'fields.lock_grpc_server_mode',
    defaultValue: 'bridge',
    section: GRPC,
  },
  {
    path: 'grpcConfiguration.grpcPort',
    kind: 'number',
    label: 'fields.lock_grpc_port',
    section: GRPC,
  },
  {
    path: 'grpcConfiguration.useTls',
    kind: 'boolean',
    label: 'fields.lock_grpc_use_tls',
    defaultValue: false,
    section: GRPC,
  },
  {
    path: 'grpcConfiguration.tlsCertChainFilePath',
    kind: 'string',
    label: 'fields.lock_grpc_tls_cert_chain_file_path',
    section: GRPC,
  },
  {
    path: 'grpcConfiguration.tlsPrivateKeyFilePath',
    kind: 'string',
    label: 'fields.lock_grpc_tls_private_key_file_path',
    section: GRPC,
  },
  {
    path: 'traceConfiguration.enabled',
    kind: 'boolean',
    label: 'fields.lock_trace_enabled',
    defaultValue: true,
    section: TRACE,
  },
  {
    path: 'traceConfiguration.defaultEvidenceDomainId',
    kind: 'string',
    label: 'fields.lock_trace_default_evidence_domain_id',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.latenessThresholdSeconds',
    kind: 'number',
    label: 'fields.lock_trace_lateness_threshold_seconds',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxRequestBytes',
    kind: 'number',
    label: 'fields.lock_trace_max_request_bytes',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxJsonDepth',
    kind: 'number',
    label: 'fields.lock_trace_max_json_depth',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxStringLength',
    kind: 'number',
    label: 'fields.lock_trace_max_string_length',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxArrayLength',
    kind: 'number',
    label: 'fields.lock_trace_max_array_length',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxObjectMembers',
    kind: 'number',
    label: 'fields.lock_trace_max_object_members',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.receiptAllocationRetryLimit',
    kind: 'number',
    label: 'fields.lock_trace_receipt_allocation_retry_limit',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.receiptRepairIntervalSeconds',
    kind: 'number',
    label: 'fields.lock_trace_receipt_repair_interval_seconds',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.pendingReceiptTimeoutSeconds',
    kind: 'number',
    label: 'fields.lock_trace_pending_receipt_timeout_seconds',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxBulkRecords',
    kind: 'number',
    label: 'fields.lock_trace_max_bulk_records',
    section: TRACE,
  },
  {
    path: 'traceConfiguration.maxBulkRequestBytes',
    kind: 'number',
    label: 'fields.lock_trace_max_bulk_request_bytes',
    section: TRACE,
  },
  { path: 'loggingLevel', kind: 'string', label: 'fields.logging_level' },
  { path: 'loggingLayout', kind: 'string', label: 'fields.logging_layout' },
  {
    path: 'externalLoggerConfiguration',
    kind: 'string',
    label: 'fields.external_logger_configuration',
  },
  {
    path: 'disableJdkLogger',
    kind: 'boolean',
    label: 'fields.disable_jdk_logger',
    defaultValue: true,
  },
  {
    path: 'disableExternalLoggerConfiguration',
    kind: 'boolean',
    label: 'fields.disable_external_logger_configuration',
    defaultValue: true,
  },
  {
    path: 'metricReporterEnabled',
    kind: 'boolean',
    label: 'fields.metric_reporter_enabled',
    defaultValue: false,
  },
  { path: 'metricReporterInterval', kind: 'number', label: 'fields.metric_reporter_interval' },
  {
    path: 'metricReporterKeepDataDays',
    kind: 'number',
    label: 'fields.metric_reporter_keep_data_days',
  },
  { path: 'statEnabled', kind: 'boolean', label: 'fields.lock_stat_enabled', defaultValue: false },
  {
    path: 'statTimerIntervalInSeconds',
    kind: 'number',
    label: 'fields.lock_stat_timer_interval_in_seconds',
  },
  { path: 'cleanServiceInterval', kind: 'number', label: 'fields.clean_service_interval' },
  {
    path: 'cleanServiceBatchChunkSize',
    kind: 'number',
    label: 'fields.clean_service_batch_chunk_size',
  },
]

export const LOCK_LIST_SPECS: readonly {
  path: LockListKey
  label: string
  section: LockSectionKey
}[] = [
  {
    path: 'cedarlingConfiguration.policySources',
    label: 'fields.lock_policy_sources',
    section: CEDARLING,
  },
  {
    path: 'traceConfiguration.clientDomainBindings',
    label: 'fields.lock_trace_client_domain_bindings',
    section: TRACE,
  },
]

export const jansLockConstants = {
  DOC_CATEGORY: 'jans_lock',
  LOGGING_LEVELS,
  PROTECTION_MODES,
  AUDIT_PERSISTENCE_MODES,
  CEDARLING_LOG_TYPES,
  CEDARLING_LOG_LEVELS,
  GRPC_SERVER_MODES,
  MAX_PORT: 65535,
} as const
