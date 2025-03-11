---
tags:
- Super Gluu
- Introduction
---

# Super Gluu Documentation

Super Gluu is a free and secure two-factor authentication (2FA) mobile app.

Super Gluu app can be used to achieve 2FA for web and mobile applications
with [Janssen Server](https://docs.jans.io/), [Gluu Flex](https://docs.gluu.org/), and
[Gluu Server](https://gluu.org/docs/) working as authentication servers.

Super Gluu documentation is organized into the following sections:

- [User Guide](./user-guide/index.md)
- [Admin Guide](./admin-guide/index.md)
- [Developer Guide](./developer-guide/index.md)

## Compatibility

Super Gluu is compatible with all versions of Gluu Flex.

## FIDO Security
During Super Gluu authentication, the Gluu Flex does more than look at the device ID to grant access. Super Gluu uses
the Gluu Flex Server's FIDO U2F endpoints to enroll a public key. The private key is stored on the device. At
authentication time, the Gluu Flex sends a challenge-response to the device to check for the corresponding private key.
This adds an extra layer of security to Super Gluu push notification authentications.

## How to Use Super Gluu
Super Gluu is tightly bundled with Janssen.
Follow the [Flex installation guide](./../install/helm-install/README.md) to
deploy Gluu Flex, then follow the Super Gluu [admin guide](./admin-guide/index.md) to configure and begin using
Super Gluu for strong authentication.

### Workflows
Super Gluu supports multiple workflows, including:

- A one-step, passwordless authentication, where the person scans a QR code with their Super Gluu app and the Gluu Flex
  looks up which person is associated with that device.
- A two-step authentication, where the person enters their username and then receives an out-of-band push notification
  to the mobile device to authorize access (a.k.a identifier first authentication).
- A two-step authentication, where the person enters their username and password and then receives an out-of-band push
  notification to the mobile device to authorize access.

In all scenarios, users are prompted to scan a QR code on their first Super Gluu authentication to bind their device
and account. In the second and third workflows listed above, users begin receiving push notifications for all
authentications after the initial device registration process.

### Testing locally

Super Gluu security is based on SSL and therefore expects a public server with valid certificates.
To test locally on a **non-public** server, [follow these steps](../supergluu/developer-guide/index.md#testing-locally)

## Download Super Gluu
Super Gluu is available for free on the iOS and Android app marketplaces!

- [Download the Android app](https://play.google.com/store/apps/details?id=gluu.org.super.gluu)

- [Download the iOS app](https://itunes.apple.com/us/app/super-gluu/id1093479646?ls=1&mt=8)

## Contributors

The next version of Super Gluu will support localization in many languages. We'd like to extend our sincere
appreciation to the following people for helping translate Super Gluu content:

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

