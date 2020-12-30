# JansConfigApi.ConfigurationJWKJSONWebKeyJWKApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfigJwks**](ConfigurationJWKJSONWebKeyJWKApi.md#getConfigJwks) | **GET** /jans-config-api/api/v1/config/jwks | Gets list of JSON Web Key (JWK) used by server.
[**patchConfigJwks**](ConfigurationJWKJSONWebKeyJWKApi.md#patchConfigJwks) | **PATCH** /jans-config-api/api/v1/config/jwks | Patch JWKS
[**putConfigJwks**](ConfigurationJWKJSONWebKeyJWKApi.md#putConfigJwks) | **PUT** /jans-config-api/api/v1/config/jwks | Puts/replaces JWKS



## getConfigJwks

> WebKeysConfiguration getConfigJwks()

Gets list of JSON Web Key (JWK) used by server.

Gets list of JSON Web Key (JWK) used by server. JWK is a JSON data structure that represents a set of public keys as a JSON object [RFC4627].

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationJWKJSONWebKeyJWKApi();
apiInstance.getConfigJwks((error, data, response) => {
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

[**WebKeysConfiguration**](WebKeysConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchConfigJwks

> WebKeysConfiguration patchConfigJwks(opts)

Patch JWKS

Patch JSON Web Keys (JWKS).

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationJWKJSONWebKeyJWKApi();
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchConfigJwks(opts, (error, data, response) => {
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

[**WebKeysConfiguration**](WebKeysConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## putConfigJwks

> WebKeysConfiguration putConfigJwks(opts)

Puts/replaces JWKS

Puts/replaces JSON Web Keys (JWKS).

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationJWKJSONWebKeyJWKApi();
let opts = {
  'webKeysConfiguration': new JansConfigApi.WebKeysConfiguration() // WebKeysConfiguration | 
};
apiInstance.putConfigJwks(opts, (error, data, response) => {
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
 **webKeysConfiguration** | [**WebKeysConfiguration**](WebKeysConfiguration.md)|  | [optional] 

### Return type

[**WebKeysConfiguration**](WebKeysConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

