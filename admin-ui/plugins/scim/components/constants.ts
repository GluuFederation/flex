import { LOGGING_LEVELS, PROTECTION_MODES } from '../helper/constants'
import type { ScimFormValues } from '../types'

export type FieldType = 'text' | 'number' | 'select' | 'toggle'

export interface FieldConfig {
  name: keyof ScimFormValues
  label: string
  type: FieldType
  disabled?: boolean
  selectOptions?: readonly string[] | string[]
  colSize?: number
}

/**
 * Configuration for all SCIM form fields
 * Order and colSize match the Figma design layout
 */
export const SCIM_FIELD_CONFIGS: FieldConfig[] = [
  {
    name: 'baseDN',
    label: 'fields.base_dn',
    type: 'text',
    disabled: true,
    colSize: 12,
  },
  {
    name: 'applicationUrl',
    label: 'fields.application_url',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'baseEndpoint',
    label: 'fields.base_endpoint',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'personCustomObjectClass',
    label: 'fields.person_custom_object_class',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'oxAuthIssuer',
    label: 'fields.ox_auth_issuer',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'protectionMode',
    label: 'fields.protection_mode',
    type: 'select',
    selectOptions: PROTECTION_MODES,
    colSize: 6,
  },
  {
    name: 'maxCount',
    label: 'fields.max_count',
    type: 'number',
    colSize: 6,
  },
  {
    name: 'bulkMaxOperations',
    label: 'fields.bulk_max_operations',
    type: 'number',
    colSize: 6,
  },
  {
    name: 'bulkMaxPayloadSize',
    label: 'fields.bulk_max_payload_size',
    type: 'number',
    colSize: 6,
  },
  {
    name: 'userExtensionSchemaURI',
    label: 'fields.user_extension_schema_uri',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'loggingLevel',
    label: 'fields.logging_level',
    type: 'select',
    selectOptions: LOGGING_LEVELS,
    colSize: 6,
  },
  {
    name: 'loggingLayout',
    label: 'fields.logging_layout',
    type: 'text',
    colSize: 6,
  },
  {
    name: 'metricReporterInterval',
    label: 'fields.metric_reporter_interval',
    type: 'number',
    colSize: 6,
  },
  {
    name: 'metricReporterKeepDataDays',
    label: 'fields.metric_reporter_keep_data_days',
    type: 'number',
    colSize: 6,
  },
  {
    name: 'metricReporterEnabled',
    label: 'fields.metric_reporter_enabled',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'useLocalCache',
    label: 'fields.use_local_cache',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'disableJdkLogger',
    label: 'fields.disable_jdk_logger',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'skipDefinedPasswordValidation',
    label: 'fields.skip_defined_password_validation',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'disableLoggerTimer',
    label: 'fields.disable_logger_timer',
    type: 'toggle',
    colSize: 6,
  },
]
