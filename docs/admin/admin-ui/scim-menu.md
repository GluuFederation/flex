---
tags:
  - administration
  - admin-ui
  - scim
---

# SCIM Admin Guide

**System for Cross-domain Identity Management (SCIM)** is a standard that simplifies the exchange of user identity information across different domains. Developers can think of SCIM as a RESTful API that provides CRUD operations—create, read, update, and delete—on user and group resources. SCIM defines reference schemas for users and groups, along with REST APIs to manage them. For more details, refer to the official specification documents: [RFC 7642](https://tools.ietf.org/html/rfc7642), [RFC 7643](https://tools.ietf.org/html/rfc7643), and [RFC 7644](https://tools.ietf.org/html/rfc7644).

## SCIM Use Cases

Some common use cases for SCIM in enterprise environments include:

- **User Provisioning**: Automatically creating and updating user accounts from identity sources like HR systems.
- **Group Synchronization**: Managing group memberships across services to control access.
- **Self-Service Portals**: Enabling users to update their own profile attributes.
- **Single Sign-On (SSO) Integration**: Aligning SCIM data with identity federation protocols.

To build a production-grade integration with SCIM, it's critical to understand both the specification (RFC 7642–7644) and Janssen's implementation specifics.

For more information, click here to refer to the [official docs](https://docs.jans.io/stable/janssen-server/scim/).
