# Super Gluu Documentation

## Overview
Super Gluu is a free and secure two-factor authentication (2FA) mobile app. 

Super Gluu is tightly bundled with the [Gluu Server](https://gluu.org/gluu-server) identity and access management platform, and can be used to achieve 2FA for web and mobile applications that leverage Gluu for authentication.

Super Gluu documentation is organized into the following sections:

- [User Guide](./user-guide/index.md)
- [Admin Guide](./admin-guide/index.md)
- [Developer Guide](./developer-guide/index.md)

## Compatibility 

Super Gluu 3.1.x is compatible with Gluu Server 3.x and 4.x. 

## FIDO Security
During Super Gluu authentication, the Gluu Server does more than look at the device ID to grant access. Super Gluu uses the Gluu Server's FIDO U2F endpoints to enroll a public key. The private key is stored on the device. At authentication time, the Gluu Server sends a challenge response to the device to check for the corresponding private key. This adds an extra layer of security to Super Gluu push notification authentications. 

## How to Use Super Gluu 
Super Gluu is tightly bundled with the Gluu Server. Follow the [Gluu installation guide](https://gluu.org/docs/ce/installation-guide/) to deploy Gluu, then follow the Super Gluu [admin guide](https://gluu.org/docs/ce/authn-guide/supergluu/) to configure and begin using Super Gluu for strong authentication.

### Workflows
Super Gluu supports multiple workflows, including: 

- A one-step, passwordless authentication, where the person scans a QR code with their Super Gluu app, and the Gluu Server looks up which person is associated with that device. 

- A two-step authentication, where the person enters their username and then receives an out-of-band push notification to the mobile device to authorize access (a.k.a identifier first authentication).

- A two-step authentication, where the person enters their username and password and then receives an out-of-band push notification to the mobile device to authorize access.   

In all scenarios, users are prompted to scan a QR code on their first Super Gluu authentication to bind their device and account. In the second and third workflows listed above, users begin receiving push notifications for all authentications after the initial device registration process. 

### Testing locally 

Super Gluu security is based on SSL, and therefore expects a public server with valid certificates. To test locally on a **non-public** server, [follow these steps](./developer-guide/index.md#testing-locally)

## Download Super Gluu		
Super Gluu is available for free on the iOS and Android app marketplaces! 

 - [Download the Android app](https://play.google.com/store/apps/details?id=gluu.org.super.gluu)

 - [Download the iOS app](https://itunes.apple.com/us/app/super-gluu/id1093479646?ls=1&mt=8)

## Contributors 

The next version of Super Gluu will support localization in many languages. We'd like to extend our sincere appreciation to the following people for helping translate Super Gluu content:

- Jose Gonzalez, [Gluu](https://gluu.org)
- Gasmyr Mougang, [Gluu](https://gluu.org)
- Yumi Sano, [iBridge](https://ibrdg.co.jp/)
- Andrea Patricelli, [Tirasa](https://www.tirasa.net/)
- Yuriy Zabrovarrnay, [Gluu](https://gluu.org)
- Aliaksander Sameseu, [Gluu](https://gluu.org)
- Andre Koot, [Nixu](https://nixu.com)
- Mohammad Abudayyeh, [Gluu](https://gluu.org)
- Ganesh Dutt Sharma, [Gluu](https://gluu.org)
- Mohib Zico, [Gluu](https://gluu.org)
- Mustafa Baser, [Gluu](https://gluu.org)

If you'd like to provide translations for a language not currently supported, or see typos or grammar issues in your language of choice, please [contact us](https://gluu.org/contact).

Thanks! 
