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

The cedarling configuration helps to manage roles and permissions for Admin UI. You need to configure Cedarling, and it automatically syncs roles and permissions as per the schema and policies.

#### Cedarling Configuration

Use the Cedarling configuration section for policy store configuration:

![image](../../assets/admin-ui/cedarling-config.png)

Admin UI comes with [Default policy store](https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer). You can simply fork the [GluuFlexAdminUIPolicyStore](https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer) repository, view, add, and update roles and policies using [Agama Lab](https://cloud.gluu.org/agama-lab) and configure it in Admin UI.

To add a new role, open your policy store in [Agama Lab](https://cloud.gluu.org/agama-lab), create a policy with the role, and configure it in the Admin UI Cedarling. Once you apply, Admin UI parses your policy store schema, finds all roles from policies, and adds them to Admin UI.

#### Set policy retrieval point

This feature is useful for setting PRP. It helps to prevent MITM attacks in production. There are 2 mods.

1. `Remote`: In this mode, Admin UI will always use the remote policy store URL to initialize Cedarling, fetch policies, and schema.

2. `Default`: It is recommended to set it to Default for production. If set to Default, it will use the Admin-UI storage for Cedarling authorization. Enable Default mode and use the refresh button to store or update GitHub policies on the Admin-UI Server.

#### Policy store

Admin UI comes with [Default policy store](https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer). These details will help you add or update the policies. It has the following policies:

**Admin Role policies:**

```cedar
@id("AdminCanManageAuthServerConfiguration")
permit (
  principal in Gluu::Flex::AdminUI::Role::"admin",
  action in [Gluu::Flex::AdminUI::Action::"read",
  Gluu::Flex::AdminUI::Action::"write",
  Gluu::Flex::AdminUI::Action::"delete"],
  resource in Gluu::Flex::AdminUI::Resources::ParentResource::"AuthServerAndConfiguration"
);

@id("AdminCanManageUserIdentityAndAccess")
permit (
  principal in Gluu::Flex::AdminUI::Role::"admin",
  action in [Gluu::Flex::AdminUI::Action::"read",
  Gluu::Flex::AdminUI::Action::"write",
  Gluu::Flex::AdminUI::Action::"delete"],
  resource in Gluu::Flex::AdminUI::Resources::ParentResource::"IdentityAndAccess"
);

@id("AdminCanManageSystemMonitoring")
permit (
  principal in Gluu::Flex::AdminUI::Role::"admin",
  action in [Gluu::Flex::AdminUI::Action::"read",
  Gluu::Flex::AdminUI::Action::"write",
  Gluu::Flex::AdminUI::Action::"delete"],
  resource in Gluu::Flex::AdminUI::Resources::ParentResource::"SystemAndMonitoring"
);

@id("AdminCanManageService")
permit (
  principal in Gluu::Flex::AdminUI::Role::"admin",
  action in [Gluu::Flex::AdminUI::Action::"read",
  Gluu::Flex::AdminUI::Action::"write",
  Gluu::Flex::AdminUI::Action::"delete"],
  resource in Gluu::Flex::AdminUI::Resources::ParentResource::"Service"
);
```

**Auditor Policies**

```cedar
@id("AuditorCanManageClients")
permit (
  principal in Gluu::Flex::AdminUI::Role::"auditor",
  action in [Gluu::Flex::AdminUI::Action::"read",
  Gluu::Flex::AdminUI::Action::"write",
  Gluu::Flex::AdminUI::Action::"delete"],
  resource in Gluu::Flex::AdminUI::Resources::Features::"Clients"
);
```

**Viewer Policies**

```cedar
@id("ViewerCanViewUserIdentityAndAccess")
permit (
  principal in Gluu::Flex::AdminUI::Role::"viewer",
  action in Gluu::Flex::AdminUI::Action::"read",
  resource in Gluu::Flex::AdminUI::Resources::ParentResource::"IdentityAndAccess"
);
```

**Parent and child resources**

| Parent Resource | Child resources |
|-----------------|-----------------|
|`AuthServerAndConfiguration`|`Clients`, `Scopes`, `Keys`, `AuthenticationServerConfiguration`, `Logging`, `SSA`, `Authentication`, `ConfigApiConfiguration`, `Session`|
|`IdentityAndAccess`|`Users`, `Scripts`, `UserClaims`|
|`SystemAndMonitoring`|`Dashboard`, `License`, `MAU`, `Security`, `Settings`, `Webhooks`, `Assets`, `AuditLogs`|
|`Service`|`Cache`, `Persistence`, `SMTP`, `SCIM`, `FIDO`, `SAML`, `Lock`|

**Default entities**

Default entities helps to make a parent-child relation in entities. In Admin UI case, it helps to manage resources.

```json
{
  "1694c954f8d9": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Dashboard"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "2694c954f8d8": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "License"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "3694c954f8d7": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "MAU"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "4694c954f8d6": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Security"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "6494c954f8d6": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Settings"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "5694c954f8d5": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Webhooks"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "6694c954f8d4": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Assets"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "7694c954f8d3": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "AuditLogs"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "SystemAndMonitoring"
      }
    ]
  },
  "8694c954f8d2": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Clients"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "9694c954f8d1": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Scopes"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "a694c954f8d0": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Keys"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "b694c954f8cf": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "AuthenticationServerConfiguration"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "c694c954f8ce": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Logging"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "d694c954f8cd": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "SSA"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "e694c954f8cc": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Authentication"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "f694c954f8cb": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "ConfigApiConfiguration"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "1694c954f8ca": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Session"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "AuthServerAndConfiguration"
      }
    ]
  },
  "2694c954f8c9": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Users"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "IdentityAndAccess"
      }
    ]
  },
  "3694c954f8c8": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Scripts"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "IdentityAndAccess"
      }
    ]
  },
  "4694c954f8c7": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "UserClaims"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "IdentityAndAccess"
      }
    ]
  },
  "5694c954f8c6": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Cache"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "6694c954f8c5": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Persistence"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "7694c954f8c4": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "SMTP"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "8694c954f8c3": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "SCIM"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "9694c954f8c2": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "FIDO"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "a694c954f8c1": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "SAML"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  },
  "b694c954f8c0": {
    "uid": {
      "type": "Gluu::Flex::AdminUI::Resources::Features",
      "id": "Lock"
    },
    "attrs": {},
    "parents": [
      {
        "type": "Gluu::Flex::AdminUI::Resources::ParentResource",
        "id": "Service"
      }
    ]
  }
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