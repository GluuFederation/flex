# User Guide - Gluu Casa

## Overview

Gluu Casa ("Casa") is a self-service web portal for managing account security preferences. The primary use-case for Casa is self-service 2FA, but other use cases and functionalities can be supported via Casa plugins. The options displayed in the user portal will always depend upon which settings have been enabled by the administrator. 

## Sign in for the first time

To log in to Casa, navigate to `https://<yourdomain>/casa`.

![Login with linked account](./img/plugins/account-linking-login.png)

If you have an existing account, sign in with your standard username and password. If you do not have an account, and external account linking is enabled, you can create a local account via social login or any other authentication provider available. 

## Credential Dashboard

The credential dashboard displays widgets for each type of supported 2FA credential (e.g. U2F keys, OTP apps, etc.). Each widget includes summary details of enrolled credentials and a button to add / change credentials.

![cred-dashboard](./img/dashboard-no-creds-enrolled.png)

To manage existing credentials and enroll new credentials, click the `Manage` button: 

![cred-focused](./img/manage-highlighted.png)

## 2FA overview

### Turn 2FA on/off

After the minimum number of credentials have been enrolled (as specified by the system admin), 2FA can be turned on by clicking the switch in the Second Factor Authentication widget: 

![preferred-2fa](./img/preferred.png)

If the switch is not visible, your administrator may have configured the system so that 2FA is turned on automatically when enough credentials are available.

When prompted for 2FA, a combination of credential strength and the type of device being used to access the protected resource will be used to determine which type of strong credential is prompted first. Depending on settings specified by your admin, you can actually choose the type of credential yourself. 

As an example, if you're accessing a 2FA protected application from a laptop, and you've enrolled FIDO keys and OTP apps to secure your account, FIDO will be presented as the first option for 2FA. Alternatively, if you're accessing the protected resource from a mobile device, OTP will be presented first. The exact ranking and order will be determined by the administrator. 

If at any time the credential prompted is unavailable, you can choose to present any other previously enrolled 2FA credential type. 

![u2f-auth-plus-options](./img/gluu-u2f-authentication.png) 

To turn off 2FA, click again the switch. 

### 2FA settings & trusted devices
If enabled by the system administrator, you can set your own policy for when 2FA is enforced. To manage your settings, after enrolling credentials and turning on 2FA, click the `Manage your 2FA settings` button in the Preferred Authentication Mechanism widget. 

![2fa-settings](./img/user-facing-2fa-settings.png)

By default, you will be able to choose from a few 2FA policies:

- Always (upon every login attempt)
- If the location (e.g. city) detected in the login attempt is unrecognized
- If the device used to login is unrecognized

If you opt for 2FA based on location, device, or both, a new widget will appear to display your trusted devices. 

![2fa-settings-and-trusted-devices](./img/2fa-settings-trusted-devices.png)

### 2FA best practices

The context of an authentication attempt can determine which type of credential is most convenient to use. For instance, security keys may not be compatible with mobile phones or certain browsers. 

**To reduce the chance of account lockout**, enroll at least two different _types_ of 2FA credentials -- e.g. one security key and one OTP app; or one OTP app and one SMS phone number, etc. This way, regardless which device you're using to access a protected resource, you will have a usable option for passing strong authentication. 


## 2FA credential details & enrollment

The details page provides additional details about each enrolled credential, for instance last used, mobile operating system, and device name. Nicknames can be edited, credentials can be deleted and new credentials can be enrolled and nicknamed. 

Depending on administrator configurations, some of the below sections may nor may not be available, or sections not listed here may appear.

!!! Warning  
    When a credential is deleted, it cannot be recovered. Deleting credentials may result in 2FA being turned off. 

### FIDO 2 security keys

To add a new FIDO 2 credential, navigate to `2FA credentials` > `Security Keys`. Insert the fido key and click `Ready`. Casa will prompt to press the button on the key.

![add-fido2](./img/add-fido2.png)

Add a nickname and click `Add`. Once added, the new device will appear in a list on the same page. Click the pencil to edit the device's nickname or the trashcan to delete the device.

![added-fido2](./img/view-fido2.png)

### U2F security keys

To add a new U2F credential, navigate to `2FA credentials` > `U2F Security Keys`. Insert the U2F key and click `Ready`. Casa will prompt to press the button on the U2F key.

![add-u2f](./img/add-2fa-casa.png)

Add a nickname and click `Add`.

![nickname-u2f](./img/nickname-2fa-casa.png)

Once it's added, the new device will appear in a list on the same page. Click the pencil to edit the device's nickname or the trashcan to delete the device.

![added-u2f](./img/view-2fa-casa.png)
    
### Super Gluu Devices

To add a new Super Gluu device, navigate to `2FA credentials` > `Super Gluu Devices`.

![add-supergluu-casa](./img/add-supergluu-casa.png)

The Super Gluu enrollment QR code will pop up. Scan it in the Super Gluu app and approve the enrollment.

![enroll-supergluu-casa](./img/enroll-supergluu-casa.png)

Add a nickname for the device and click `Add`.

![nickname-supergluu-casa](./img/nickname-supergluu-casa.png)

Once it's added, the new device will appear in a list on the same page. Click the pencil to edit the device's nickname or the trashcan to delete the device.

![view-supergluu-casa](./img/view-supergluu-casa.png)

### OTP Tokens

To add a new OTP token, navigate to `2FA credentials` > `OTP Tokens`.

![add-otp-casa](./img/add-otp-casa.png)

To add a soft OTP token, choose the `Soft token` option and follow the same steps as [Super Gluu](#super-gluu-devices).

For a hard token, choose the `Hard Token` option.

![enroll-otp-casa](./img/enroll-otp-casa.png)

Add the key associated with the device and the 6 digit code. Add a nickname for the device and click `Add`.

Once it's added, the new device will appear in a list on the same page. Click the pencil to edit the device's nickname or the trashcan to delete the device.
    
### Mobile Phone Numbers

To add a new mobile phone number for one-time passcodes, navigate to `2FA credentials` > `Mobile Phone Numbers`.

![add-mobile-casa](./img/add-mobile-casa.png)

Enter a phone number and click 'Send SMS' to get the passcode. Enter the code received, nickname the mobile number, and click `Add`.

Once it's added, the new mobile number will appear in a list on the same page. Click the pencil to edit the mobile number's nickname or the trashcan to delete the mobile number.

    
## Password Reset

If enabled by the system administrator, Casa can also be used to change your password. 

Navigate to the `Password Reset` widget. Enter your current and new passwords, then click `Change password`.

![change-password](./img/password-reset-casa.png)
    
## Account linking

To manage accounts linked to outside sources, navigate to `Account Linking` on the left-hand menu. The item will only be accessible if the administrator has enabled this feature.

![Nav Bar with Account Linking active](./img/plugins/account-linking-nav-bar.png)

This presents the option to link new accounts, or edit existing linked accounts.

![Options for linked accounts](./img/plugins/account-linking-options.png)

Once an account is linked, it can be removed when necessary.

![disable or remove linked account](./img/plugins/account-linking-remove.png)


### Sign in with a linked account

If the administrator has enabled the Account Linking plugin, a list with the configured external sites will be displayed on the right panel in the authentication web page. Click on an entry to trigger the given site's authentication process. After this is finished, you will be taken back to Casa.

Note that users without a local password set yet don't have access to enroll credentials because the username + password combination is a prerequisite for multi-factor authentication. The user will be prompted to create a new password.

![Login with linked account](./img/plugins/account-linking-need-password.png)

## Consent Management

If the administrator has enabled the `Consent Management` plugin, it will appear in the navigation menu for all users. 

New entries are added automatically whenever the user is prompted for, and authorizes the release of their personal data to an application accessed using their Gluu account.   

![image](https://user-images.githubusercontent.com/5271048/53795147-f5e7d900-3ef6-11e9-9907-ee4c2be2516f.png)

### Revoking consent
When a previously granted consent decision is revoked, the user will be re-prompted to authorize release of their data if/when they attempt to access the application again. 
