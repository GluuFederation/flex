---
tags:
- administration
- admin-ui
- configuration
---

# Gluu Flex Admin UI Configuration

This document outlines the configuration process for Gluu Flex Admin UI, with a focus on essential components stored in the Auth Server's persistence layer. These components include role-permission mapping, OIDC client details for accessing the Auth Server, OIDC client details for accessing the Token Server, OIDC client details for accessing the License APIs, and license metadata.

## Configuration Components

### Role-Permission

The cedarling configuration helps to manage role and permissions for Admin UI. You need to configure cedarling and it automatically synced role and permissions as per schema and policies.

#### Cedarling Configuration

Use cedarling configuration section for policy store configuration:

![image](../../assets/admin-ui/cedarling-config.png)

Admin UI comes with [Default policy store](https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer). You can simply fork this repository, add or update roles and policies using [Agama Lab](https://cloud.gluu.org/agama-lab) and configure it in Admin UI.

If you are thinking to add new role then simply open your policy store in [Agama Lab](https://cloud.gluu.org/agama-lab), add policy with role and configure it in Admin UI Cedarling. Once you apply, Admin UI parse your policy store schema, find all roles from policies and added in Admin UI.

#### Set policy retrieval point

This feature is useful to set PRP. It helps to prevents from MITM attack in production. There are 2 mods.

1. `Remote`: In this mode, Admin UI will always use remote policy store URL to initialize cedarling, fetch policies, and schema.

2. `Default`: It is recommended to set it to Default for production. If set to Default, it will use the Admin-UI storage for Cedarling authorization. Enable Default mode and use the refresh button to store or update GitHub policies on the Admin-UI Server.



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