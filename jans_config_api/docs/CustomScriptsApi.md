# JansConfigApi.CustomScriptsApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteConfigScriptsByInum**](CustomScriptsApi.md#deleteConfigScriptsByInum) | **DELETE** /jans-config-api/api/v1/config/scripts/{inum} | Deletes a custom script.
[**getConfigScripts**](CustomScriptsApi.md#getConfigScripts) | **GET** /jans-config-api/api/v1/config/scripts | Gets a list of custom scripts.
[**getConfigScriptsByInum**](CustomScriptsApi.md#getConfigScriptsByInum) | **GET** /jans-config-api/api/v1/config/scripts/inum/{inum} | Gets a script by Inum.
[**getConfigScriptsByType**](CustomScriptsApi.md#getConfigScriptsByType) | **GET** /jans-config-api/api/v1/config/scripts/type/{type} | Gets list of scripts by type.
[**postConfigScripts**](CustomScriptsApi.md#postConfigScripts) | **POST** /jans-config-api/api/v1/config/scripts | Adds a new custom script.
[**putConfigScripts**](CustomScriptsApi.md#putConfigScripts) | **PUT** /jans-config-api/api/v1/config/scripts | Updates a custom script.



## deleteConfigScriptsByInum

> deleteConfigScriptsByInum(inum)

Deletes a custom script.

Deletes a custom script.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
let inum = "inum_example"; // String | Script identifier.
apiInstance.deleteConfigScriptsByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Script identifier. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## getConfigScripts

> [CustomScript] getConfigScripts()

Gets a list of custom scripts.

Gets a list of custom scripts.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
apiInstance.getConfigScripts((error, data, response) => {
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

[**[CustomScript]**](CustomScript.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigScriptsByInum

> CustomScript getConfigScriptsByInum(inum)

Gets a script by Inum.

Gets a script by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
let inum = "inum_example"; // String | Script identifier.
apiInstance.getConfigScriptsByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Script identifier. | 

### Return type

[**CustomScript**](CustomScript.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigScriptsByType

> [CustomScript] getConfigScriptsByType(type, opts)

Gets list of scripts by type.

Gets list of scripts by type.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
let type = "type_example"; // String | Script type.
let opts = {
  'pattern': "pattern_example", // String | Search pattern.
  'limit': 50 // Number | Search size - max size of the results to return.
};
apiInstance.getConfigScriptsByType(type, opts, (error, data, response) => {
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
 **type** | **String**| Script type. | 
 **pattern** | **String**| Search pattern. | [optional] 
 **limit** | **Number**| Search size - max size of the results to return. | [optional] [default to 50]

### Return type

[**[CustomScript]**](CustomScript.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## postConfigScripts

> CustomScript postConfigScripts(opts)

Adds a new custom script.

Adds a new custom script.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
let opts = {
  'customScript': new JansConfigApi.CustomScript() // CustomScript | 
};
apiInstance.postConfigScripts(opts, (error, data, response) => {
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
 **customScript** | [**CustomScript**](CustomScript.md)|  | [optional] 

### Return type

[**CustomScript**](CustomScript.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putConfigScripts

> CustomScript putConfigScripts(opts)

Updates a custom script.

Updates a custom script.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.CustomScriptsApi();
let opts = {
  'customScript': new JansConfigApi.CustomScript() // CustomScript | 
};
apiInstance.putConfigScripts(opts, (error, data, response) => {
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
 **customScript** | [**CustomScript**](CustomScript.md)|  | [optional] 

### Return type

[**CustomScript**](CustomScript.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

