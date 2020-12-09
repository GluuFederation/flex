# JansConfigApi.DatabaseLDAPConfigurationApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteConfigDatabaseLdapByName**](DatabaseLDAPConfigurationApi.md#deleteConfigDatabaseLdapByName) | **DELETE** /api/v1/config/database/ldap/{name} | Deletes an LDAP configuration.
[**getConfigDatabaseLdap**](DatabaseLDAPConfigurationApi.md#getConfigDatabaseLdap) | **GET** /api/v1/config/database/ldap | Gets list of existing LDAP configurations.
[**getConfigDatabaseLdapByName**](DatabaseLDAPConfigurationApi.md#getConfigDatabaseLdapByName) | **GET** /api/v1/config/database/ldap/{name} | Gets an LDAP configuration by name.
[**patchConfigDatabaseLdapByName**](DatabaseLDAPConfigurationApi.md#patchConfigDatabaseLdapByName) | **PATCH** /api/v1/config/database/ldap/{name} | Partially modify an LDAP configuration.
[**postConfigDatabaseLdap**](DatabaseLDAPConfigurationApi.md#postConfigDatabaseLdap) | **POST** /api/v1/config/database/ldap | Adds a new LDAP configuration.
[**postConfigDatabaseLdapTest**](DatabaseLDAPConfigurationApi.md#postConfigDatabaseLdapTest) | **POST** /api/v1/config/database/ldap/test | Tests a LDAP configurations by name.
[**putConfigDatabaseLdap**](DatabaseLDAPConfigurationApi.md#putConfigDatabaseLdap) | **PUT** /api/v1/config/database/ldap | Updates LDAP configuration.



## deleteConfigDatabaseLdapByName

> deleteConfigDatabaseLdapByName(name)

Deletes an LDAP configuration.

Deletes an LDAP configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let name = "name_example"; // String | Name of LDAP configuration.
apiInstance.deleteConfigDatabaseLdapByName(name, (error, data, response) => {
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
 **name** | **String**| Name of LDAP configuration. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigDatabaseLdap

> [LdapConfiguration] getConfigDatabaseLdap()

Gets list of existing LDAP configurations.

Gets list of existing LDAP configurations.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
apiInstance.getConfigDatabaseLdap((error, data, response) => {
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

[**[LdapConfiguration]**](LdapConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigDatabaseLdapByName

> LdapConfiguration getConfigDatabaseLdapByName(name)

Gets an LDAP configuration by name.

Gets an LDAP configuration by name.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let name = "name_example"; // String | Name of LDAP configuration.
apiInstance.getConfigDatabaseLdapByName(name, (error, data, response) => {
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
 **name** | **String**| Name of LDAP configuration. | 

### Return type

[**LdapConfiguration**](LdapConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchConfigDatabaseLdapByName

> LdapConfiguration patchConfigDatabaseLdapByName(name, opts)

Partially modify an LDAP configuration.

Partially modify an LDAP configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let name = "name_example"; // String | Name of LDAP configuration.
let opts = {
  'patchRequest': new JansConfigApi.PatchRequest() // PatchRequest | 
};
apiInstance.patchConfigDatabaseLdapByName(name, opts, (error, data, response) => {
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
 **name** | **String**| Name of LDAP configuration. | 
 **patchRequest** | [**PatchRequest**](PatchRequest.md)|  | [optional] 

### Return type

[**LdapConfiguration**](LdapConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postConfigDatabaseLdap

> LdapConfiguration postConfigDatabaseLdap(ldapConfiguration)

Adds a new LDAP configuration.

Adds a new LDAP configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let ldapConfiguration = new JansConfigApi.LdapConfiguration(); // LdapConfiguration | 
apiInstance.postConfigDatabaseLdap(ldapConfiguration, (error, data, response) => {
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
 **ldapConfiguration** | [**LdapConfiguration**](LdapConfiguration.md)|  | 

### Return type

[**LdapConfiguration**](LdapConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postConfigDatabaseLdapTest

> Boolean postConfigDatabaseLdapTest(ldapConfiguration)

Tests a LDAP configurations by name.

Tests a LDAP configurations by name.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let ldapConfiguration = new JansConfigApi.LdapConfiguration(); // LdapConfiguration | 
apiInstance.postConfigDatabaseLdapTest(ldapConfiguration, (error, data, response) => {
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
 **ldapConfiguration** | [**LdapConfiguration**](LdapConfiguration.md)|  | 

### Return type

**Boolean**

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putConfigDatabaseLdap

> LdapConfiguration putConfigDatabaseLdap(ldapConfiguration)

Updates LDAP configuration.

Updates LDAP configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.DatabaseLDAPConfigurationApi();
let ldapConfiguration = new JansConfigApi.LdapConfiguration(); // LdapConfiguration | 
apiInstance.putConfigDatabaseLdap(ldapConfiguration, (error, data, response) => {
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
 **ldapConfiguration** | [**LdapConfiguration**](LdapConfiguration.md)|  | 

### Return type

[**LdapConfiguration**](LdapConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

