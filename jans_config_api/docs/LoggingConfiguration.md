# JansConfigApi.LoggingConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**loggingLevel** | **String** | Logging level for Jans Authorization Server logger. | [optional] 
**loggingLayout** | **String** | Logging layout used for Jans Authorization Server loggers. | [optional] 
**httpLoggingEnabled** | **Boolean** | To enable http request/response logging. | [optional] 
**disableJdkLogger** | **Boolean** | To enable/disable Jdk logging. | [optional] 
**enabledOAuthAuditLogging** | **Boolean** | To enable/disable OAuth audit logging. | [optional] 
**externalLoggerConfiguration** | **String** | Path to external log4j2 configuration file. | [optional] 
**httpLoggingExludePaths** | **[String]** | List of paths to exclude from logger. | [optional] 



## Enum: LoggingLevelEnum


* `TRACE` (value: `"TRACE"`)

* `DEBUG` (value: `"DEBUG"`)

* `INFO` (value: `"INFO"`)

* `WARN` (value: `"WARN"`)

* `ERROR` (value: `"ERROR"`)

* `FATAL` (value: `"FATAL"`)

* `OFF` (value: `"OFF"`)





## Enum: LoggingLayoutEnum


* `text` (value: `"text"`)

* `json` (value: `"json"`)




