# Email 2FA OTP Plugin

## Overview

This plugin allows the end-user to enable email-based OTP as their second factor authentication in CASA. 

## Requirement

 - Configurations in Gluu Server
 - Installed plugin jar in CASA

## Installation

### Gluu Server

We need to enable `email_2fa_core` script in Gluu Server. There are couple of configurations required as well. 

#### Script enabling

 - Log in to the Gluu Server as admin
 - Navigate to `Configuration` > `Person Authentication Scripts` > `Add custom script configuration`
    - `Name`: email_2fa_core
    - `Select SAML ACRs`: not mandatory
    - `Description`: describe use case
    - `Programming Language`: Jython
    - `Level`: depends on your policy
    - `Location`: Database
    - `Interactive`: Web
    - `Custom property(key/value)`:
       - `token_length`: 7
       - `token_lifetime`: 10
    - Take script from [here](https://raw.githubusercontent.com/GluuFederation/casa/master/plugins/email_2fa_core/extras/email_2fa_core.py) and paste it into the `Script` location
 - Save

#### Configuration

You need SSH root access to complete this configuration. 

 - Go to `/opt/gluu/jetty/oxauth/custom/pages/` and create a directory named `casa` if not available. 
 - Grab and copy two files in this `casa` location: 
   - `https://raw.githubusercontent.com/GluuFederation/casa/master/plugins/email_2fa_core/extras/otp_email.xhtml`
   - `https://raw.githubusercontent.com/GluuFederation/casa/master/plugins/email_2fa_core/extras/otp_email_prompt.xhtml`
 - Create a file named `oxauth.properties` inside `/opt/gluu/jetty/oxauth/custom/i18n/` with below content: 
   ```
    #casa plugin - email otp
    casa.email_2fa.title= Email OTP
    casa.email_2fa.text=The Email OTP method enables you to authenticate using the one-time password (OTP) that is sent to the registered email address.
    casa.email.enter=Enter the code sent via Email
    casa.email.choose=Choose an email-id to send an OTP to
    casa.email.send=Send
   ```
 - Grab the latest `casa.xhtml` from `https://github.com/GluuFederation/oxAuth/blob/master/Server/src/main/webapp/casa/casa.xhtml` and put it inside `/opt/gluu/jetty/oxauth/custom/pages/casa/`
 - Get the image file from `https://github.com/GluuFederation/oxAuth/blob/master/Server/src/main/webapp/img/email-ver.png` and put it inside `/opt/gluu/jetty/oxauth/custom/static/img` location. 

### Casa configuration

 - Log in to Casa with `https://[hostname]/casa`
 - Access `Administration console`
 - Go to `Casa Plugins`
   - Download latest `Email_2fa_core` plugin from here: https://maven.gluu.org/maven/org/gluu/casa/plugins/email_2fa_core/
 - Upload that jar file which you just downloaded
 - Wait for some time
 
Now your Email 2FA OTP is ready to use. 
