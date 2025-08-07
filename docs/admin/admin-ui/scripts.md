---
tags:
  - administration
  - admin-ui
  - admin
  - role
  - permission
  - custom scripts
  - mau
---

# Custom Scripts

[Custom Scripts](https://docs.jans.io/stable/janssen-server/developer/scripts/) are used to implement custom business logic for authentication, authorization, client registration, cache refresh, scopes, token revocation etc.

The Janssen Authentication Server leverages Custom Scripts when implemented can facilitate complex business workflows without
changing the server code. Gluu Flex Admin UI provides the interface to add/edit/delete custom scripts.

![image](../../assets/admin-ui/custom-scripts.png)

## Custom Scripts fields descriptions

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
