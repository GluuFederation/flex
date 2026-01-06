---
tags:
  - administration
  - admin-ui
  - test
  - SAML
  - SSO
  - inbound
  - keycloak
---

# SAML

## Description

Gluu Flex supports SAML-based SSO by integrating with external SPs through the Keycloak (KC) module. Through the Admin UI, administrators can add and manage SAML Service Providers by importing their metadata and configuring which user attributes to release. The Admin UI provides a user-friendly interface to simplify the setup and testing of SAML SSO connections with external service providers.

For more information, click here to refer to the [official docs](https://docs.jans.io/stable/janssen-server/keycloak/keycloak-saml-sso).


## Configuration

![image](../../assets/admin-ui/saml-configuration.png)


1. Selected IDP

    * Choose which Identity Provider (IdP) configuration to use from the available
    configurations.

3. Ignore Validation
    * A toggle to skip validation checks useful for testing or when metadata is temporarily invalid; not recommended for production because it weakens security.

## Create Identity Provider (IDP) Form

![image](../../assets/admin-ui/admin-ui-create-idp-1.png)
![image](../../assets/admin-ui/admin-ui-create-idp-2.png)


5. Upload Metadata file

    * This toggle enables uploading an .xml or .json metadata file from the Identity Provider (IDP) instead of manually entering configuration fields.

6. Entity ID

    * The Entity ID is a globally unique identifier (URI or URL) for the Identity Provider (IDP). It is used by the Service Provider (SP) to identify the IDP in SAML communications.
    * It ensures that the correct IDP is used for authentication during SSO processes. The value must exactly match the IDP’s configured entity ID from its metadata.


7. NameID Policy Format

    * This field specifies the format of the `NameID` element in the SAML assertion, which identifies the user being authenticated. It determines how the subject (user) identity is structured and communicated to the Service Provider.
    * It allows the administrator to control the type of identifier used for the user, ensuring compatibility with the expectations of the Service Provider (SP).

8. Single SignOn Service URL
    * URL endpoint on the IdP where authentication requests (AuthnRequest) are sent.
    * Gluu Flex will send SAML AuthnRequests to this URL to initiate login.

9. Single Logout Service URL
    * URL endpoint on the IdP for Single‑Logout (SLO), if supported.
    * For logout flows: to tell IdP when SP wants to log the user out globally.

10. Signing Certificate
    * Public key certificate of the IdP used to verify signatures on SAML responses/assertions.

11. Encryption Certificate
    * Public key certificate used (if used) to decrypt encrypted parts of SAML assertion.

12. Principal Attribute
    * The attribute in the SAML assertion that will be used as the principal / username (or user identifier).

13. Principal Type

    * The type of principal (for example, “User”, “Group”, etc.) or possibly the format (email / username).


## Create Service Provider (SP) Form

![image](../../assets/admin-ui/admin-ui-create-service-provider.png)

1. Name

    * Internal unique identifier for the Service Provider.

4. Enable TR

    * Toggle to enable a feature called “TR” (Trust Relationship).
    * Activate or deactivate the SP; you can disable SP if you don’t want to accept assertions from it temporarily.

5. Service Provider Logout URL

    * The URL endpoint where the SP expects logout notifications or post‑logout redirect.
    * Facilitates Single Logout functionality, so user sessions are cleaned up properly across systems.

6. Released Attributes

    * List of user attributes that will be included in SAML assertions for this SP.

7. Metadata Location

    * Whether SP metadata is provided via file upload, URL, etc.
    

        ![image](../../assets/admin-ui/admin-ui-create-service-provider-1.png)


      1. Single Logout Service URL
          * The endpoint where logout requests or responses are sent during SAML Single Logout.
          * Enables session termination on the SP side after IdP-initiated logout, ensuring consistent session cleanup.
      2. Entity ID
          * Unique identifier for the SP, typically a URL or URN.
      3. Name ID Format
          * Specifies the format of the NameID used in assertions (e.g. email, persistent).
      4. Jans Assertion Consumer Service GET URL
          * ACS endpoint using the HTTP GET binding. The SP receives assertions at this URL.
      5. Jans Assertion Consumer Service POST URL
          * ACS endpoint using the HTTP POST binding. This is where the IdP sends SAML responses.
