# JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi

All URIs are relative to *https://jans.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteOauthOpenidSectorsById**](OAuthOpenIDConnectSectorIdentifiersApi.md#deleteOauthOpenidSectorsById) | **DELETE** /jans-config-api/api/v1/openid/sectoridentifiers/{inum} | Delete OpenID Connect Sector.
[**getOauthOpenidSectors**](OAuthOpenIDConnectSectorIdentifiersApi.md#getOauthOpenidSectors) | **GET** /jans-config-api/api/v1/openid/sectoridentifiers | Gets list of OpenID Connect Sectors.
[**getOauthOpenidSectorsById**](OAuthOpenIDConnectSectorIdentifiersApi.md#getOauthOpenidSectorsById) | **GET** /jans-config-api/api/v1/openid/sectoridentifiers/{inum} | Get OpenID Connect Sector by Inum.
[**patchOauthOpenidSectorsById**](OAuthOpenIDConnectSectorIdentifiersApi.md#patchOauthOpenidSectorsById) | **PATCH** /jans-config-api/api/v1/openid/sectoridentifiers/{inum} | Partially update OpenId Connect Sector by Inum.
[**postOauthOpenidSectors**](OAuthOpenIDConnectSectorIdentifiersApi.md#postOauthOpenidSectors) | **POST** /jans-config-api/api/v1/openid/sectoridentifiers | Create new OpenID Connect Sector.
[**putOauthOpenidSectors**](OAuthOpenIDConnectSectorIdentifiersApi.md#putOauthOpenidSectors) | **PUT** /jans-config-api/api/v1/openid/sectoridentifiers | Update OpenId Connect Sector.



## deleteOauthOpenidSectorsById

> deleteOauthOpenidSectorsById(inum)

Delete OpenID Connect Sector.

Delete OpenID Connect Sector.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
let inum = "inum_example"; // String | Scope ID.
apiInstance.deleteOauthOpenidSectorsById(inum, (error, data, response) => {
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
 **inum** | **String**| Scope ID. | 

### Return type

null (empty response body)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthOpenidSectors

> [SectorIdentifier] getOauthOpenidSectors()

Gets list of OpenID Connect Sectors.

Gets list of OpenID Connect Sectors.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
apiInstance.getOauthOpenidSectors((error, data, response) => {
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

[**[SectorIdentifier]**](SectorIdentifier.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOauthOpenidSectorsById

> SectorIdentifier getOauthOpenidSectorsById(inum)

Get OpenID Connect Sector by Inum.

Get OpenID Connect Sector by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
let inum = "inum_example"; // String | Scope ID.
apiInstance.getOauthOpenidSectorsById(inum, (error, data, response) => {
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
 **inum** | **String**| Scope ID. | 

### Return type

[**SectorIdentifier**](SectorIdentifier.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## patchOauthOpenidSectorsById

> SectorIdentifier patchOauthOpenidSectorsById(inum, opts)

Partially update OpenId Connect Sector by Inum.

Partially update OpenId Connect Sector by Inum.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
let inum = "inum_example"; // String | Scope ID.
let opts = {
  'patchRequest': [new JansConfigApi.PatchRequest()] // [PatchRequest] | 
};
apiInstance.patchOauthOpenidSectorsById(inum, opts, (error, data, response) => {
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
 **inum** | **String**| Scope ID. | 
 **patchRequest** | [**[PatchRequest]**](PatchRequest.md)|  | [optional] 

### Return type

[**SectorIdentifier**](SectorIdentifier.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json-patch+json
- **Accept**: application/json


## postOauthOpenidSectors

> SectorIdentifier postOauthOpenidSectors(opts)

Create new OpenID Connect Sector.

Create new OpenID Connect Sector.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
let opts = {
  'sectorIdentifier': new JansConfigApi.SectorIdentifier() // SectorIdentifier | 
};
apiInstance.postOauthOpenidSectors(opts, (error, data, response) => {
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
 **sectorIdentifier** | [**SectorIdentifier**](SectorIdentifier.md)|  | [optional] 

### Return type

[**SectorIdentifier**](SectorIdentifier.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## putOauthOpenidSectors

> SectorIdentifier putOauthOpenidSectors(opts)

Update OpenId Connect Sector.

Update OpenId Connect Sector.

### Example

```javascript
import JansConfigApi from 'jans_config_api';
let defaultClient = JansConfigApi.ApiClient.instance;
// Configure OAuth2 access token for authorization: jans-auth
let jans-auth = defaultClient.authentications['jans-auth'];
jans-auth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new JansConfigApi.OAuthOpenIDConnectSectorIdentifiersApi();
let opts = {
  'sectorIdentifier': new JansConfigApi.SectorIdentifier() // SectorIdentifier | 
};
apiInstance.putOauthOpenidSectors(opts, (error, data, response) => {
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
 **sectorIdentifier** | [**SectorIdentifier**](SectorIdentifier.md)|  | [optional] 

### Return type

[**SectorIdentifier**](SectorIdentifier.md)

### Authorization

[jans-auth](../README.md#jans-auth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

