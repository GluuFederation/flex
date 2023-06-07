# FIDO U2F to FIDO2 migration

Administrators offering U2F security keys as an authentication method are strongly encouraged to migrate to [FIDO2](https://fidoalliance.org/fido2/). This newer protocol is intended to provide an extended set of functionality to cover additional use-cases than U2F. Additionally FIDO2 is better supported in web browsers than FIDO U2F.

If you are already offering U2F and FIDO2 separately in Casa, migrating will allow you to consolidate security key usage into a single authentication method (credential type).

Migration consists of the following steps:

1. Conversion of existing U2F entries into FIDO2: This is an automatic process that will allow using already enrolled U2F security keys in the context of FIDO2 authentication. 
1. Enabling FIDO2 and disabling U2F custom script

## Conversion of existing entries

This process consists of creating entries under every user's `fido2_register` branch corresponding to already existing entries found under `fido` branches. See [Storage of User Credentials](./credentials-stored.md#u2f-devices).

!!! Note
    Only `active` entries not corresponding to Super Gluu enrollments are converted. Every successfully migrated U2F entry acquires the state `migrated` and thus cannot be used for U2F authentication anymore.

To perform the conversion follow these steps:

1. Download or clone Casa repository, eg. `https://github.com/GluuFederation/casa/archive/version_4.4.0.zip`
1. Extract the file contents and transfer the folder `casa/extras/fido2-migration` to the server - where Casa is running - in a temporary location.
1. `cd` to `fido2-migration` in the temporary location
1. Run `jar -xf /opt/gluu/jetty/casa/webapps/casa.war WEB-INF/lib`
1. Run `wget -P WEB-INF/lib https://maven.gluu.org/maven/org/gluu/oxcore-script/4.4.0.Final/oxcore-script-4.4.0.Final.jar
1. Run `java -cp .:WEB-INF/lib/* bsh.Interpreter script.bsh`

The script will output some feedback in the console. You can `tail` the file `log.txt` to see more details of the processing. Identifiers of failed entries (if any) are dumped to file `rejected.txt`.  

Regardless of the steps above are executed, by default Gluu Server will attempt to migrate U2F entries when users attempt to login using FIDO2 acr. For example, if a user has already enrolled a key using the FIDO2 authentication mechanism and logins to Casa using such method, all their existing U2F enrollments (if any) will be migrated, this way all security keys will be listed under the one single widget in the user's dashboard.

Something went wrong? Please open a [support](https://support.gluu.org) ticket.

## Enabling/disabling scripts

Once entries have been successfully migrated, in oxTrust visit `Configuration` > `Person authentication scripts`. Ensure to enable `fido2` and disable `u2f`. Hit `Update` at the bottom of the page.

Wait for 1 minute, then log into Casa admin console. In `Enabled authentication methods` check `fido2` and save changes. From now on, users can enroll security keys and also use their already enrolled keys seamlessly.
