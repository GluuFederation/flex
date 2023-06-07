# Accounts Linking
## Overview
The Accounts Linking plugin allows users to link and delink their local account with an existing account at third-party social providers like GitHub, Facebook, and Google, or even external customer or partner OIDC OPs or SAML IDPs. 

## Requirements

- A Gluu Server with Passport installed. [Install Gluu](https://gluu.org/docs/ce/installation-guide) 

- The plugin jar file that matches the version of your Casa and Gluu Server installation.

- Passport configured to support your target external authentication providers, e.g. GitHub, Google, etc. Check the Gluu Server docs for instructions (make sure the docs version matches your Gluu version):

    - Passport for external [SAML IDPs](https://www.gluu.org/docs/ce/authn-guide/inbound-saml-passport/)    
    - Passport for external [OAuth/OIDC providers](https://www.gluu.org/docs/ce/authn-guide/passport/)   
  
## Installation

Once you have configured and tested the integration(s) with the target external providers, install the Accounts Linking plugin by following the steps below:

1. [Download the plugin](https://maven.gluu.org/maven/org/gluu/casa/plugins/account-linking/4.5.0.Final/account-linking-4.5.0.Final-jar-with-dependencies.jar)

1. Log in to Casa using an administrator account

1. Visit `Administration console` > `Casa plugins`

    ![plugins page](../img/plugins/plugins314.png)

1. Click on `Add a plugin...` and select the plugin jar file

1. Click on `Add` 

So far, users will be able to see an "Accounts linking" menu added. From there they can link and unlink accounts while staying inside Casa. The following section describes how to allow users to choose an external provider to log in to Casa and create an account in the Gluu Server (inbound identity).

!!! Note
    When a user logs in for the first time through an external provider, a new user entry is created in the Gluu Server (AKA a local account) linked to the provider. A user won't be able to unlink an account until he sets a password: the plugin bundles a form that allows users to perform this action.

## Alter the authentication flow

These are the steps required so the Casa authentication flow does not require users to enter a username and password combination, but leverages the credentials already existing in an external provider.

### Add custom parameters

Add a custom parameter for authorization requests in your Gluu Server: 

1. In oxTrust go to `Configuration` > `JSON Configuration` > `oxAuth Configuration`

1. Under `authorizationRequestCustomAllowedParameters`, add one item. Choose a name for it, such as `custParamCasaPassport`

1. Press the save button at the bottom of the page

!!! Note
    By default every time a user logs in via a external provider, an update takes place in his profile: all attributes released from the external provider to oxAuth are updated in local database. Attributes not received are flushed. If you don't want the update to take place, please also add a oxAuth custom param with name `skipPassportProfileUpdate`.

### Activate the custom scripts needed

While configuring Passport earlier, you enabled one or more authentication scripts (ie. `passport_social`/`passport_saml`). In oxTrust, navigate to `Configuration` > `Manage custom scripts` and for every script you enabled, add a custom property with name `authz_req_param_provider` and set its value to the custom authorization parameter created earlier (eg. `custParamCasaPassport`).

### Update Casa custom script

Since the *standard* authentication flow will be different, the `casa` script contents must be updated. Expand the row corresponding to Casa script, back up the current script contents and then replace with those [here](https://github.com/GluuFederation/casa/raw/version_4.5.0/plugins/account-linking/extras/casa.py).

Press the update button at the bottom of the page.

The login page must be updated so it dynamically loads the external providers in a way that users can choose a provider to log in/create an account:

1. Log in to the chroot
1. `cd` to `/opt/gluu/jetty/oxauth/custom/pages`
1. Run `mkdir casa && cd casa` 
1. Run `wget https://github.com/GluuFederation/casa/raw/version_4.5.0/plugins/account-linking/extras/login.xhtml`

## User guide

For information on how to use the plugin, see the [User Guide](../user-guide.md)
