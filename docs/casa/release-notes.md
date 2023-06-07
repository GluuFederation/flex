## Release Notes

### Casa 4.2

- FIDO U2F and FIDO2 have been consolidated into a single service.
- The 2FA settings plugin has been updated for more precise control of when second-factor authentication is enabled
- New 2FA endpoints in the REST API
- New custom pages for the authentication flow to closely resemble the typical UX found in Casa
- New plugin implementing X.509 certificate authentication

### Casa 4.1 

- Application is now suitable to be supported in a manually clustered environment
- Added support for SMPP for delivery of OTP codes via SMS
- Fix UI overlaps in 2FA authentication pages
- Added support for memcached if underlying Gluu server uses it as cache provider
- Remove potential file descriptors leak

### Casa 4.0 

- Added support for FIDO2 / WebAuthn devices [Read more](user-guide.md#fido-2-security-keys).    
- Smarter 2FA: Users no longer need to select a "preferred mechanism", and are now simply prompted for the strongest enrolled credential type (e.g. FIDO > OTP). [Read more](./administration/2fa-basics.md#associated-strength-of-credentials).
- "Hot deployment" for plugins -- now plugins can be added by dropping files directly in the chroot filesystem, in addition to through the UI. [Read more](./developer/plugin-management-internals.md#hot-deployment). 
- New sample plugins for developers plus an improved developer guide. [Read more](./developer/index.md).    
- Enhanced localization support, including a language picker in the user-facing dashboard. [Read more](./administration/localization.md).     
