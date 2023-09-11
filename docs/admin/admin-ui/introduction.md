---
tags:
- administration
- admin-ui
- installation
- license
---

# Gluu Flex Admin UI

Gluu Flex Admin UI is a web interface to simplify the management and configuration of your Authentication Server. It is one of the key services of Gluu Flex that enables viewing and editing of configuration properties, interception scripts, clients, users, metrics etc in one place. This user-friendly interface facilitates interaction with the Jans Auth Server through a REST API layer known as the Jans Config API.

## Installation

Gluu Flex can be installed using [VM installer](../../install/vm-install/vm-requirements.md) or using [Rancher](../recipes/getting-started-rancher.md) on Cloud Native.

During installation, we need to provide a Software Statement Assertion (SSA) which is used by Admin UI to register an OIDC client to access license APIs. Check the following [guide](../../install/software-statements/ssa.md) for the steps to issue SSA from the [Agama Lab](https://cloud.gluu.org/agama-lab) web interface.

![image](../../assets/admin-ui/install-ssa.png)

## Gluu Flex License

After installation Admin UI can be accessed on `https://hostname/admin` (the `hostname` is provided during setup). This web interface can be accessed only after subscribing Admin UI license from Agama Lab.

There is a provision to generate a 30-day free trial license of Gluu Flex which will help users to enter and understand this web interface. To enjoy long-time uninterrupted access to Admin UI get a license key issued from Gluu. Once a valid license key is submitted, the application will not ask for a license key again until the submitted key's validity is expired.

![image](../../assets/admin-ui/trial-license.png)

After license activation, the user can log into Gluu Flex Admin UI using the default username (`admin`) and the `password` (the admin password provided during installation).

![image](../../assets/admin-ui/login-page.png)

## Flex services dependencies

Gluu Flex Admin UI depends on following Flex services:

- Janssen Config API service (jans-config-api.service) 
- The Apache HTTP Server (apache2.service) 

