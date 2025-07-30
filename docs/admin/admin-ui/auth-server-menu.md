---
tags:
  - administration
  - admin-ui
  - auth server
  - sessions
  - configuration
  - keys
  - logging
  - clients
  - scopes
---

# Auth Server Menu

The **Auth Server** menu covers the following important sub-menus to configure and manage Auth server.

- Sessions
- Server configuration
- Keys
- Logging
- Clients
- Scopes
- Enabled Acrs
- Agama deployment

## Auth Server Configuration Properties

The auth server [configuration properties](https://docs.jans.io/head/admin/reference/json/properties/janssenauthserver-properties/) can be updated using GUI.

![image](../../assets/admin-ui/auth-server-configuration.png)

## Agama

This menu addresses deployment of [Agama](https://docs.jans.io/head/agama/introduction/) project packages (file with
.gama extension). To make sure that package is untempered, the file containing sha256 checksum also need to be uploaded on UI.

![image](../../assets/admin-ui/agama-deployment.png)

The project name, description, version, deployment start/end date-time and deployment error (if any) can be seen on details popup of the record. User can export sample and current configuration or import configuration.

![image](../../assets/admin-ui/gama-details.png)

![image](../../assets/admin-ui/export-gama-config.png)
