Incase you are installing casa plugin for EMail OTP on Gluu Server version under 4.3.1, follow the steps below: [ WORK IN PROGRESS... ]

1. Copy this to the script on oxTrust - `https://github.com/GluuFederation/casa/blob/master/plugins/emailotp/extras/email_2fa_core.py`
1. Under `/opt/gluu/jetty/oxauth/custom/pages/casa/` copy 2 files    
   - `https://raw.githubusercontent.com/GluuFederation/casa/master/plugins/email_2fa_core/extras/otp_email.xhtml`   
   - `https://raw.githubusercontent.com/GluuFederation/casa/master/plugins/email_2fa_core/extras/otp_email_prompt.xhtml`
1. Under `/opt/gluu/jetty/oxauth/custom/i18n/` create a file `oxauth.properties` with the following content
   ```
    #casa plugin - email otp
    casa.email_2fa.title= Email OTP
    casa.email_2fa.text=The Email OTP method enables you to authenticate using the one-time password (OTP) that is sent to the registered email address.
    casa.email.enter=Enter the code sent via Email
    casa.email.choose=Choose an email-id to send an OTP to
    casa.email.send=Send
   ```
1. Under  `/opt/gluu/jetty/oxauth/custom/pages/casa/` copy the latest casa.xhtml `(https://github.com/GluuFederation/oxAuth/blob/master/Server/src/main/webapp/casa/casa.xhtml)` containing an entry for `email_2fa `

1. Copy this image file `https://github.com/GluuFederation/oxAuth/blob/master/Server/src/main/webapp/img/email-ver.png` to the location  `/opt/gluu/jetty/oxauth/custom/static/img`

Name of the script in **oxTrust** (**identity**) *Configuration*/*Person Authentication Scripts*: **email_2fa_core**.

Parameters of the script:

- **token_length**:     It determines the length of the characters of the One time Password sent to the user:
    + required parameter;
    + default value: not defined;
- **token_lifetime**:   It determines the time period for which the sent token is active:
    + required parameter;
    + default value: not defined;
- **Signer_Cert_KeyStore**: Filename of the Keystore
    + nonrequired parameter;
    + default value: value, defined in **oxTrust** (**identity**): *Configuration*/*Organization Configuration*/*SMTP Server Configuration*/*KeyStore File Path*;
        * for example: */etc/certs/smtp-keys.pkcs12*;
- **Signer_Cert_KeyStorePassword**: Keystore Password
    + nonrequired parameter;
    + default value: value, defined in **oxTrust** (**identity**): *Configuration*/*Organization Configuration*/*SMTP Server Configuration*/*KeyStore Password*;
        * for example: *tRmJpb$1_&BzlEUC7*;
- **Signer_Cert_Alias**: Alias of the Keystore.
    + nonrequired parameter;
    + default value: value, defined in **oxTrust** (**identity**): *Configuration*/*Organization Configuration*/*SMTP Server Configuration*/*KeyStore Alias*;
        * for example: *smtp_sig_ec256*;
- **Signer_SignAlgorithm**: Name of Signing Algorithm
    + nonrequired parameter;
    + default value: value, defined in **oxTrust** (**identity**): *Configuration*/*Organization Configuration*/*SMTP Server Configuration*/*Signing Algorithm*;
    + by default algirithm is used by signing of certificate from the Keystore;
        * for example: *SHA256withECDSA*
