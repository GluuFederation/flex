---
tags:
- administration
- admin-ui
- configuration
---

# Gluu Flex Admin UI Configuration

This document outlines the configuration process for Gluu Flex Admin UI, with a focus on essential components stored in the Auth Server's persistence layer. These components include role-permission mapping, OIDC client details for accessing the Auth Server, OIDC client details for accessing the Token Server, OIDC client details for accessing the License APIs, and license metadata.

## Configuration Components

### Role-Permission Mapping

[Role-permission](./admin-menu.md/) mapping defines which administrative roles are granted specific permissions within the Gluu Flex Admin UI. This mapping ensures that administrators can only access and modify functionalities relevant to their roles.

The mapping is stored in json format with following attributes.

**Roles**

|Attribute Name|Description|
|--------------|-----------|
|roles|Array of all roles|
|role|Role name|
|description| Role description|
|deletable|If set to `true` then entire role-permission mapping with respect to the role can be deleted. Default value: `false`|

**Permissions**

|Attribute Name|Description|
|--------------|-----------|
|permissions|Array of all available permissions|
|permission|Permission name|
|description| Permission description|
|defaultPermissionInToken|If set to `true`, it indicates that permission will need authentication and valid role during `/token` request to include in token|

**Mapping**

|Attribute Name|Description|
|--------------|-----------|
|rolePermissionMapping| List of all role-permission mapping|
|role|Role name|
|permission|Array of all permission mapped to the role|

**Sample role-permission mapping stored in persistence**

```text
{
  "roles": [
    {
      "role": "sample-role",
      "description": "role description",
      "deletable": false
    }
  ],
  "permissions": [
    {
      "permission": "sample-permission1",
      "description": "permission1 description",
      "defaultPermissionInToken": false
    },
    {
      "permission": "sample-permission2",
      "description": "permission2 description",
      "defaultPermissionInToken": true
    }
  ],
  "rolePermissionMapping": [
    {
      "role": "sample-role",
      "permissions": [
        "sample-permission1",
        "sample-permission2"
      ]
    }
  ]
}
```

### OIDC Client Details for Auth Server

To establish secure communication with the Auth Server, Gluu Flex Admin UI requires the OIDC client details, including client ID and client secret. These details are used for authentication and authorization purposes.

The information is stored in json format with following attributes.

|Attribute Name|Description|
|--------------|-----------|
|auiWebClient|Object with Web OIDC client details|
|opHost|Auth Server hostname|
|clientId| Client Id of OIDC client used to access Auth server|
|clientSecret| Client Secret of OIDC client used to access Auth server|
|scopes|Scopes required for Admin UI authentication|
|acrValues|ACR required for Admin UI authentication|
|redirectUri|Redirect UI which is Admin UI home page|
|postLogoutUri|Url to be redirected after Admin UI logout|
|frontchannelLogoutUri|Front channel Logout Uri|
|additionalParameters|The custom parameters allow you to pass additional information to the authorization server during Admin UI authentication. Format: [{"key": "custom-param-key", "value": "custom-param-value"}, ...]|

### OIDC Client Details for Backend API Server

Similarly, Gluu Flex Admin UI needs OIDC client details to interact with the Janssen Server via. `Jans Config API` protected APIs. The Backend API client enables the UI to request and manage access tokens required to access `Jans Config API` protected resources.

The information is stored in json format with following attributes.

|Attribute Name|Description|
|--------------|-----------|
|auiBackendApiClient|Object with Backend API client details|
|opHost|Token Server hostname|
|clientId| Client Id of OIDC client used to access Token server|
|clientSecret| Client Secret of OIDC client used to access Token server|
|tokenEndpoint|Token endpoint of token server|

### Configuration Properties for User-Interface

|Attribute Name|Description|
|--------------|-----------|
|uiConfig|Object with UI configuration attributes|
|sessionTimeoutInMins|The admin UI will auto-logout after a period of inactivity defined in this field.|  

### OIDC Client Details for License Server

Access to the License APIs is managed through OIDC client details. These details allows the Gluu Flex Admin UI Backend to generated access token to allow the retrieval of license-related information using license APIs.

The information is stored in json format with following attributes.

|Attribute Name|Description|
|--------------|-----------|
|opHost|Auth Server hostname used to generate token to access License APIs|
|clientId| Client Id of OIDC client used to generate token to access License APIs|
|clientSecret| Client Secret of OIDC client used to generate token to access License APIs|

### License Metadata

License metadata includes relevant information about the Gluu Flex Admin UI's licensing, such as License Key, Hardware id, License server url, License Auth server url, SSA used to register license auth server client.

The information is stored in json format with following attributes.

|Attribute Name| Description|
|--------------|------------|
|licenseConfig| Object with License configuration details |
|ssa| SSA used to register OIDC client to access license APIs |
|scanLicenseApiHostname| SCAN License server hostname |
|licenseHardwareKey| Hardware key (org_id) to access license APIs |
|intervalForSyncLicenseDetailsInDays| The Admin UI backend syncs license details into the configuration (persistence) after the set interval (default: 30 days). |

**Sample configuration stored in persistence**

```text
{
  "oidcConfig": {
    "auiWebClient": {
      "redirectUri": "https://your.host.com/admin",
      "postLogoutUri": "https://your.gost.com/admin",
      "frontchannelLogoutUri": "https://your.host.com/admin/logout",
      "scopes": [
        "openid",
        "profile",
        "user_name",
        "email"
      ],
      "acrValues": [
        "basic"
      ],
      "opHost": "https://your.host.com",
      "clientId": "2001.aaf0b8eb-a82e-4798-b1a0-e007803a6568",
      "clientSecret": "GGO4t1uixrTpl4Rizt3zag==".
      "additionalParameters": []
    },
    "auiBackendApiClient": {
      "tokenEndpoint": "https://your.host.com/jans-auth/restv1/token",
      "scopes": [
        "openid",
        "profile",
        "user_name",
        "email"
      ],
      "opHost": "https://your.host.com",
      "clientId": "2001.aaf0b8eb-a82e-4798-b1a0-e007803a6568",
      "clientSecret": "GGO4t1uixrTpl4Rizt3zag=="
    }
  },
  "uiConfig": {
    "sessionTimeoutInMins": 30
  },
  "licenseConfig": {
    "ssa": "...ssa in jwt format...",
    "scanLicenseApiHostname": "https://cloud-dev.gluu.cloud",
    "licenseKey": "XXXX-XXXX-XXXX-XXXX",
    "licenseHardwareKey": "github:ghUsername",
    "oidcClient": {
      "opHost": "https://account-dev.gluu.cloud",
      "clientId": "36a43e2b-a77b-4e9c-a966-a9d98af1665c",
      "clientSecret": "211188d8-a2d8-4562-ab53-80907c1bb5ba"
    }
  }
}
```
