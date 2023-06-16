---
tags:
- administration
- admin-ui
- admin
- role
- permission
- scripts
- mau
---
# Admin Menu

The features like managing Roles and Permissions, Custom Scripts and monthly active users monitoring are placed under the **Admin** menu (in the left navigation of GUI). These features will be discussed one by one in this section.

## GUI Access Control

The administrator can control view/edit/delete access of users of Gluu Flex Admin UI by adding or removing the appropriate Permissions mapped to the user's Admin UI Role. For e.g. if the **read** Permission of OIDC clients (`https://jans.io/oauth/config/clients.readonly`) is not mapped to the logged-in user's Role, the contents of the page showing OIDC client records will not be visible to the user. In the same way, if the write and delete Permissions of OIDC clients are not mapped then the user will not be able to edit or delete any OIDC client.

### Role

The logged-in administrator can create, edit or delete Admin UI Roles using the `Admin UI Roles` Page. The Admin UI Role can be assigned to the user using the User Management feature of this GUI. After installation, the following Admin UI Roles can be seen on Admin UI: api-viewer, api-editor, api-manager and api-admin. The default user i.e. `admin` is assigned with api-admin role. A user with one or more Admin UI Role(s) assigned will be able to log into Gluu Flex Admin UI.

![image](../../assets/admin-ui/role.png)

### Permissions (Scopes)

Gluu Flex Admin UI uses [Config API](https://github.com/JanssenProject/jans/tree/main/jans-config-api) to manage and configure the Jans Auth server. Config API helps in configuring auth-server, users, fido2 and scim modules. The APIs of this rest application are protected using an authorization token containing the appropriate permissions (scopes). The user interface has the capability to add, edit and delete the Permissions used to access the APIs (i.e. APIs used by Gluu Flex Admin UI).

![image](../../assets/admin-ui/permission.png)

### Role-Permission Mapping

The administrator can map the Admin UI Role(s) with one or more Permission(s) using the Role-Permission Mapping page. The Role mapped with Permissions can be then assigned to the user to allow access to the corresponding pages and operations of the GUI.

![image](../../assets/admin-ui/role-permission.png)

The below table lists the Permissions for access control of the features:

|Permission|Description|
|----------|-----------|
|https://jans.io/oauth/config/attributes.readonly|View Person attributes|
|https://jans.io/oauth/config/attributes.write|Add/Edit Person attributes|
|https://jans.io/oauth/config/attributes.delete|Delete Person attributes|
|https://jans.io/oauth/config/scopes.readonly|View the Scopes|
|https://jans.io/oauth/config/scopes.write|Add/Edit Scopes|
|https://jans.io/oauth/config/scopes.delete|Delete Scopes|
|https://jans.io/oauth/config/scripts.readonly|View the Scripts|
|https://jans.io/oauth/config/scripts.write|Add/Edit Scripts|
|https://jans.io/oauth/config/scripts.delete|Delete Scripts|
|https://jans.io/oauth/config/openid/clients.readonly|View the Clients|
|https://jans.io/oauth/config/openid/clients.write|Add/Edit Clients|
|https://jans.io/oauth/config/openid/clients.delete|Delete Clients|
|https://jans.io/oauth/config/smtp.readonly|View SMTP configuration|
|https://jans.io/oauth/config/smtp.write|Edit SMTP configuration|
|https://jans.io/oauth/config/smtp.delete|Remove SMTP configuration|
|https://jans.io/oauth/config/logging.readonly|View Auth server log configuration|
|https://jans.io/oauth/config/logging.write|Edit Auth server log configuration|
|https://jans.io/oauth/config/database/ldap.readonly|View LDAP persistence configuration|
|https://jans.io/oauth/config/database/ldap.write|Edit LDAP persistence configuration|
|https://jans.io/oauth/config/database/ldap.delete|Delete LDAP persistence configuration|
|https://jans.io/oauth/config/jwks.readonly|View JWKS|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/role.readonly|View Admin UI Roles|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/role.write|Edit Admin UI Roles|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/role.delete|Delete Admin UI Roles|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.readonly|View Admin UI Permissions|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.write|Edit Admin UI Permissions|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/permission.delete|Delete Admin UI Permissions|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.readonly|View Role-Permission Mapping|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.write|Edit Role-Permission Mapping|
|https://jans.io/oauth/jans-auth-server/config/adminui/user/rolePermissionMapping.delete|Delete Role-Permission Mapping|

## Custom Scripts

[Custom Scripts](https://docs.jans.io/head/admin/developer/scripts/) are used to implement custom business logic for authentication, authorization, client registration, cache refresh, scopes, token revocation etc. The Janssen Authentication Server leverages Custom Scripts when implemented can facilitate complex business workflows without changing the server code. Gluu Flex Admin UI provides the interface to add/edit/delete custom scripts.

![image](../../assets/admin-ui/custom-scripts.png)

### Custom Scripts fields descriptions

- **INUM:** Unique id identifying the script.
- **Name:** Name of the custom script. Only letters, digits and underscores are allowed.
- **Description:** Description of the script.
- **Select SAML ACRS:** The SAML parameter Authentication Context Requests (ACRS).
- **Script Type:** The type of the script (e.g. PERSON_AUTHENTICATION, INTROSPECTION, APPLICATION_SESSION, CLIENT_REGISTRATION etc).
- **Programming Language:** Programming language of the custom script (e.g. Java and Jython).
- **Location Type:** The location of the script, either database or file.
- **Level:** The level describes how secure and reliable the script is.
- **Custom properties (key/value):** Custom properties that can be used in the script.
- **Script:** Script content.
- **Enable:** Field set to enable or disable the script.

## MAU Graph

This is a line graph showing month-wise active users under a selected date range.

![image](../../assets/admin-ui/mau.png)

