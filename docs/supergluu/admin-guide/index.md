# Super Gluu Admin Guide

## Implementation
To configure and enable Super Gluu 2FA, read the [Gluu Server docs](https://gluu.org/docs/ce/authn-guide/supergluu/). 

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
