# Gluu Casa 4.5 Documentation

## Overview

Gluu Casa ("Casa") is a self-service web portal for end-users to manage authentication and authorization preferences for their account in a [Gluu Server](https://gluu.org/docs/gluu-server). 

For example, as people interact with an organization's digital services, they may need to:

- Enroll, delete and manage two-factor authentication (2FA) credentials for their account (e.g. FIDO security keys, mobile apps, phone numbers, etc.)
- Turn 2FA on and off
- View and manage which external apps have been authorized to access what personal data
- View trusted devices   

Casa provides a platform for people to perform these account security functions and more. 

## Two-factor authentication

The core use case for Casa is self-service 2FA. If people need to call the helpdesk every time they get a new phone or security key, supporting strong authentication becomes prohibitively expensive. 

Out-of-the-box, Casa can be used to enroll and manage the following authenticators:    

- FIDO2/U2F security keys like [Yubikeys](https://www.yubico.com/products/yubikey-hardware/)       
- Gluu's U2F push-notification mobile app, [Super Gluu](https://super.gluu.org)    
- OTP hardware cards like [these](https://www.ftsafe.com/Products/Power_Card/Standard) or dongles like [these](https://www.ftsafe.com/Products/OTP/Single_Button_OTP)      
- OTP mobile apps like Google Authenticator, FreeOTP, etc.       
- Mobile phone numbers able to receive OTPs via SMS   
- Passwords (if stored in the corresponding Gluu Server's local database, i.e. not a backend LDAP like AD)      

Additional authenticators and use cases can be supported via [custom plugins](#plugin-oriented). 

## 2FA enrollment APIs

To facilitate 2FA device enrollment during account registration, or elsewhere in an application ecosystem, Casa exposes APIs for enrolling the following types of authenticators:   

- Phone numbers for SMS OTP   
- OTP apps, cards or dongles        
- Super Gluu Android and iOS devices  
- FIDO2 security keys

Learn more in the [developer guide](./developer/index.md#apis-for-credential-enrollment).  

## Configuration via APIs

Besides a comprehensive graphical admin console, application settings can also be manipulated by means of the [configuration API](./developer/config-api.md).

## Plugin oriented

Casa is a plugin-oriented, Java web application. Existing functionality can be extended and new functionality and APIs can be introduced through plugins. 

Learn more in the [developer guide](./developer/index.md).

## Existing plugins
Gluu has written a number of plugins to extend Casa, including plugins for:

- [Consent management](./plugins/consent-management.md) 
- [Custom branding](./plugins/custom-branding.md)  
- [2FA settings](./plugins/2fa-settings.md)
- [BioID authentication](./plugins/bioid.md)
- [Duo authentication](./plugins/duo.md)
- [Account linking](./plugins/account-linking.md)
- [Browser certificate authentication](./plugins/cert-authn.md)
- Developer portal (*coming soon!*)     

For more information visit the [Casa website](https://casa.gluu.org/plugins). 

## Gluu Server integration

Casa is tightly bundled with the [Gluu Server](https://gluu.org/docs/gluu-server) identity and access management (IAM) platform. A few important notes:

- **Authentication scripts**: The Gluu Server relies on "interception scripts" to implement user authentication. Casa itself has an interception script which defines authentication logic and routes authentications to specific 2FA mechanisms which also have their own scripts. All scripts must be enabled in the Gluu Server.        

- **oxd**: Casa uses the [oxd OAuth 2.0 client software](https://oxd.gluu.org) to leverage the Gluu Server for authentication. oxd can be deployed during Casa installation.  

More detailed information is available in the Admin Guide, linked [below](#admin-guide).

## User roles

There are two types of users in Gluu Casa:

- **Admin users**: Any user in the `Managers Group` in the Gluu Server   

- **Regular users**: Any user in the Gluu Server  

Admin users have access to the Casa [admin console](./administration/admin-console.md). All users can manage their 2FA credentials, as outlined in the [user guide](./user-guide.md).  

## Get started

Use the following links to get started with Casa:  

### Admin Guide

  - [Installation](./administration/installation.md)
  - [Admin console](./administration/admin-console.md)
  - [Credentials storage](./administration/credentials-stored.md)        
  - [Custom branding](./administration/custom-branding.md)        
  - [FAQs](./administration/faq.md)            

### User Guide

- [Home](./user-guide.md)

### Developer Guide

- [Home](./developer/index.md)

## License

Gluu Casa is made available under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
