# JansConfigApi.JansFido2DynConfiguration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**issuer** | **String** | URL using the https scheme for Issuer identifier. | [optional] 
**baseEndpoint** | **String** | The base URL for Fido2 endpoints. | [optional] 
**cleanServiceInterval** | **Number** | Time interval for the Clean Service in seconds. | [optional] 
**cleanServiceBatchChunkSize** | **Number** | Each clean up iteration fetches chunk of expired data per base dn and removes it from storage. | [optional] 
**useLocalCache** | **Boolean** | Boolean value to indicate if Local Cache is to be used. | [optional] 
**disableJdkLogger** | **Boolean** | Boolean value specifying whether to enable JDK Loggers. | [optional] 
**loggingLevel** | **String** | Logging level for Fido2 logger. | [optional] 
**loggingLayout** | **String** | Logging layout used for Fido2. | [optional] 
**externalLoggerConfiguration** | **String** | Path to external Fido2 logging configuration. | [optional] 
**metricReporterInterval** | **Number** | The interval for metric reporter in seconds. | [optional] 
**metricReporterKeepDataDays** | **Number** | The days to keep report data. | [optional] 
**metricReporterEnabled** | **Boolean** | Boolean value specifying whether to enable Metric Reporter. | [optional] 
**personCustomObjectClassList** | **[String]** | Custom object class list for dynamic person enrolment. | [optional] 
**fido2Configuration** | [**Fido2Configuration**](Fido2Configuration.md) |  | [optional] 


