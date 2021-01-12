# JansConfigApi.OAuthScopesApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteOauthScopesByInum**](OAuthScopesApi.md#deleteOauthScopesByInum) | **DELETE** /jans-config-api/api/v1/scopes/{inum} | Delete Scope.
[**getOauthScopes**](OAuthScopesApi.md#getOauthScopes) | **GET** /jans-config-api/api/v1/scopes | Gets list of Scopes.
[**getOauthScopesByInum**](OAuthScopesApi.md#getOauthScopesByInum) | **GET** /jans-config-api/api/v1/scopes/{inum} | Get Scope by Inum
[**patchOauthScopesById**](OAuthScopesApi.md#patchOauthScopesById) | **PATCH** /jans-config-api/api/v1/scopes/{inum} | Update modified attributes of existing Scope by Inum.
[**postOauthScopes**](OAuthScopesApi.md#postOauthScopes) | **POST** /jans-config-api/api/v1/scopes | Create Scope.
[**putOauthScopes**](OAuthScopesApi.md#putOauthScopes) | **PUT** /jans-config-api/api/v1/scopes | Updates existing Scope.



## deleteOauthScopesByInum

> deleteOauthScopesByInum(inum)

Delete Scope.

Delete Scope.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let inum = "inum_example"; // String | 
apiInstance.deleteOauthScopesByInum(inum, (error, data, response) => {
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
 **inum** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthScopes

> [Scope] getOauthScopes(opts)

Gets list of Scopes.

Gets list of Scopes. Optionally type to filter the scope, max-size of the result and pattern can be provided.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let opts = {
  'type': "type_example", // String | Scope type.
  'limit': 50, // Number | Search size - max size of the results to return.
  'pattern': "pattern_example" // String | Search pattern.
};
apiInstance.getOauthScopes(opts, (error, data, response) => {
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
 **type** | **String**| Scope type. | [optional] 
 **limit** | **Number**| Search size - max size of the results to return. | [optional] [default to 50]
 **pattern** | **String**| Search pattern. | [optional] 

### Return type

[**[Scope]**](Scope.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthScopesByInum

> Scope getOauthScopesByInum(inum)

Get Scope by Inum

Get Scope by Inum

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let inum = "inum_example"; // String | 
apiInstance.getOauthScopesByInum(inum, (error, data, response) => {
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
 **inum** | **String**|  | 

### Return type

[**Scope**](Scope.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchOauthScopesById

> Scope patchOauthScopesById(inum, opts)

Update modified attributes of existing Scope by Inum.

Update modified attributes of existing Scope by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let inum = "inum_example"; // String | 
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchOauthScopesById(inum, opts, (error, data, response) => {
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
 **inum** | **String**|  | 
 **patchRequest** | [**[PatchRequest]**](PatchRequest.md)|  | [optional] 

### Return type

[**Scope**](Scope.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## postOauthScopes

> Scope postOauthScopes(opts)

Create Scope.

Create Scope.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let opts = {
  'scope': new JansConfigApi.Scope() // Scope | 
};
apiInstance.postOauthScopes(opts, (error, data, response) => {
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
 **scope** | [**Scope**](Scope.md)|  | [optional] 

### Return type

[**Scope**](Scope.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putOauthScopes

> Scope putOauthScopes(opts)

Updates existing Scope.

Updates existing Scope.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthScopesApi();
let opts = {
  'scope': new JansConfigApi.Scope() // Scope | 
};
apiInstance.putOauthScopes(opts, (error, data, response) => {
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
 **scope** | [**Scope**](Scope.md)|  | [optional] 

### Return type

[**Scope**](Scope.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

