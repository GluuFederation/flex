import { jansLockConstants } from '../helper/constants'
import type { FieldConfig } from '../types'

export const JANS_LOCK_FIELD_CONFIGS: FieldConfig[] = [
  {
    name: 'baseDN',
    label: 'fields.base_dn',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_base_dn',
  },

  {
    name: 'loggingLevel',
    label: 'fields.logging_level',
    type: 'select',
    selectOptions: jansLockConstants.LOGGING_LEVELS,
    colSize: 6,
  },
  {
    name: 'loggingLayout',
    label: 'fields.logging_layout',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_logging_layout',
  },
  {
    name: 'externalLoggerConfiguration',
    label: 'fields.external_logger_configuration',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_external_logger_configuration',
  },

  {
    name: 'metricReporterInterval',
    label: 'fields.metric_reporter_interval',
    type: 'number',
    colSize: 6,
    placeholder: 'placeholders.enter_metric_reporter_interval',
  },
  {
    name: 'metricReporterKeepDataDays',
    label: 'fields.metric_reporter_keep_data_days',
    type: 'number',
    colSize: 6,
    placeholder: 'placeholders.enter_metric_reporter_keep_data_days',
  },
  {
    name: 'metricChannel',
    label: 'fields.metric_channel',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_metric_channel',
  },
  {
    name: 'cleanServiceInterval',
    label: 'fields.clean_service_interval',
    type: 'number',
    colSize: 6,
    placeholder: 'placeholders.enter_clean_service_interval',
  },

  {
    name: 'policiesJsonUrisAuthorizationToken',
    label: 'fields.policies_json_uris_authorization_token',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_policies_json_uris_authorization_token',
  },
  {
    name: 'policiesJsonUris',
    label: 'fields.policies_json_uris',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_policies_json_uris',
  },
  {
    name: 'policiesZipUrisAuthorizationToken',
    label: 'fields.policies_zip_uris_authorization_token',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_policies_zip_uris_authorization_token',
  },
  {
    name: 'policiesZipUris',
    label: 'fields.policies_zip_uris',
    type: 'text',
    colSize: 6,
    placeholder: 'placeholders.enter_policies_zip_uris',
  },

  {
    name: 'disableJdkLogger',
    label: 'fields.disable_jdk_logger',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'disableExternalLoggerConfiguration',
    label: 'fields.disable_external_logger_configuration',
    type: 'toggle',
    colSize: 6,
  },
  {
    name: 'metricReporterEnabled',
    label: 'fields.metric_reporter_enabled',
    type: 'toggle',
    colSize: 6,
  },
]
