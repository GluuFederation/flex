# Gluu Casa Quick Start Guide

## Overview

Gluu Casa is a self-service web portal for end-users to manage security preferences for their account in a [Gluu Server](https://gluu.org). Follow this guide to install and configure a deployment of Casa.

## Prerequisites

Casa can be installed via Gluu Server installation. The server or VM should have at least the following minimum specs:

| CPU Unit | RAM | Disk Space | Processor Type |
|------ | ---- | ---- | ---- |
| 2  | 6 GB | 40 GB | 64 Bit |

Make sure the Gluu Server has at least the following components:

  - oxAuth OAuth2 Server
  - oxTrust admin GUI
  - Apache Web Server

## Getting started

### Install

Casa is installed on the same server or virtual machine as the Gluu Server: follow the [Casa installation instructions](./administration/installation.md#installation-via-linux-packages).  

### Configure Casa

Configuring Casa for usage requires you to enable interception scripts in the Gluu Server, activate the authentication methods in Casa, and install and configure the 2FA settings plugin. 

1. **Interception Scripts in Gluu**: Enable authentication interception scripts in the Gluu Server. Log in to oxTrust as an administrator and [enable the desired 2FA credentials](./administration/admin-console.md#enabled-methods) to be managed with Casa.

1. **Activate authentication methods in Casa**: Once the interception scripts have been enabled, they can be activated in Casa itself. Log in to Casa as an administrator and [enable the desired methods](./administration/admin-console.md#configure-casa).

1. **Setup 2FA preferences**: Use the [2FA Settings plugin](./plugins/2fa-settings.md) to set the [minimum number of credentials](./administration/admin-console.md#2fa-settings) a user must enroll among others.

### Test enrollment and 2FA

1. [Enroll](./user-guide.md#2fa-credential-details-enrollment) at least two credentials on a non-administrator user.

1. [Turn on](./user-guide.md#turn-2fa-onoff) 2FA for the account.

1. Test 2FA Authentication by logging off and logging back in. Application access should now require a second authentication factor.

### Finish configuration

Once satisfied with testing, [configure the Gluu Server](./administration/admin-console.md/#set-default-authentication-method-gluu) to log in users via Casa for all applications the server protects.

### Check out available plugins

Browse our [catalog of plugins](https://casa.gluu.org/plugins) to add features and expand Casa!.
