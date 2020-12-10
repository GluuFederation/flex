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
  'patchRequest': new JansConfigApi.PatchRequest() // PatchRequest | 
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
 **patchRequest** | [**PatchRequest**](PatchRequest.md)|  | [optional] 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postAttributes

> GluuAttribute postAttributes(name, displayName, dataType, status, opts)

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
let name = "name_example"; // String | Name of the attribute.
let displayName = "displayName_example"; // [String] | 
let dataType = "dataType_example"; // String | Data Type of attribute.
let status = "status_example"; // String | Distinguished Name
let opts = {
  'description': "description_example", // String | User friendly descriptive detail of attribute.
  'jansMultivaluedAttr': true, // Boolean | Boolean value indicating if the attribute is multi-value
  'lifetime': "lifetime_example", // String | 
  'sourceAttribute': "sourceAttribute_example", // String | 
  'salt': "salt_example", // String | 
  'nameIdType': "nameIdType_example", // String | 
  'origin': "origin_example", // String | 
  'editType': "editType_example", // [String] | GluuUserRole
  'viewType': "viewType_example", // [String] | GluuUserRole
  'usageType': "usageType_example", // [String] | GluuAttributeUsageType
  'jansAttrName': "jansAttrName_example", // String | 
  'seeAlso': "seeAlso_example", // String | 
  'saml1Uri': "saml1Uri_example", // String | 
  'saml2Uri': "saml2Uri_example", // String | 
  'urn': "urn_example", // String | 
  'jansSCIMCustomAttr': true, // Boolean | Boolean value indicating if the attribute is a SCIM custom attribute
  'custom': true, // Boolean | Boolean value indicating if the attribute is a custom attribute
  'requred': true, // Boolean | Boolean value indicating is a mandatory attribute
  'attributeValidation': new JansConfigApi.GluuAttributeAttributeValidation(), // GluuAttributeAttributeValidation | 
  'gluuTooltip': "gluuTooltip_example" // String | 
};
apiInstance.postAttributes(name, displayName, dataType, status, opts, (error, data, response) => {
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
 **name** | **String**| Name of the attribute. | 
 **displayName** | [**[String]**](String.md)|  | 
 **dataType** | **String**| Data Type of attribute. | 
 **status** | **String**| Distinguished Name | 
 **description** | **String**| User friendly descriptive detail of attribute. | [optional] 
 **jansMultivaluedAttr** | **Boolean**| Boolean value indicating if the attribute is multi-value | [optional] 
 **lifetime** | **String**|  | [optional] 
 **sourceAttribute** | **String**|  | [optional] 
 **salt** | **String**|  | [optional] 
 **nameIdType** | **String**|  | [optional] 
 **origin** | **String**|  | [optional] 
 **editType** | [**[String]**](String.md)| GluuUserRole | [optional] 
 **viewType** | [**[String]**](String.md)| GluuUserRole | [optional] 
 **usageType** | [**[String]**](String.md)| GluuAttributeUsageType | [optional] 
 **jansAttrName** | **String**|  | [optional] 
 **seeAlso** | **String**|  | [optional] 
 **saml1Uri** | **String**|  | [optional] 
 **saml2Uri** | **String**|  | [optional] 
 **urn** | **String**|  | [optional] 
 **jansSCIMCustomAttr** | **Boolean**| Boolean value indicating if the attribute is a SCIM custom attribute | [optional] 
 **custom** | **Boolean**| Boolean value indicating if the attribute is a custom attribute | [optional] 
 **requred** | **Boolean**| Boolean value indicating is a mandatory attribute | [optional] 
 **attributeValidation** | [**GluuAttributeAttributeValidation**](GluuAttributeAttributeValidation.md)|  | [optional] 
 **gluuTooltip** | **String**|  | [optional] 

### Return type

[**GluuAttribute**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded
- **Accept**: application/json


## putAttributes

> [GluuAttribute] putAttributes(gluuAttribute)

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

[**[GluuAttribute]**](GluuAttribute.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

