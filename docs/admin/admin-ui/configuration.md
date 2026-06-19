---
tags:
- administration
- admin-ui
- configuration
---

# Gluu Flex Admin UI Configuration

This document outlines the configuration process for Gluu Flex Admin UI, with a focus on essential components stored in the Auth Server's persistence layer. These components include Cedarling Configuration, OIDC client details for accessing the Auth Server, OIDC client details for accessing the Token Server, OIDC client details for accessing the License APIs, and license metadata.

## Configuration Components

### Cedarling Configuration

Gluu Flex Admin UI uses [Cedarling](https://docs.jans.io/stable/cedarling/) for GUI access control. The role of the user is mapped with specific permissions (scopes) to ensure that the user can only access and modify functionalities relevant to their roles.

The Cedarling Policy Store configuration screen helps to upload the Policy Store archive file used for the Admin UI access control. The Gluu Flex Admin UI uses a default Policy Store after installation for GUI access control. You can upload a new Cedarling Policy Store and Admin UI backend will automatically synchronize roles and role-to-scope mapping as per the schema and policies defined in the Policy Store.

![image](../../assets/admin-ui/cedarling-config.png)

#### Steps to create and upload Policy Store archive file 

 1. Fork the project [GluuFlexAdminUIPolicyStore](https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer).
 2. Open the forked GitHub repository using [Agama Lab's](https://cloud.gluu.org/agama-lab) Policy Designer.
 3. Make the required modifications in the policies for Admin UI access control and save the changes.
 4. Release the policy store archive file (with .cjar extension) from Agama Lab.
![image](../../assets/admin-ui/policy-store-release-1.png)
 5. Download the released Policy Store archive file (with .cjar extension) from the releases section GitHub policy-store repository.
 ![image](../../assets/admin-ui/policy-store-release-2.png)
 6. Open Cedarling Policy Store configuration screen on Admin UI and upload the Policy Store archive file.


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

uiConfig

|Attribute Name|Description|
|--------------|-----------|
|sessionTimeoutInMins|Admin UI Frontend session out time|
|allowSmtpKeystoreEdit|Allow to edit SMTP keystore fields. The default value is `true`.|
|cedarlingLogType|Set embeded Cedarling log-type in Admin UI. The allowed values are `off` and `std_out`.|
|auiPolicyStoreUrl|Path of Policy Store archive file|
|auiDefaultPolicyStorePath|The path of the default Policy Store json file on Config Api pod.|

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
|licenseKey|License-key to access Admin UI|
|licenseHardwareKey| Hardware key (org_id) to access license APIs |
|intervalForSyncLicenseDetailsInDays| The Admin UI backend syncs license details into the configuration (persistence) after the set interval (default: 30 days). |
|licenseValidUpto|Expiry date to the subscribed flex license|
|licenseDetailsLastUpdatedOn|The date on which the license details were synced from Agama Lab to the Admin UI's License Configuration|
|productCode|The product code of the issued license at [LicenseSpring](https://licensespring.com/)|
|licenseType|The license type of the issued license at [LicenseSpring](https://licensespring.com/)
|licenseActive|Is the license configured currently active?|
|licenseExpired|Is the license configured expired?|
|licenseMAUThreshold|The allowed monthly active users for issued license|
|oidcClient|Object with details of OIDC client to access license API|



**Sample configuration stored in persistence**

```text

{
  "oidcConfig": {
    "auiWebClient": {
      "introspectionEndpoint": null,
      "tokenEndpoint": null,
      "redirectUri": "https://your.host.com/admin",
      "postLogoutUri": "https://your.host.com/admin",
      "frontchannelLogoutUri": "https://your.host.com/admin/logout",
      "scopes": [
        "openid",
        "https://jans.io/auth/ssa.admin",
        "email",
        "profile",
        "offline_access",
        "jans_stat"
      ],
      "acrValues": [
        "simple_password_auth"
      ],
      "opHost": "https://your.host.com",
      "clientId": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
      "clientSecret": "xxxxxxxxxxxxx",
      "additionalParameters": []
    },
    "auiBackendApiClient": {
      "introspectionEndpoint": "https://your.host.com/jans-auth/restv1/introspection",
      "tokenEndpoint": "https://your.host.com/jans-auth/restv1/token",
      "redirectUri": null,
      "postLogoutUri": null,
      "frontchannelLogoutUri": null,
      "scopes": [
        "openid",
        "https://jans.io/auth/ssa.admin"
      ],
      "acrValues": null,
      "opHost": "https://your.host.com",
      "clientId": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
      "clientSecret": "xxxxxxxxxxxxx",
      "additionalParameters": null
    }
  },
  "licenseConfig": {
    "ssa": "eyJraWQiOiJzc2FfN2IyMGM1MDYtMDlhNi00MTU1LWF....",
    "scanLicenseApiHostname": "https://license-server-hostname.gluu.org",
    "licenseKey": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
    "licenseHardwareKey": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
    "licenseValidUpto": "2026-07-07",
    "licenseDetailsLastUpdatedOn": "2026-06-18",
    "productCode": "adminui001",
    "productName": "Gluu Admin UI",
    "licenseType": "time-limited",
    "customerFirstName": "",
    "customerLastName": "",
    "customerEmail": "trial_request",
    "companyName": "",
    "licenseActive": true,
    "licenseExpired": false,
    "licenseMAUThreshold": 1000,
    "intervalForSyncLicenseDetailsInDays": 30,
    "oidcClient": {
      "introspectionEndpoint": null,
      "tokenEndpoint": null,
      "redirectUri": null,
      "postLogoutUri": null,
      "frontchannelLogoutUri": null,
      "scopes": null,
      "acrValues": null,
      "opHost": "https://account-server-hostname.gluu.org",
      "clientId": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
      "clientSecret": "xxxx.xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
      "additionalParameters": null
    }
  },
  "uiConfig": {
    "sessionTimeoutInMins": 31,
    "allowSmtpKeystoreEdit": true,
    "cedarlingLogType": "off",
    "auiPolicyStoreUrl": "",
    "auiDefaultPolicyStorePath": "./custom/config/adminUI/policy-store.cjar"
  }
}
```
