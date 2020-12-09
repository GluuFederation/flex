# JansConfigApi.DatabaseCouchbaseConfigurationApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteConfigDatabaseCouchbaseByName**](DatabaseCouchbaseConfigurationApi.md#deleteConfigDatabaseCouchbaseByName) | **DELETE** /api/v1/config/database/couchbase/{name} | Deletes a Couchbase configurations by name.
[**getConfigDatabaseCouchbase**](DatabaseCouchbaseConfigurationApi.md#getConfigDatabaseCouchbase) | **GET** /api/v1/config/database/couchbase | Gets list of existing Couchbase configurations.
[**getConfigDatabaseCouchbaseByName**](DatabaseCouchbaseConfigurationApi.md#getConfigDatabaseCouchbaseByName) | **GET** /api/v1/config/database/couchbase/{name} | Gets a Couchbase configurations by name.
[**patchConfigDatabaseCouchbaseByName**](DatabaseCouchbaseConfigurationApi.md#patchConfigDatabaseCouchbaseByName) | **PATCH** /api/v1/config/database/couchbase/{name} | Partially modify an Couchbase configuration.
[**postConfigDatabaseCouchbase**](DatabaseCouchbaseConfigurationApi.md#postConfigDatabaseCouchbase) | **POST** /api/v1/config/database/couchbase | Adds a new Couchbase configuration.
[**postConfigDatabaseCouchbaseTest**](DatabaseCouchbaseConfigurationApi.md#postConfigDatabaseCouchbaseTest) | **POST** /api/v1/config/database/couchbase/test | Tests a Couchbase configurations by name.
[**putConfigDatabaseCouchbase**](DatabaseCouchbaseConfigurationApi.md#putConfigDatabaseCouchbase) | **PUT** /api/v1/config/database/couchbase | Updates Couchbase configuration.



## deleteConfigDatabaseCouchbaseByName

> deleteConfigDatabaseCouchbaseByName(name)

Deletes a Couchbase configurations by name.

Deletes a Couchbase configurations by name.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let name = "name_example"; // String | Name of Couchbase configuration.
apiInstance.deleteConfigDatabaseCouchbaseByName(name, (error, data, response) => {
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
 **name** | **String**| Name of Couchbase configuration. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigDatabaseCouchbase

> [CouchbaseConfiguration] getConfigDatabaseCouchbase()

Gets list of existing Couchbase configurations.

Gets list of existing Couchbase configurations.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
apiInstance.getConfigDatabaseCouchbase((error, data, response) => {
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

[**[CouchbaseConfiguration]**](CouchbaseConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigDatabaseCouchbaseByName

> CouchbaseConfiguration getConfigDatabaseCouchbaseByName(name)

Gets a Couchbase configurations by name.

Gets a Couchbase configurations by name.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let name = "name_example"; // String | Name of Couchbase configuration.
apiInstance.getConfigDatabaseCouchbaseByName(name, (error, data, response) => {
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
 **name** | **String**| Name of Couchbase configuration. | 

### Return type

[**CouchbaseConfiguration**](CouchbaseConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchConfigDatabaseCouchbaseByName

> CouchbaseConfiguration patchConfigDatabaseCouchbaseByName(name, opts)

Partially modify an Couchbase configuration.

Partially modify an Couchbase configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let name = "name_example"; // String | Name of Couchbase configuration.
let opts = {
  'patchRequest': new JansConfigApi.PatchRequest() // PatchRequest | 
};
apiInstance.patchConfigDatabaseCouchbaseByName(name, opts, (error, data, response) => {
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
 **name** | **String**| Name of Couchbase configuration. | 
 **patchRequest** | [**PatchRequest**](PatchRequest.md)|  | [optional] 

### Return type

[**CouchbaseConfiguration**](CouchbaseConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postConfigDatabaseCouchbase

> CouchbaseConfiguration postConfigDatabaseCouchbase(couchbaseConfiguration)

Adds a new Couchbase configuration.

Adds a new Couchbase configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let couchbaseConfiguration = new JansConfigApi.CouchbaseConfiguration(); // CouchbaseConfiguration | 
apiInstance.postConfigDatabaseCouchbase(couchbaseConfiguration, (error, data, response) => {
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
 **couchbaseConfiguration** | [**CouchbaseConfiguration**](CouchbaseConfiguration.md)|  | 

### Return type

[**CouchbaseConfiguration**](CouchbaseConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postConfigDatabaseCouchbaseTest

> Boolean postConfigDatabaseCouchbaseTest(couchbaseConfiguration)

Tests a Couchbase configurations by name.

Tests a Couchbase configurations by name.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let couchbaseConfiguration = new JansConfigApi.CouchbaseConfiguration(); // CouchbaseConfiguration | 
apiInstance.postConfigDatabaseCouchbaseTest(couchbaseConfiguration, (error, data, response) => {
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
 **couchbaseConfiguration** | [**CouchbaseConfiguration**](CouchbaseConfiguration.md)|  | 

### Return type

**Boolean**

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putConfigDatabaseCouchbase

> CouchbaseConfiguration putConfigDatabaseCouchbase(couchbaseConfiguration)

Updates Couchbase configuration.

Updates Couchbase configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseCouchbaseConfigurationApi();
let couchbaseConfiguration = new JansConfigApi.CouchbaseConfiguration(); // CouchbaseConfiguration | 
apiInstance.putConfigDatabaseCouchbase(couchbaseConfiguration, (error, data, response) => {
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
 **couchbaseConfiguration** | [**CouchbaseConfiguration**](CouchbaseConfiguration.md)|  | 

### Return type

[**CouchbaseConfiguration**](CouchbaseConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

