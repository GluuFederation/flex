Casa.py is a `PersonAuthenticationType` script which orchestrates a 2FA flow by delegating specific implementation details of authentication methods to other scripts. This allows the flow to present users with alternatives in case some credential is not working as expected or is lost. Specific behavior depends on how Casa application is parameterized, please see ["About Two-Factor Authentication"](https://gluu.org/docs/casa/administration/2fa-basics/) for an introduction.

An important restriction to account is that users must present a username and password combination before any form of strong authentication can take place in the flow.

This custom script is aligned with how the application is configured by the administrator. This means the real potential of the script is perceived in the context of an actual casa deployment. The behavior of the script depends on a variety of settings (specially 2FA-related) that can be tweaked using Casa's administration console or via the configuration API.

Among others, the script performs actions such as:

- Identification of user device 
- Geolocation of user IP
- Determine whether 2FA should take place
- Compute suitable 2FA mechanisms the user can be prompted depending on the context
        
## Required files

The following are the assets involved in casa authentication script:

- Main script: [Here](https://github.com/GluuFederation/flex/tree/main/casa/extras/Casa.py)
- Dependant scripts: [Here](https://github.com/GluuFederation/flex/tree/main/casa/extras/). These are bundled with a default installation; more scripts may be required depending on the authentication mechanisms to support. Janssen installer already copies the default scripts in their destination: `/opt/jans/python/libs`
- XHTML templates: `[https://github.com/GluuFederation/oxAuth/tree/version_<version>/Server/src/main/webapp/casa](https://github.com/JanssenProject/jans/tree/main/jans-auth-server/server/src/main/webapp/casa)`. More files may be required depending on the authentication mechanisms to support. These files are already hosted by jans-auth web application.

## Configuration properties 

For the main script:

|Name|Description|Sample value|
|-|-|-|
|`mobile_methods`|Optional. Click [here]( https://www.gluu.org/docs/casa/administration/2fa-basics/#associated-strength-of-credentials)|otp, twilio_sms, super_gluu|
|`2fa_requisite`|Optional. Click [here]( https://gluu.org/docs/casa/administration/2fa-basics/#forcing-users-to-enroll-a-specific-credential-before-2fa-is-available)|`true`|
|`supergluu_app_id`|U2F application ID used by SuperGluu enrollments made using Casa, if any|`https://<your-host-name>/casa`|
|`u2f_app_id`|U2F application ID used by FIDO (u2f) enrollments made using Casa, if any|`https://<your-host-name>`|

Auxiliary scripts require properties on their own. You can visit [this](https://github.com/JanssenProject/jans/blob/main/docs/admin/developer/scripts/person-authentication.md#a-implementing-2fa-authentication-mechanisms) page to locate specific pages for every authentication method.


### Adding authentication mechanisms (new factors)

If the method you want to add is already supported out-of-the-box, it is a matter of enabling it: Casa's admin console [doc page](https://gluu.org/docs/casa/administration/admin-console/#enabled-methods) has the required steps. If you are planning to onboard a different mechanism more work is required. In that case, we suggest reading [this page](https://gluu.org/docs/casa/developer/authn-methods/) of Casa's developer guide.

## Flow look&feel

Casa flow pages inherit many of the design elements already set in the [custom branding](https://gluu.org/docs/casa/plugins/custom-branding/) plugin. Changes in design elements such as color scheme or custom CSS rules should take effect in flow pages immediately.

If you require a full customization of the look and feel you have to modify the flow pages. Follow [this](https://github.com/JanssenProject/jans/blob/main/docs/admin/customization/customize-web-pages) as a guide. Account relevant pages are located in `casa` folder of jans-auth war.
