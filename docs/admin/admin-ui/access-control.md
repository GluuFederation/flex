---
tags:
  - administration
  - admin-ui
  - access control
  - cedarling
  - security
---

# Access Control in Admin UI

The role of the user logged-in to Gluu Flex Admin UI decides if the user will have access to a certain Admin UI's feature or not. After user authentication the user's role and other claims are packed in bundle of tokens (access_token, id_token and userinfo_token). [Cedarling](https://docs.jans.io/stable/cedarling) PDP embedded with GUI, processes the tokens and decides if the action (like Read, Write or Delete) is allowed on this resource (feature). The Cedarling's Token-based Access Control (TBAC) is used for managing access control in Gluu Flex Admin UI.

## Admin UI Features (Resources)

The Admin UI features (or resources) are categorised into following parent groups. This categorization is done for resource grouping in cedar policies used for governing the authorization decision taken by Cedarling.

- System and monitoring
    - Dashboard
    - Health
    - License
    - MAU
    - Settings
    - Security
    - Webhooks
    - Assets
    - AuditLogs
- AuthServer and configuration
    - Clients
    - Scopes
    - Keys
    - AuthServerProperties
    - Logging
    - SSA
    - Authn
    - ConfigAPIProperties
    - Sessions
- Identity and Access
    - Users
    - Scripts
    - UserClaims
- Service
    - Cache
    - Persistence
    - SMTP
    - SCIM
    - FIDO
    - SAML
    - Lock
- Essential Admin UI Scopes
    - Admin UI Session

In the Policy Store we use [default_entities](https://docs.jans.io/stable/cedarling/reference/cedarling-policy-store/#default-entities) to map the parent group with the sub features. For e.g. here we are showing the default entity json to map the features under `System and monitoring` parent group.

```json
[
    {
        "attrs": {},
        "uid": {
            "id": "Dashboard",
            "type": "GluuFlexAdminUIResources::Features"
        },
        "tags": {},
        "parents": [
            {
                "id": "SystemAndMonitoring",
                "type": "GluuFlexAdminUIResources::ParentResource"
            }
        ]
    },
    {
        "attrs": {},
        "uid": {
            "id": "License",
            "type": "GluuFlexAdminUIResources::Features"
        },
        "tags": {},
        "parents": [
            {
                "id": "SystemAndMonitoring",
                "type": "GluuFlexAdminUIResources::ParentResource"
            }
        ]
    },
    {
        "attrs": {},
        "uid": {
            "id": "MAU",
            "type": "GluuFlexAdminUIResources::Features"
        },
        "tags": {},
        "parents": [
            {
                "id": "SystemAndMonitoring",
                "type": "GluuFlexAdminUIResources::ParentResource"
            }
        ]
    },
    {
        "attrs": {},
        "uid": {
            "id": "Security",
            "type": "GluuFlexAdminUIResources::Features"
        },
        "tags": {},
        "parents": [
            {
                "id": "SystemAndMonitoring",
                "type": "GluuFlexAdminUIResources::ParentResource"
            }
        ]
    },
    {
        "attrs": {},
        "uid": {
            "id": "Settings",
            "type": "GluuFlexAdminUIResources::Features"
        },
        "tags": {},
        "parents": [
            {
                "id": "SystemAndMonitoring",
                "type": "GluuFlexAdminUIResources::ParentResource"
            }
        ]
    },
    ....
]
```

## Managing Admin UI's Policy Store

After installation, Admin UI uses a default Policy Store (file with .cjar extension) for GUI access control. The logged-in user can use the [Cedarling configuration screen](./configuration.md#cedarling-configuration) to upload the new Policy Store file with .cjar extension, generated and released using [Agama-Lab's](https://cloud.gluu.org/agama-lab) Policy designer. When the Policy Store file is uploaded, the backend parses the Policy Store to determine the roles and the role-to-scope mappings. The Policy Store is used for managing GUI access control. The aggregated role-to-scope mapping (obtained by parsing the Policy Store) ensures that only the mapped scopes are added in the authorization tokens to access the appropriate protected Config API endpoints.

```mermaid
C4Context
    title Access Control in Gluu Flex Admin UI

    Enterprise_Boundary(flex, "Gluu Flex") {
        Container(JansAuthServer, "Janssen Authentication Server", "Auth Server and OpenID Provider")
        
        Container_Boundary(ConfigApiBoundary, "Config API") {
            Container(AdminUIBackend, "Admin UI Backend", "The backend used by Admin UI")
        }
        
        Container_Boundary(AdminUIBoundary, "Admin UI") {
            Container(Cedarling, "Cedarling", "PDP")
            Container(Frontend, "Admin UI Frontend", "Web Interface")
        }
        
        ContainerDb(PolicyStore, "Default or uploaded Policy Store", "Default or uploaded Policy Store File with .cjar extension")
    }

    Enterprise_Boundary(AgamaLab, "Agama Lab") {
        Container(PolicyDesigner, "Policy Designer", "Policy Designer for Cedarling")
    }

    Enterprise_Boundary(GitHub, "GitHub") {
        ContainerDb(PolicyStoreProject, "Policy Store Project", "GitHub repository for storing and <br> publishing remote Policy Stores")
    }

    Rel(AdminUIBackend, PolicyStore, "Use the Policy Store for access control in Admin UI")
    Rel(AdminUIBackend, Cedarling, "Request Policy <br>Store for initialization")
    Rel(PolicyDesigner, PolicyStoreProject, "Save Policy Store project to GitHub")
    Rel(Frontend, Cedarling, "Check user permissions<br>for UI features and actions", "TBAC Authorization")
```

## Policies

The Cedar policies in the Policy Store empowers the administrator with following:

### Manage the access control in Admin UI

The Cedar policies are rules which decide if the logged-in user can perform Read, Write or Delete action on a feature or not. By writing the appropriate cedar policies the administrator can manage access control in Admin UI. For e.g the below policy allows the user with role **admin** to perform **Read**, **Write** or **Delete** actions on all the features under the parent group **AuthServerAndConfiguration**.

```cedar
@id("AdminCanManageAuthServerConfiguration")
permit (
  principal,
  action in [GluuFlexAdminUI::Action::"read",
  GluuFlexAdminUI::Action::"write",
  GluuFlexAdminUI::Action::"delete"],
  resource in GluuFlexAdminUIResources::ParentResource::"AuthServerAndConfiguration"
)
when {
    context has tokens.gluuflexadminui_userinfo_token &&
    context.tokens.gluuflexadminui_userinfo_token.hasTag("jansAdminUIRole") &&
    context.tokens.gluuflexadminui_userinfo_token.getTag("jansAdminUIRole").contains("admin")
};
```

Below policy gives the users with role **viewer** the **Read** access to all the features under the **IdentityAndAccess** parent group.

```cedar
@id("ViewerCanViewUserIdentityAndAccess")
permit (
  principal,
  action in GluuFlexAdminUI::Action::"read",
  resource in GluuFlexAdminUIResources::ParentResource::"IdentityAndAccess"
)
when {
    context has tokens.gluuflexadminui_userinfo_token &&
    context.tokens.gluuflexadminui_userinfo_token.hasTag("jansAdminUIRole") &&
    context.tokens.gluuflexadminui_userinfo_token.getTag("jansAdminUIRole").contains("viewer")
};
```

Below policy gives the users with role **auditor** the **Read**, **Write** and **Delete** access to only the **Clients** feature of Admin UI.

```cedar
@id("AuditorCanManageClients")
permit (
  principal,
  action in [GluuFlexAdminUI::Action::"read",
  GluuFlexAdminUI::Action::"write",
  GluuFlexAdminUI::Action::"delete"],
  resource in GluuFlexAdminUIResources::Features::"Clients"
)
when {
    context has tokens.gluuflexadminui_userinfo_token &&
    context.tokens.gluuflexadminui_userinfo_token.hasTag("jansAdminUIRole") &&
    context.tokens.gluuflexadminui_userinfo_token.getTag("jansAdminUIRole").contains("auditor")
};
```

### Adding new Roles in Admin UI

To add new Admin UI user roles, the administrator just need to introduce the policies associated with those roles in the Policy Store. On saving the Policy Store the Admin UI parses it and aggregates the roles and role-to-scope mapping. The aggregated data is saved into the persistence.

### Writing policies: Parent Groups as Resource


The principal element in a [Cedar policy](https://docs.cedarpolicy.com/) represents a user, service, or other identity that can make a request to perform an action on a resource in your application. We will learn how to write an Admin UI policy using a sample scenario: a logged-in user with the **admin** role can manage the **Auth Server and its configuration**.

```cedar
@id("AdminCanManageAuthServerConfiguration")
permit (
  principal,
  action in [GluuFlexAdminUI::Action::"read",
  GluuFlexAdminUI::Action::"write",
  GluuFlexAdminUI::Action::"delete"],
  resource in GluuFlexAdminUIResources::ParentResource::"AuthServerAndConfiguration"
)
when {
    context has tokens.gluuflexadminui_userinfo_token &&
    context.tokens.gluuflexadminui_userinfo_token.hasTag("jansAdminUIRole") &&
    context.tokens.gluuflexadminui_userinfo_token.getTag("jansAdminUIRole").contains("admin")
};

```
**Principal :**
We are using Cedarling's [Multi-Issuer Authorization](https://docs.jans.io/stable/cedarling/reference/cedarling-multi-issuer/) in Admin UI for access control which evaluates policies based purely on token entities. The cedar policies are driven by tokens tags in the when clause. The administrator's **role** is picked up from the context token entities.

**Action :**
In this policy, we are allowing **Read**, **Write** and **Delete** actions on the resource. Here we have `action in [GluuFlexAdminUI::Action::"read", GluuFlexAdminUI::Action::"write", GluuFlexAdminUI::Action::"delete"]`. The `GluuFlexAdminUI::` is the namespace where all action entities reside.

**Resource :**
As we have categorised Admin UI features (or resources) into the parent groups, `resource in GluuFlexAdminUIResources::ParentResource::"AuthServerAndConfiguration"` allows the user with role **admin** to perform **Read**, **Write** and **Delete** actions on all the features under **AuthServerAndConfiguration** parent group. Here `GluuFlexAdminUIResources::` is the namespace where **ParentResource** entity resides. The **ParentResource** entity represents the parent group and **AuthServerAndConfiguration** in inverted commas is the entity id representing name of the parent group.

### Writing policies: Specific Admin UI Feature as Resource

To define policies for a specific Admin UI feature (e.g., Clients, Scopes, Users), use the format `GluuFlexAdminUIResources::Features` followed by the resource’s Entity ID enclosed in quotation marks in resource clause. For e.g. below policy allows **Read**, **Write** and **Delete** action to the user with role **auditor** on **Clients** resource.

```cedar
@id("AuditorCanManageClients")
permit (
  principal,
  action in [GluuFlexAdminUI::Action::"read",
  GluuFlexAdminUI::Action::"write",
  GluuFlexAdminUI::Action::"delete"],
  resource in GluuFlexAdminUIResources::Features::"Clients"
)
when {
    context has tokens.gluuflexadminui_userinfo_token &&
    context.tokens.gluuflexadminui_userinfo_token.hasTag("jansAdminUIRole") &&
    context.tokens.gluuflexadminui_userinfo_token.getTag("jansAdminUIRole").contains("auditor")
};
```
Please see the Entity Ids of the Parent Groups and their underlying features in this table:

|Parent Group|Features|
|------------|--------|
|AuthServerAndConfiguration|Clients, Scopes, Keys, AuthenticationServerConfiguration, Logging, SSA, Authentication, ConfigApiConfiguration, Session|
|IdentityAndAccess|Users, Scripts, Attributes|
|SystemAndMonitoring|Dashboard, License, MAU, Security, Settings, Webhooks, Assets, AuditLogs|
|Service|Persistence, SMTP, SCIM, FIDO, SAML, Lock|
|Essential Admin UI Scopes|Admin UI Session Scopes|
