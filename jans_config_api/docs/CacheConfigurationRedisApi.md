# JansConfigApi.CacheConfigurationRedisApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigCacheRedis**](CacheConfigurationRedisApi.md#getConfigCacheRedis) | **GET** /jans-config-api/api/v1/config/cache/redis | Returns Redis cache configuration.
[**patchConfigCacheRedis**](CacheConfigurationRedisApi.md#patchConfigCacheRedis) | **PATCH** /jans-config-api/api/v1/config/cache/redis | Partially modifies Redis cache configuration.
[**putConfigCacheRedis**](CacheConfigurationRedisApi.md#putConfigCacheRedis) | **PUT** /jans-config-api/api/v1/config/cache/redis | Updates Redis cache configuration.



## getConfigCacheRedis

> RedisConfiguration getConfigCacheRedis()

Returns Redis cache configuration.

Returns Redis cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationRedisApi();
apiInstance.getConfigCacheRedis((error, data, response) => {
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

[**RedisConfiguration**](RedisConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchConfigCacheRedis

> RedisConfiguration patchConfigCacheRedis(opts)

Partially modifies Redis cache configuration.

Partially modifies Redis cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationRedisApi();
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchConfigCacheRedis(opts, (error, data, response) => {
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

[**RedisConfiguration**](RedisConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## putConfigCacheRedis

> RedisConfiguration putConfigCacheRedis(opts)

Updates Redis cache configuration.

Updates Redis cache configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CacheConfigurationRedisApi();
let opts = {
  'redisConfiguration': new JansConfigApi.RedisConfiguration() // RedisConfiguration | 
};
apiInstance.putConfigCacheRedis(opts, (error, data, response) => {
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
 **redisConfiguration** | [**RedisConfiguration**](RedisConfiguration.md)|  | [optional] 

### Return type

[**RedisConfiguration**](RedisConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

