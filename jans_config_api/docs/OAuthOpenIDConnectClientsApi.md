# JansConfigApi.OAuthOpenIDConnectClientsApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteOauthOpenidClientsByInum**](OAuthOpenIDConnectClientsApi.md#deleteOauthOpenidClientsByInum) | **DELETE** /jans-config-api/api/v1/openid/clients/{inum} | Delete OpenId Connect client.
[**getOauthOpenidClients**](OAuthOpenIDConnectClientsApi.md#getOauthOpenidClients) | **GET** /jans-config-api/api/v1/openid/clients | Gets list of OpenID Connect clients
[**getOauthOpenidClientsByInum**](OAuthOpenIDConnectClientsApi.md#getOauthOpenidClientsByInum) | **GET** /jans-config-api/api/v1/openid/clients/{inum} | Get OpenId Connect Client by Inum
[**patchOauthOpenidClientsByInum**](OAuthOpenIDConnectClientsApi.md#patchOauthOpenidClientsByInum) | **PATCH** /jans-config-api/api/v1/openid/clients/{inum} | Update modified properties of OpenId Connect client by Inum.
[**postOauthOpenidClients**](OAuthOpenIDConnectClientsApi.md#postOauthOpenidClients) | **POST** /jans-config-api/api/v1/openid/clients | Create new OpenId connect client
[**putOauthOpenidClients**](OAuthOpenIDConnectClientsApi.md#putOauthOpenidClients) | **PUT** /jans-config-api/api/v1/openid/clients | Update OpenId Connect client.



## deleteOauthOpenidClientsByInum

> deleteOauthOpenidClientsByInum(inum)

Delete OpenId Connect client.

Delete OpenId Connect client.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let inum = "inum_example"; // String | Client identifier
apiInstance.deleteOauthOpenidClientsByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Client identifier | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthOpenidClients

> [Client] getOauthOpenidClients(opts)

Gets list of OpenID Connect clients

Gets list of OpenID Connect clients

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let opts = {
  'limit': 50, // Number | Search size - max size of the results to return.
  'pattern': "pattern_example" // String | Search pattern.
};
apiInstance.getOauthOpenidClients(opts, (error, data, response) => {
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

[**[Client]**](Client.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthOpenidClientsByInum

> [Client] getOauthOpenidClientsByInum(inum)

Get OpenId Connect Client by Inum

Get OpenId Connect Client by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let inum = "inum_example"; // String | Client identifier
apiInstance.getOauthOpenidClientsByInum(inum, (error, data, response) => {
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
 **inum** | **String**| Client identifier | 

### Return type

[**[Client]**](Client.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchOauthOpenidClientsByInum

> [Client] patchOauthOpenidClientsByInum(inum, opts)

Update modified properties of OpenId Connect client by Inum.

Update modified properties of OpenId Connect client by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let inum = "inum_example"; // String | Client identifier
let opts = {
  'patchRequest': new JansConfigApi.PatchRequest() // PatchRequest | 
};
apiInstance.patchOauthOpenidClientsByInum(inum, opts, (error, data, response) => {
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
 **inum** | **String**| Client identifier | 
 **patchRequest** | [**PatchRequest**](PatchRequest.md)|  | [optional] 

### Return type

[**[Client]**](Client.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## postOauthOpenidClients

> [Client] postOauthOpenidClients(opts)

Create new OpenId connect client

Create new OpenId connect client

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let opts = {
  'client': [new JansConfigApi.Client()] // [Client] | 
};
apiInstance.postOauthOpenidClients(opts, (error, data, response) => {
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
 **client** | [**[Client]**](Client.md)|  | [optional] 

### Return type

[**[Client]**](Client.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putOauthOpenidClients

> [Client] putOauthOpenidClients(opts)

Update OpenId Connect client.

Update OpenId Connect client.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectClientsApi();
let opts = {
  'client': [new JansConfigApi.Client()] // [Client] | 
};
apiInstance.putOauthOpenidClients(opts, (error, data, response) => {
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
 **client** | [**[Client]**](Client.md)|  | [optional] 

### Return type

[**[Client]**](Client.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

