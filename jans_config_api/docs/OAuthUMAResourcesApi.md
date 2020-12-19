# JansConfigApi.OAuthUMAResourcesApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteOauthUmaResourcesById**](OAuthUMAResourcesApi.md#deleteOauthUmaResourcesById) | **DELETE** /jans-config-api/api/v1/uma/resources/{id} | Deletes an UMA resource.
[**getOauthUmaResources**](OAuthUMAResourcesApi.md#getOauthUmaResources) | **GET** /jans-config-api/api/v1/uma/resources | Gets list of UMA resources.
[**getOauthUmaResourcesById**](OAuthUMAResourcesApi.md#getOauthUmaResourcesById) | **GET** /jans-config-api/api/v1/uma/resources/{id} | Gets an UMA resource by ID.
[**patchOauthUmaResourcesById**](OAuthUMAResourcesApi.md#patchOauthUmaResourcesById) | **PATCH** /jans-config-api/api/v1/uma/resources/{id} | Partially updates an UMA resource by Inum.
[**postOauthUmaResources**](OAuthUMAResourcesApi.md#postOauthUmaResources) | **POST** /jans-config-api/api/v1/uma/resources | Creates an UMA resource.
[**putOauthUmaResources**](OAuthUMAResourcesApi.md#putOauthUmaResources) | **PUT** /jans-config-api/api/v1/uma/resources | Updates an UMA resource.



## deleteOauthUmaResourcesById

> deleteOauthUmaResourcesById(id)

Deletes an UMA resource.

Deletes an UMA resource.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let id = "id_example"; // String | Resource description ID.
apiInstance.deleteOauthUmaResourcesById(id, (error, data, response) => {
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
 **id** | **String**| Resource description ID. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthUmaResources

> [UmaResource] getOauthUmaResources(opts)

Gets list of UMA resources.

Gets list of UMA resources.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let opts = {
  'limit': 50, // Number | Search size - max size of the results to return.
  'pattern': "pattern_example" // String | Search pattern.
};
apiInstance.getOauthUmaResources(opts, (error, data, response) => {
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
 **limit** | **Number**| Search size - max size of the results to return. | [optional] [default to 50]
 **pattern** | **String**| Search pattern. | [optional] 

### Return type

[**[UmaResource]**](UmaResource.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthUmaResourcesById

> UmaResource getOauthUmaResourcesById(id)

Gets an UMA resource by ID.

Gets an UMA resource by ID.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let id = "id_example"; // String | Resource description ID.
apiInstance.getOauthUmaResourcesById(id, (error, data, response) => {
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
 **id** | **String**| Resource description ID. | 

### Return type

[**UmaResource**](UmaResource.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchOauthUmaResourcesById

> UmaResource patchOauthUmaResourcesById(id, opts)

Partially updates an UMA resource by Inum.

Partially updates an UMA resource by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let id = "id_example"; // String | Resource description ID.
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchOauthUmaResourcesById(id, opts, (error, data, response) => {
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
 **id** | **String**| Resource description ID. | 
 **patchRequest** | [**[PatchRequest]**](PatchRequest.md)|  | [optional] 

### Return type

[**UmaResource**](UmaResource.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## postOauthUmaResources

> UmaResource postOauthUmaResources(opts)

Creates an UMA resource.

Creates an UMA resource.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let opts = {
  'umaResource': new JansConfigApi.UmaResource() // UmaResource | 
};
apiInstance.postOauthUmaResources(opts, (error, data, response) => {
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
 **umaResource** | [**UmaResource**](UmaResource.md)|  | [optional] 

### Return type

[**UmaResource**](UmaResource.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putOauthUmaResources

> UmaResource putOauthUmaResources(opts)

Updates an UMA resource.

Updates an UMA resource.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthUMAResourcesApi();
let opts = {
  'umaResource': new JansConfigApi.UmaResource() // UmaResource | 
};
apiInstance.putOauthUmaResources(opts, (error, data, response) => {
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
 **umaResource** | [**UmaResource**](UmaResource.md)|  | [optional] 

### Return type

[**UmaResource**](UmaResource.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

