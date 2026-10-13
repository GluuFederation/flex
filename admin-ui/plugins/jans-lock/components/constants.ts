import { LOCK_FIELD_SPECS, LOCK_LIST_SPECS, jansLockConstants } from '../helper/constants'
import type { FieldConfig, FieldType, LockFormSection, LockListKey } from '../types'

const LABELS = new Map(
  [...LOCK_FIELD_SPECS, ...LOCK_LIST_SPECS].map(({ path, label }) => [path, label]),
)
const READ_ONLY = new Set(LOCK_FIELD_SPECS.filter((spec) => spec.readOnly).map(({ path }) => path))

const field = (
  name: string,
  type: FieldType,
  extra: Omit<FieldConfig, 'name' | 'type' | 'label'> = {},
): FieldConfig => ({
  name,
  type,
  label: LABELS.get(name) ?? name,
  readOnly: READ_ONLY.has(name),
  colSize: 6,
  ...extra,
})

const listTitle = (name: LockListKey): string => LABELS.get(name) ?? name

export const JANS_LOCK_SECTIONS: LockFormSection[] = [
  {
    id: 'general',
    title: 'titles.lock_general',
    fields: [
      field('baseEndpoint', 'text', {
        placeholder: 'placeholders.enter_lock_base_endpoint',
        required: true,
      }),
      field('openIdIssuer', 'text', {
        placeholder: 'placeholders.enter_lock_openid_issuer',
        required: true,
      }),
      field('clientId', 'text', { placeholder: 'placeholders.enter_client_id', required: true }),
      field('clientPassword', 'password'),
      field('baseDN', 'text'),
      field('tokenChannels', 'text', { placeholder: 'placeholders.enter_token_channels' }),
      field('messageConsumerType', 'text', {
        placeholder: 'placeholders.enter_lock_message_consumer_type',
      }),
      field('errorReasonEnabled', 'toggle'),
    ],
  },
  {
    id: 'protection',
    title: 'titles.lock_protection_and_audit',
    fields: [
      field('protectionMode', 'select', { selectOptions: jansLockConstants.PROTECTION_MODES }),
      field('auditPersistenceMode', 'select', {
        selectOptions: jansLockConstants.AUDIT_PERSISTENCE_MODES,
      }),
    ],
  },
  {
    id: 'cedarling',
    title: 'titles.lock_cedarling',
    requires: 'cedarlingConfiguration',
    fields: [
      field('cedarlingConfiguration.logType', 'select', {
        selectOptions: jansLockConstants.CEDARLING_LOG_TYPES,
      }),
      field('cedarlingConfiguration.logLevel', 'select', {
        selectOptions: jansLockConstants.CEDARLING_LOG_LEVELS,
      }),
      field('cedarlingConfiguration.externalPolicyStoreUri', 'text', {
        placeholder: 'placeholders.enter_lock_external_policy_store_uri',
      }),
      field('cedarlingConfiguration.maxEntries', 'number'),
      field('cedarlingConfiguration.enabled', 'toggle'),
    ],
    list: {
      name: 'cedarlingConfiguration.policySources',
      title: listTitle('cedarlingConfiguration.policySources'),
      addLabel: 'actions.lock_add_policy_source',
      emptyText: 'messages.lock_no_policy_sources',
      newItem: { enabled: true, policyStoreUri: '', authorizationToken: '' },
      fields: [
        {
          name: 'policyStoreUri',
          type: 'text',
          label: 'fields.lock_policy_store_uri',
          placeholder: 'placeholders.enter_lock_policy_store_uri',
          colSize: 6,
        },
        {
          name: 'authorizationToken',
          type: 'password',
          label: 'fields.lock_policy_authorization_token',
          placeholder: 'placeholders.enter_lock_policy_authorization_token',
          colSize: 6,
        },
        { name: 'enabled', type: 'toggle', label: 'fields.enabled', colSize: 6 },
      ],
    },
  },
  {
    id: 'grpc',
    title: 'titles.lock_grpc',
    requires: 'grpcConfiguration',
    fields: [
      field('grpcConfiguration.serverMode', 'select', {
        selectOptions: jansLockConstants.GRPC_SERVER_MODES,
      }),
      field('grpcConfiguration.grpcPort', 'number'),
      field('grpcConfiguration.tlsCertChainFilePath', 'text', {
        placeholder: 'placeholders.enter_lock_grpc_tls_cert_chain_file_path',
      }),
      field('grpcConfiguration.tlsPrivateKeyFilePath', 'text', {
        placeholder: 'placeholders.enter_lock_grpc_tls_private_key_file_path',
      }),
      field('grpcConfiguration.useTls', 'toggle'),
    ],
  },
  {
    id: 'trace',
    title: 'titles.lock_trace',
    requires: 'traceConfiguration',
    fields: [
      field('traceConfiguration.defaultEvidenceDomainId', 'text', {
        placeholder: 'placeholders.enter_lock_trace_default_evidence_domain_id',
      }),
      field('traceConfiguration.latenessThresholdSeconds', 'number'),
      field('traceConfiguration.maxRequestBytes', 'number'),
      field('traceConfiguration.maxJsonDepth', 'number'),
      field('traceConfiguration.maxStringLength', 'number'),
      field('traceConfiguration.maxArrayLength', 'number'),
      field('traceConfiguration.maxObjectMembers', 'number'),
      field('traceConfiguration.receiptAllocationRetryLimit', 'number'),
      field('traceConfiguration.receiptRepairIntervalSeconds', 'number'),
      field('traceConfiguration.pendingReceiptTimeoutSeconds', 'number'),
      field('traceConfiguration.maxBulkRecords', 'number'),
      field('traceConfiguration.maxBulkRequestBytes', 'number'),
      field('traceConfiguration.enabled', 'toggle'),
    ],
    list: {
      name: 'traceConfiguration.clientDomainBindings',
      title: listTitle('traceConfiguration.clientDomainBindings'),
      addLabel: 'actions.lock_add_client_binding',
      emptyText: 'messages.lock_no_client_bindings',
      newItem: { clientId: '', evidenceDomainId: '', allowedProducerIds: '' },
      fields: [
        {
          name: 'clientId',
          type: 'text',
          label: 'fields.client_id',
          placeholder: 'placeholders.enter_client_id',
          required: true,
          colSize: 6,
        },
        {
          name: 'evidenceDomainId',
          type: 'text',
          label: 'fields.lock_trace_evidence_domain_id',
          placeholder: 'placeholders.enter_lock_trace_evidence_domain_id',
          required: true,
          colSize: 6,
        },
        {
          name: 'allowedProducerIds',
          type: 'text',
          label: 'fields.lock_trace_allowed_producer_ids',
          placeholder: 'placeholders.enter_lock_trace_allowed_producer_ids',
          colSize: 12,
        },
      ],
    },
  },
  {
    id: 'logging',
    title: 'titles.lock_logging',
    fields: [
      field('loggingLevel', 'select', { selectOptions: jansLockConstants.LOGGING_LEVELS }),
      field('loggingLayout', 'text', { placeholder: 'placeholders.enter_logging_layout' }),
      field('externalLoggerConfiguration', 'text', {
        placeholder: 'placeholders.enter_external_logger_configuration',
      }),
      field('disableJdkLogger', 'toggle'),
      field('disableExternalLoggerConfiguration', 'toggle'),
    ],
  },
  {
    id: 'metrics',
    title: 'titles.lock_metrics_and_stats',
    fields: [
      field('metricReporterInterval', 'number', {
        placeholder: 'placeholders.enter_metric_reporter_interval',
      }),
      field('metricReporterKeepDataDays', 'number', {
        placeholder: 'placeholders.enter_metric_reporter_keep_data_days',
      }),
      field('statTimerIntervalInSeconds', 'number'),
      field('metricReporterEnabled', 'toggle'),
      field('statEnabled', 'toggle'),
    ],
  },
  {
    id: 'cleanup',
    title: 'titles.lock_clean_service',
    fields: [
      field('cleanServiceInterval', 'number', {
        placeholder: 'placeholders.enter_clean_service_interval',
      }),
      field('cleanServiceBatchChunkSize', 'number'),
    ],
  },
]
