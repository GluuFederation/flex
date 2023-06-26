---
tags:
- administration
- admin-ui
- installation
- license
---

# Gluu Flex Admin UI

Gluu Flex Admin UI is a web interface to simplify the management and configuration of your Authentication Server. It is one of the key services of Gluu Flex that enables viewing and editing of configuration properties, interception scripts, clients, users, metrics etc in one place.

## Installation

Gluu Flex can be installed using [VM installer](../../install/vm-install/vm-requirements.md) or using [Rancher](../recipes/getting-started-rancher.md) on Cloud Native.

During installation, we need to provide a Software Statement Assertion (SSA) which is used by Admin UI to register an OIDC client to access license APIs. Check the following [guide](../../install/software-statements/ssa.md) for the steps to issue SSA from the Agama Lab web interface.

![image](../../assets/admin-ui/install-ssa.png)

## Gluu Flex License

After installation Admin UI can be accessed on `https://hostname/admin` (the `hostname` is provided during setup). This web interface can be accessed only after submitting a valid `license key` issued from Gluu.

There is a provision to generate a 30-day free trial license of Gluu Flex which will help users to enter and understand this web interface. To enjoy long-time uninterrupted access to Admin UI get a license key issued from Gluu. Once a valid license key is submitted, the application will not ask for a license key again until the submitted key's validity is expired.

![image](../../assets/admin-ui/license-key-submit.png)

After license activation, the user can log into Gluu Flex Admin UI using the default username (`admin`) and the `password` (the admin password provided during installation).

![image](../../assets/admin-ui/login-page.png)



