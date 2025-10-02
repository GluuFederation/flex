export const fidoConstants = {
  DOC_CATEGORY: 'fido',
  DYNAMIC: 'dynamic',
  STATIC: 'static',

  LOGGING_LEVELS: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'],

  BUTTON_TEXT: {
    ADD_CLASSES: 'actions.add_classes',
    ADD_TYPES: 'actions.add_types',
    ADD_PARTY: 'actions.add_party',
  } as const,

  FORM_FIELDS: {
    // Dynamic Configuration Fields
    ISSUER: 'issuer',
    BASE_ENDPOINT: 'baseEndpoint',
    CLEAN_SERVICE_INTERVAL: 'cleanServiceInterval',
    CLEAN_SERVICE_BATCH_CHUNK_SIZE: 'cleanServiceBatchChunkSize',
    USE_LOCAL_CACHE: 'useLocalCache',
    DISABLE_JDK_LOGGER: 'disableJdkLogger',
    LOGGING_LEVEL: 'loggingLevel',
    LOGGING_LAYOUT: 'loggingLayout',
    EXTERNAL_LOGGER_CONFIGURATION: 'externalLoggerConfiguration',
    METRIC_REPORTER_INTERVAL: 'metricReporterInterval',
    METRIC_REPORTER_KEEP_DATA_DAYS: 'metricReporterKeepDataDays',
    METRIC_REPORTER_ENABLED: 'metricReporterEnabled',
    PERSON_CUSTOM_OBJECT_CLASS_LIST: 'personCustomObjectClassList',
    HINTS: 'hints',

    // Static Configuration Fields
    AUTHENTICATOR_CERTS_FOLDER: 'authenticatorCertsFolder',
    MDS_CERTS_FOLDER: 'mdsCertsFolder',
    MDS_TOCS_FOLDER: 'mdsTocsFolder',
    UNFINISHED_REQUEST_EXPIRATION: 'unfinishedRequestExpiration',
    AUTHENTICATION_HISTORY_EXPIRATION: 'authenticationHistoryExpiration',
    SERVER_METADATA_FOLDER: 'serverMetadataFolder',
    USER_AUTO_ENROLLMENT: 'userAutoEnrollment',
    REQUESTED_CREDENTIAL_TYPES: 'requestedCredentialTypes',
    REQUESTED_PARTIES: 'requestedParties',
  } as const,

  LABELS: {
    // Dynamic Configuration Labels
    ISSUER: 'fields.issuer',
    BASE_ENDPOINT: 'fields.base_endpoint',
    CLEAN_SERVICE_INTERVAL: 'fields.clean_service_interval',
    CLEAN_SERVICE_BATCH_CHUNK: 'fields.clean_service_batch_chunk',
    USE_LOCAL_CACHE: 'fields.use_local_cache',
    DISABLE_JDK_LOGGER: 'fields.disable_jdk_logger',
    LOGGING_LEVEL: 'fields.logging_level',
    LOGGING_LAYOUT: 'fields.logging_layout',
    EXTERNAL_LOGGER_CONFIGURATION: 'fields.external_logger_configuration',
    METRIC_REPORTER_INTERVAL: 'fields.metric_reporter_interval',
    METRIC_REPORTER_KEEP_DATA_DAYS: 'fields.metric_reporter_keep_data_days',
    METRIC_REPORTER_ENABLED: 'fields.metric_reporter_enabled',
    PERSON_CUSTOM_OBJECT_CLASSES: 'fields.person_custom_object_classes',
    HINTS: 'Hints',

    // Static Configuration Labels
    AUTHENTICATOR_CERTIFICATES_FOLDER: 'fields.authenticator_certificates_folder',
    MDS_TOC_CERTIFICATES_FOLDER: 'fields.mds_toc_certificates_folder',
    MDS_TOC_FILES_FOLDER: 'fields.mds_toc_files_folder',
    UNFINISHED_REQUEST_EXPIRATION: 'fields.unfinished_request_expiration',
    AUTHENTICATION_HISTORY_EXPIRATION: 'fields.authentication_history_expiration',
    SERVER_METADATA_FOLDER: 'fields.server_metadata_folder',
    USER_AUTO_ENROLLMENT: 'fields.user_auto_enrollment',
    REQUESTED_CREDENTIAL_TYPES: 'fields.requested_credential_types',
    REQUESTED_PARTIES_ID: 'fields.requested_parties_id',
  } as const,

  VALIDATION_SCHEMAS: {
    STATIC_CONFIG: 'staticConfigValidationSchema',
    DYNAMIC_CONFIG: 'dynamicConfigValidationSchema',
  } as const,

  BINARY_VALUES: { TRUE: 'true', FALSE: 'false' } as const,

  EMPTY_DROPDOWN_MESSAGE: {
    ALL_AVAILABLE_HINTS_SELECTED: 'fields.allAvailableHintsSelected',
    NO_MATCHING_OPTIONS: 'fields.noMatchingOptions',
  } as const,
} as const
