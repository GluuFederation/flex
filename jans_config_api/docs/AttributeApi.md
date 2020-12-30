# JansConfigApi.AttributeApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteAttributesByInum**](AttributeApi.md#deleteAttributesByInum) | **DELETE** /jans-config-api/api/v1/attributes/{inum} | Deletes an attribute based on inum.
[**getAttributes**](AttributeApi.md#getAttributes) | **GET** /jans-config-api/api/v1/attributes | Gets a list of Gluu attributes.
[**getAttributesByInum**](AttributeApi.md#getAttributesByInum) | **GET** /jans-config-api/api/v1/attributes/{inum} | Gets an attribute based on inum.
[**patchAttributesByInum**](AttributeApi.md#patchAttributesByInum) | **PATCH** /jans-config-api/api/v1/attributes/{inum} | Partially modify a GluuAttribute.
[**postAttributes**](AttributeApi.md#postAttributes) | **POST** /jans-config-api/api/v1/attributes | Adds a new attribute.
[**putAttributes**](AttributeApi.md#putAttributes) | **PUT** /jans-config-api/api/v1/attributes | Updates an existing attribute.



## deleteAttributesByInum

> deleteAttributesByInum(inum)

Deletes an attribute based on inum.

Deletes an attribute based on inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let inum = "inum_example"; // String | Attribute ID.
apiInstance.deleteAttributesByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Attribute ID. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAttributes

> [GluuAttribute] getAttributes(opts)

Gets a list of Gluu attributes.

Gets all attributes. Optionally max-size of the result, attribute status and pattern can be provided.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let opts = {
  'limit': 50, // Number | Search size - max size of the results to return.
  'pattern': "pattern_example", // String | Search pattern.
  'status': "'all'" // String | Status of the attribute
};
apiInstance.getAttributes(opts, (error, data, response) => {
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
 **status** | **String**| Status of the attribute | [optional] [default to &#39;all&#39;]

### Return type

[**[GluuAttribute]**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAttributesByInum

> GluuAttribute getAttributesByInum(inum)

Gets an attribute based on inum.

Gets an attribute based on inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let inum = "inum_example"; // String | Attribute ID.
apiInstance.getAttributesByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Attribute ID. | 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchAttributesByInum

> GluuAttribute patchAttributesByInum(inum, opts)

Partially modify a GluuAttribute.

Partially modify a GluuAttribute.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let inum = "inum_example"; // String | Attribute ID.
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchAttributesByInum(inum, opts, (error, data, response) => {
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
 **inum** | **String**| Attribute ID. | 
 **patchRequest** | [**[PatchRequest]**](PatchRequest.md)|  | [optional] 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## postAttributes

> GluuAttribute postAttributes(gluuAttribute)

Adds a new attribute.

Adds a new attribute.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let gluuAttribute = new JansConfigApi.GluuAttribute(); // GluuAttribute | 
apiInstance.postAttributes(gluuAttribute, (error, data, response) => {
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
 **gluuAttribute** | [**GluuAttribute**](GluuAttribute.md)|  | 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putAttributes

> GluuAttribute putAttributes(gluuAttribute)

Updates an existing attribute.

Updates an existing attribute.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.AttributeApi();
let gluuAttribute = new JansConfigApi.GluuAttribute(); // GluuAttribute | 
apiInstance.putAttributes(gluuAttribute, (error, data, response) => {
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
 **gluuAttribute** | [**GluuAttribute**](GluuAttribute.md)|  | 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

