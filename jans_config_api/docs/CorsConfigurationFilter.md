# JansConfigApi.CorsConfigurationFilter

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**filterName** | **String** | Filter name. | [optional] 
**corsEnabled** | **Boolean** | Boolean value indicating if the filter is enabled. | [optional] 
**corsAllowedOrigins** | **String** | A list of origins that are allowed to access the resource. A * can be specified to enable access to resource from any origin. Otherwise, a whitelist of comma separated origins can be provided. | [optional] 
**corsAllowedMethods** | **String** | A comma separated list of HTTP methods that can be used to access the resource, using cross-origin requests. These are the methods which will also be included as part of Access-Control-Allow-Methods header in pre-flight response. | [optional] 
**corsAllowedHeaders** | **String** | The names of the supported author request headers. | [optional] 
**corsExposedHeaders** | **String** | A comma separated list of request headers that can be used when making an actual request. These headers will also be returned as part of Access-Control-Allow-Headers header in a pre-flight response. | [optional] 
**corsSupportCredentials** | **Boolean** | A flag that indicates whether the resource supports user credentials. This flag is exposed as part of Access-Control-Allow-Credentials header in a pre-flight response. It helps browser determine whether or not an actual request can be made using credentials. | [optional] 
**corsLoggingEnabled** | **Boolean** | Value to enable logging, Setting the value to False will disable logging. | [optional] 
**corsPreflightMaxAge** | **Number** | The duration in seconds the browser is allowed to cache the result of the pre-flight request. | [optional] 
**corsRequestDecorate** | **Boolean** | A flag to control if CORS specific attributes should be added to the HttpServletRequest object. | [optional] 


