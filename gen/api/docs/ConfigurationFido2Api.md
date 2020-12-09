# JansConfigApi.ConfigurationFido2Api

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPropertiesFido2**](ConfigurationFido2Api.md#getPropertiesFido2) | **GET** /api/v1/fido2/config | Gets Jans Authorization Server Fido2 configuration properties.
[**putPropertiesFido2**](ConfigurationFido2Api.md#putPropertiesFido2) | **PUT** /api/v1/fido2/config | Updates Fido2 configuration properties.



## getPropertiesFido2

> [InlineResponse200] getPropertiesFido2()

Gets Jans Authorization Server Fido2 configuration properties.

Gets Jans Authorization Server Fido2 configuration properties.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationFido2Api();
apiInstance.getPropertiesFido2((error, data, response) => {
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

[**[InlineResponse200]**](InlineResponse200.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## putPropertiesFido2

> putPropertiesFido2(opts)

Updates Fido2 configuration properties.

Updates Fido2 configuration properties.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationFido2Api();
let opts = {
  'inlineResponse200': [new JansConfigApi.InlineResponse200()] // [InlineResponse200] | 
};
apiInstance.putPropertiesFido2(opts, (error, data, response) => {
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
 **inlineResponse200** | [**[InlineResponse200]**](InlineResponse200.md)|  | [optional] 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

