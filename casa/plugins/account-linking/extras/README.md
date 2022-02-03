# Integrating external identity providers in Casa

Besides installing the accounts linking plugin in Casa, the following configurations must be performed in order to properly integrate external providers in the authentication flow of Casa.

## oxAuth custom parameters

Add a custom parameter for authorization requests in your Gluu Server: 

1. In oxTrust go to `Configuration` > `Json Configuration` > `oxAuth Configuration`

1. Under `authorizationRequestCustomAllowedParameters` add one item. Choose a name for it, for instance custParamCasaPassport

1. Press the save button at the bottom of the page

**Note**: By default every time a user logs in via a external provider, an update takes place in his profile: all attributes
released from the external provider to oxAuth are updated in local LDAP. Attributes not received are flushed. If you don't
want the update to take place, please also add a oxauth custom param with name `skipPassportProfileUpdate`

## Activate the custom scripts needed

- If you are integrating social providers, activate the `passport_social` script (go to `Configuration` > `Manage custom scripts`)
- If you are interested in SAML IDPS, activate `passport_saml` script.

Both scripts can be used simultaneously. For every script you enabled, add a configuration parameter with name `authz_req_param_provider` and set its value to the custom authorization parameter created earlier (eg. custParamCasaPassport).

Press the update button at the bottom of the page.

## Copy extra files

The folder of this README contains files needed to customize the authentication flow:

- `login.xhtml`: Place this file in `/opt/gluu/jetty/oxauth/custom/pages/casa`.
- `casa.py`: Replace the contents of Casa custom script with this file. Backup original contents first somewhere.

## Check passport config

Ensure you have already installed and configured Passport with the external providers you need to support. Check passport docs to learn how to do so.
