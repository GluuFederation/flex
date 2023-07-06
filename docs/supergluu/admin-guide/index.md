# Super Gluu Admin Guide

## Implementation
To configure and enable Super Gluu 2FA, Flex administrator need to perform below operations. 

### Configuration in Flex

 - Log into Flex UI
 - `Admin` > `Scripts`
 - Enable `super_gluu` script ![image](../../assets/supergluu/admin-guide/Flex_UI_SuperGluu_script.png)

 - Go to `FIDO` and Enable SuperGluu. ![image](../../assets/supergluu/admin-guide/Flex_Super_Gluu_2.png)

### Test Authentication

After above modifications administrator might want to test their setup. To do that: 

 - Change `default authentication method` to 'super_gluu'. How to is available [here](https://docs.jans.io/v1.0.14/admin/config-guide/jans-cli/cli-default-authentication-method/)
 - Keep this browser window active so you can revert authentication method to default one.
 - Prepare your mobile device by following [User Guide](https://github.com/GluuFederation/flex/blob/docs-sg-changes/docs/supergluu/user-guide/index.md).
 - Test your setup 

## Ad removal  

To remove advertisements from Super Gluu, a Gluu license file needs to be added to the corresponding Gluu Server.

Follow these instructions: 

1. Inside the Gluu Server chroot, create a new license file titled `/etc/certs/super_gluu_license.json` and add the license details.

      For example:

      Sample `super_gluu_license.json` file:
   
            {
            "public_key":"57lg..w==",
            "public_password":"RH..Ob",
            "license":"rO..MQs",
            "license_password":"Qw..w4"
            }

1. In oxTrust, navigate to `Configuration` > `Manage Custom Scripts` > `Person Authentication`. Find and expand the Super Gluu script, and add the following custom property:


      <table>
      <th>Property name</th><th>Property value</th>
      <tr><td>license_file</td><td>/etc/certs/super_gluu_license.json</tr>
      </table>

1. Click the Update button to save the settings. 

1. Turn on Super Gluu 2FA for your server, as discussed in the [Gluu Server docs](https://gluu.org/docs/ce/authn-guide/supergluu/)

1. Enroll Super Gluu for a user account, and ads will be removed from the app on that device. 

All users who enroll Super Gluu against this server should now see advertisements removed from the app on their device. 
