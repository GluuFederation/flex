# JansConfigApi.ConfigurationLoggingApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigLogging**](ConfigurationLoggingApi.md#getConfigLogging) | **GET** /jans-config-api/api/v1/logging | Returns Jans Authorization Server logging settings.
[**putConfigLogging**](ConfigurationLoggingApi.md#putConfigLogging) | **PUT** /jans-config-api/api/v1/logging | Updates Jans Authorization Server logging settings.



## getConfigLogging

> [InlineResponse2005] getConfigLogging()

Returns Jans Authorization Server logging settings.

Returns Jans Authorization Server logging settings.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationLoggingApi();
apiInstance.getConfigLogging((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[InlineResponse2005]**](InlineResponse2005.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## putConfigLogging

> putConfigLogging(opts)

Updates Jans Authorization Server logging settings.

Updates Jans Authorization Server logging settings.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationLoggingApi();
let opts = {
  'inlineResponse2005': [new JansConfigApi.InlineResponse2005()] // [InlineResponse2005] | 
};
apiInstance.putConfigLogging(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inlineResponse2005** | [**[InlineResponse2005]**](InlineResponse2005.md)|  | [optional] 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

