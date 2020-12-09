# JansConfigApi.CacheConfigurationRedisApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigCacheRedis**](CacheConfigurationRedisApi.md#getConfigCacheRedis) | **GET** /api/v1/config/cache/redis | Returns Redis cache configuration.
[**putConfigCacheRedis**](CacheConfigurationRedisApi.md#putConfigCacheRedis) | **PUT** /api/v1/config/cache/redis | Updates Redis cache configuration.



## getConfigCacheRedis

> InlineResponse2001RedisConfiguration getConfigCacheRedis()

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

[**InlineResponse2001RedisConfiguration**](InlineResponse2001RedisConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## putConfigCacheRedis

> InlineResponse2001RedisConfiguration putConfigCacheRedis(opts)

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
  'inlineObject1': new JansConfigApi.InlineObject1() // InlineObject1 | 
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
 **inlineObject1** | [**InlineObject1**](InlineObject1.md)|  | [optional] 

### Return type

[**InlineResponse2001RedisConfiguration**](InlineResponse2001RedisConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

