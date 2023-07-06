---
tags:
- Super Gluu
- administration
- configuration
---

# Super Gluu Administration Guide

To configure and enable Super Gluu 2FA, Gluu Flex administrator need to perform below operations using Flex UI. 

## Configuration Using Flex UI

 - Log into Flex UI
 - Navigate to `Admin` > `Scripts`
 - Enable `super_gluu` script 
 
   ![image](../../assets/supergluu/admin-guide/Flex_UI_SuperGluu_script.png)

 - Navigate to `FIDO` and Enable SuperGluu
 
   ![image](../../assets/supergluu/admin-guide/Flex_Super_Gluu_2.png)

At this point, Super Gluu module on Gluu Flex is configured and ready. 

### Test 2FA Authentication Flow

To test Super Gluu configuration from end-to-end, an administrator can follow the steps below: 

 - Change the `default authentication method` to 'super_gluu' using [this guide](https://docs.jans.io/v1.0.14/admin/config-guide/jans-cli/cli-default-authentication-method/)
 - Keep this browser window active so you can revert authentication method to default one.
 - Prepare your mobile device by following [Super Gluu mobile app user guide](https://github.com/GluuFederation/flex/blob/docs-sg-changes/docs/supergluu/user-guide/index.md)
 - Perform tests using a test user 

## Remove Advertisements From Super Gluu Mobile Application

To remove advertisements from Super Gluu mobile app, a Gluu license file needs to be added to the corresponding 
Gluu Flex Server.

Follow these instructions to add license file: 

1. Inside the Gluu Flex Server chroot, create a new license file titled `/etc/certs/super_gluu_license.json` and add 
the license details.

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
