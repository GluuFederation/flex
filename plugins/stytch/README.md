# Integrating Stytch's SMS OTP authentication with Casa

## Stytch Web Service
Multi-factor authentication from Stytch protects your applications by using a second source of validation, like a phone OTP to verify user identity before granting access.

 This document will explain how to use Casa's [Stytch  interception script](https://github.com/GluuFederation/community-edition-setup/tree/master/static/casa/scripts/casa-external_stytch.py) along with a Plugin in Casa to enroll a user's phone number and use the received SMS OTP as a method for 2FA. 



## Prerequisites
- A Gluu Server ([installation instructions](./installation-guide/index.md)).
- [Casa's Stytch interception script](https://github.com/GluuFederation/community-edition-setup/tree/master/static/casa/scripts/casa-external_stytch.py).
- An account with [Stytch](https://stytch.com/).   

## Configure Stytch Account

1. [Sign up](Stytch) for a Stytch account.

2. Upon registration, you can create the PROJECT_ID and SECRET https://stytch.com/dashboard/api-keys.

## Stytch Documentation

You can find all API reference at http://stytch.com/docs and http://stytch.com/docs/api. 

## Script configurations

Log into oxTrust, and go to `Configuration` > `Person Authentication scripts` > `Add custom script configuration`. 
### Script contents

Download this [file](https://github.com/GluuFederation/community-edition-setup/tree/master/static/casa/scripts/casa-external_stytch.py) and copy its contents in the `Script` form field.

## Properties

The custom script has the following properties:    
|	Property	        |	Description		                                      |	Example	|
|-----------------------|-------------------------------|---------------|
|SMS_ENDPOINT		    |https://stytch.com/docs/api/send-otp-by-sms              |`https://test.stytch.com/v1/otps/sms/send`|
|AUTH_ENDPOINT 		    |https://stytch.com/docs/api/authenticate-otp             |`https://test.stytch.com/v1/otps/authenticate`|
|ENROLL_ENDPOINT	    |https://stytch.com/docs/api/log-in-or-create-user-by-sms |`https://test.stytch.com/v1/otps/sms/login_or_create`|
|DELETE_USER_ENDPOINT   |https://stytch.com/docs/api/log-in-or-create-user-by-sms |`https://test.stytch.com/v1/users/`|
|PROJECT_ID 		    |Project id provided by Stytch.                           |`project-test-dd1403b3-dd92-33c6-91dd-ddcde970a61e`|
|SECRET		            |secret provided by Stytch.                               |`secret-test-dd1403b3-dd92-33c6-91dd-ddcde970a61e`|



### Save changes

Click on `Enable` under the script contents box, and press `Update` at the bottom of the page.


## Plugin installation


### Add the plugin to Casa

1. [Download the plugin](https://ox.gluu.org/maven/org/gluu/casa/plugins/stytch-plugin/4.3.Final/stytch-plugin-4.3.Final-jar-with-dependencies.jar)

1. Log in to Casa using an administrator account

1. Visit `Administration console` > `Casa plugins`

1. Click on `Add a plugin...` and select the plugin jar file

1. Click on `Add`

Alternatively you can log into chroot and copy the jar file directly to `/opt/gluu/jetty/casa/plugins`.

### Enable the authentication method

Wait for one minute, then visit `Administration Console` > `Enabled methods` and tick `stytch`. On the right, the plugin will be selected by default. Finally save the changes.

## Testing
So far, users that log into Casa should be able to see a new entry "Stytch credentials" that will appear under "2FA credentials" menu on the left hand side. From there they can enroll their phone numbers the steps of which are self explanatory. Follow the instructions on the web page.


### Use the Stytch credential as a second factor
Ensure you have added another credential, hopefully of a different kind, for example a mobile phone number or an OTP token. Then visit the home page and click the toggle to turn 2FA on and logout.
Try to access the application once more and supply the username and password for the account recently used to enroll the Stytch credential. Depending on the numeric level assigned to the `stytch` script, you will be prompted for a different factor, for instance, to enter an OTP code. If so, click on `Try an alternative way to sign in` and click on `Stytch credential`.


Follow the instructions on the screen for verification of SMS OTP.

Finally you will be redirected and get access to the application.
