# JansConfigApi.CacheConfigurationNativePersistenceApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigCacheNativePersistence**](CacheConfigurationNativePersistenceApi.md#getConfigCacheNativePersistence) | **GET** /jans-config-api/api/v1/config/cache/native-persistence | Returns native persistence cache configuration.
[**patchConfigCacheNativePersistence**](CacheConfigurationNativePersistenceApi.md#patchConfigCacheNativePersistence) | **PATCH** /jans-config-api/api/v1/config/cache/native-persistence | Partially modifies Native Persistence cache configuration.
[**putConfigCacheNativePersistence**](CacheConfigurationNativePersistenceApi.md#putConfigCacheNativePersistence) | **PUT** /jans-config-api/api/v1/config/cache/native-persistence | Updates native persistence cache configuration.



## getConfigCacheNativePersistence

> NativePersistenceConfiguration getConfigCacheNativePersistence()

Returns native persistence cache configuration.

Returns native persistence cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationNativePersistenceApi();
apiInstance.getConfigCacheNativePersistence((error, data, response) => {
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

[**NativePersistenceConfiguration**](NativePersistenceConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchConfigCacheNativePersistence

> NativePersistenceConfiguration patchConfigCacheNativePersistence(opts)

Partially modifies Native Persistence cache configuration.

Partially modifies Native Persistence cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationNativePersistenceApi();
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchConfigCacheNativePersistence(opts, (error, data, response) => {
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

[**NativePersistenceConfiguration**](NativePersistenceConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## putConfigCacheNativePersistence

> NativePersistenceConfiguration putConfigCacheNativePersistence(opts)

Updates native persistence cache configuration.

Updates native persistence cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationNativePersistenceApi();
let opts = {
  'nativePersistenceConfiguration': new JansConfigApi.NativePersistenceConfiguration() // NativePersistenceConfiguration | 
};
apiInstance.putConfigCacheNativePersistence(opts, (error, data, response) => {
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
 **nativePersistenceConfiguration** | [**NativePersistenceConfiguration**](NativePersistenceConfiguration.md)|  | [optional] 

### Return type

[**NativePersistenceConfiguration**](NativePersistenceConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

