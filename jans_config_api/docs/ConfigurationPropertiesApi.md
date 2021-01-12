# JansConfigApi.ConfigurationPropertiesApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getProperties**](ConfigurationPropertiesApi.md#getProperties) | **GET** /jans-config-api/api/v1/jans-auth-server/config | Gets all Jans authorization server configuration properties.
[**patchProperties**](ConfigurationPropertiesApi.md#patchProperties) | **PATCH** /jans-config-api/api/v1/jans-auth-server/config | Partially modifies Jans authorization server Application configuration properties.



## getProperties

> AppConfiguration getProperties()

Gets all Jans authorization server configuration properties.

Gets all Jans authorization server configuration properties.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationPropertiesApi();
apiInstance.getProperties((error, data, response) => {
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

[**AppConfiguration**](AppConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchProperties

> AppConfiguration patchProperties(opts)

Partially modifies Jans authorization server Application configuration properties.

Partially modifies Jans authorization server AppConfiguration properties.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationPropertiesApi();
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchProperties(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **patchRequest** | [**[PatchRequest]**](PatchRequest.md)|  | [optional] 

### Return type

[**AppConfiguration**](AppConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json

