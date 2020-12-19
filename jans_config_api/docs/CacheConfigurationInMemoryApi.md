# JansConfigApi.CacheConfigurationInMemoryApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigCacheInMemory**](CacheConfigurationInMemoryApi.md#getConfigCacheInMemory) | **GET** /jans-config-api/api/v1/config/cache/in-memory | Returns in-Memory cache configuration.
[**putConfigCacheInMemory**](CacheConfigurationInMemoryApi.md#putConfigCacheInMemory) | **PUT** /jans-config-api/api/v1/config/cache/in-memory | Updates in-Memory cache configuration.



## getConfigCacheInMemory

> InlineResponse2001InMemoryConfiguration getConfigCacheInMemory()

Returns in-Memory cache configuration.

Returns in-Memory cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationInMemoryApi();
apiInstance.getConfigCacheInMemory((error, data, response) => {
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

[**InlineResponse2001InMemoryConfiguration**](InlineResponse2001InMemoryConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## putConfigCacheInMemory

> InlineResponse2001InMemoryConfiguration putConfigCacheInMemory(opts)

Updates in-Memory cache configuration.

Updates in-Memory cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationInMemoryApi();
let opts = {
  'inlineObject2': new JansConfigApi.InlineObject2() // InlineObject2 | 
};
apiInstance.putConfigCacheInMemory(opts, (error, data, response) => {
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
 **inlineObject2** | [**InlineObject2**](InlineObject2.md)|  | [optional] 

### Return type

[**InlineResponse2001InMemoryConfiguration**](InlineResponse2001InMemoryConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

