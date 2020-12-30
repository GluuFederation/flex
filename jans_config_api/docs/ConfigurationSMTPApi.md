# JansConfigApi.ConfigurationSMTPApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteConfigSmtp**](ConfigurationSMTPApi.md#deleteConfigSmtp) | **DELETE** /jans-config-api/api/v1/config/smtp | Deletes SMTP server configuration.
[**getConfigSmtp**](ConfigurationSMTPApi.md#getConfigSmtp) | **GET** /jans-config-api/api/v1/config/smtp | Returns SMTP server configuration.
[**postConfigSmtp**](ConfigurationSMTPApi.md#postConfigSmtp) | **POST** /jans-config-api/api/v1/config/smtp | Adds SMTP server configuration.
[**putConfigSmtp**](ConfigurationSMTPApi.md#putConfigSmtp) | **PUT** /jans-config-api/api/v1/config/smtp | Updates SMTP server configuration.
[**testConfigSmtp**](ConfigurationSMTPApi.md#testConfigSmtp) | **POST** /jans-config-api/api/v1/config/smtp/test | Test SMTP server configuration.



## deleteConfigSmtp

> deleteConfigSmtp()

Deletes SMTP server configuration.

Deletes SMTP server configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationSMTPApi();
apiInstance.deleteConfigSmtp((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getConfigSmtp

> SmtpConfiguration getConfigSmtp()

Returns SMTP server configuration.

Returns SMTP server configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationSMTPApi();
apiInstance.getConfigSmtp((error, data, response) => {
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

[**SmtpConfiguration**](SmtpConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## postConfigSmtp

> SmtpConfiguration postConfigSmtp(opts)

Adds SMTP server configuration.

Adds SMTP server configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationSMTPApi();
let opts = {
  'smtpConfiguration': new JansConfigApi.SmtpConfiguration() // SmtpConfiguration | 
};
apiInstance.postConfigSmtp(opts, (error, data, response) => {
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
 **smtpConfiguration** | [**SmtpConfiguration**](SmtpConfiguration.md)|  | [optional] 

### Return type

[**SmtpConfiguration**](SmtpConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putConfigSmtp

> SmtpConfiguration putConfigSmtp(opts)

Updates SMTP server configuration.

Updates SMTP server configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationSMTPApi();
let opts = {
  'smtpConfiguration': new JansConfigApi.SmtpConfiguration() // SmtpConfiguration | 
};
apiInstance.putConfigSmtp(opts, (error, data, response) => {
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
 **smtpConfiguration** | [**SmtpConfiguration**](SmtpConfiguration.md)|  | [optional] 

### Return type

[**SmtpConfiguration**](SmtpConfiguration.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## testConfigSmtp

> InlineResponse200 testConfigSmtp()

Test SMTP server configuration.

Test SMTP server configuration.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.ConfigurationSMTPApi();
apiInstance.testConfigSmtp((error, data, response) => {
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

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

