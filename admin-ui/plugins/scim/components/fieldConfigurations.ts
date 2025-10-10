import { LOGGING_LEVELS, PROTECTION_MODES } from '../helper'
import type { ScimFormValues } from '../types'

export type FieldType = 'text' | 'number' | 'select' | 'toggle'

export interface FieldConfig {
  name: keyof ScimFormValues
  label: string
  type: FieldType
  disabled?: boolean
  selectOptions?: readonly string[] | string[]
}

/**
 * Configuration for all SCIM form fields
 * Order matters - fields will be rendered in this order
 */
export const SCIM_FIELD_CONFIGS: FieldConfig[] = [
  {
    name: 'baseDN',
    label: 'fields.base_dn',
    type: 'text',
    disabled: true,
  },
  {
    name: 'applicationUrl',
    label: 'fields.application_url',
    type: 'text',
  },
  {
    name: 'baseEndpoint',
    label: 'fields.base_endpoint',
    type: 'text',
  },
  {
    name: 'personCustomObjectClass',
    label: 'fields.person_custom_object_class',
    type: 'text',
  },
  {
    name: 'oxAuthIssuer',
    label: 'fields.ox_auth_issuer',
    type: 'text',
  },
  {
    name: 'protectionMode',
    label: 'fields.protection_mode',
    type: 'select',
    selectOptions: PROTECTION_MODES,
  },
  {
    name: 'maxCount',
    label: 'fields.max_count',
    type: 'number',
  },
  {
    name: 'bulkMaxOperations',
    label: 'fields.bulk_max_operations',
    type: 'number',
  },
  {
    name: 'bulkMaxPayloadSize',
    label: 'fields.bulk_max_payload_size',
    type: 'number',
  },
  {
    name: 'userExtensionSchemaURI',
    label: 'fields.user_extension_schema_uri',
    type: 'text',
  },
  {
    name: 'loggingLevel',
    label: 'fields.logging_level',
    type: 'select',
    selectOptions: LOGGING_LEVELS,
  },
  {
    name: 'loggingLayout',
    label: 'fields.logging_layout',
    type: 'text',
  },
  {
    name: 'metricReporterInterval',
    label: 'fields.metric_reporter_interval',
    type: 'number',
  },
  {
    name: 'metricReporterKeepDataDays',
    label: 'fields.metric_reporter_keep_data_days',
    type: 'number',
  },
  {
    name: 'metricReporterEnabled',
    label: 'fields.metric_reporter_enabled',
    type: 'toggle',
  },
  {
    name: 'disableJdkLogger',
    label: 'fields.disable_jdk_logger',
    type: 'toggle',
  },
  {
    name: 'disableLoggerTimer',
    label: 'fields.disable_logger_timer',
    type: 'toggle',
  },
  {
    name: 'useLocalCache',
    label: 'fields.use_local_cache',
    type: 'toggle',
  },
  {
    name: 'skipDefinedPasswordValidation',
    label: 'fields.skip_defined_password_validation',
    type: 'toggle',
  },
]
