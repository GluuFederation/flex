---
tags:
- installation
- license
---

# Overview

Gluu Flex Admin UI is a reactive web interface to simplify the management and configuration of your Auth Server. It is one of the key services of Gluu Flex that enables viewing and editing configuration properties, interception scripts, clients, users, metrics, etc at one place.

## Installation

Gluu Flex can be installed using [VM installer](../../install/vm-install/vm-requirements.md) or using [Rancher](../recipes/getting-started-rancher.md) on Cloud Native.

During installation, we need to provide a Software Statement Assertion (SSA) which is used by Admin UI to register an OIDC client to access license APIs. Check the following [guide](../../install/software-statements/ssa.md) for the steps to issue SSA from the Agama Lab web interface.

![image](../../assets/admin-ui/install-ssa.png)

## Flex License

After installation Admin UI can be accessed on `https://hostname/admin` (the `hostname` is provided during setup). This web interface can be accessed only after submitting a valid `license key` issue from Gluu.

User can also generate a 30 days trial license. To enjoy long time uninterrupted access to Admin UI get a flex license-key issued from Gluu.     

The application will not ask for license key again until it is expired.

![image](../../assets/admin-ui/license-key-submit.png)

After license activation, the user can log into Admin UI using the default username (`admin`) and the `password` (the admin password provided during installation).

![image](../../assets/admin-ui/login-page.png)



