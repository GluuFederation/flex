---
tags:
  - administration
  - admin-ui
  - cedar
  - jans-lock
  - cedarling
  - authorization
---

# Janssen Lock Guide

**Janssen Lock** (or just **Lock**) provides a centralized control plane that uses [Cedar](https://cedarpolicy.com/) to secure a network of distributed applications and audit activity of both users and systems.

## Overview

A typical Lock topology includes:

- **Cedarling**: A WebAssembly (WASM) module running the Amazon Rust Cedar engine to validate JWTs.
- **Lock Server**: A Java Weld application that communicates with ephemeral Cedarlings.
- **Jans Auth Server**: Provides OAuth and OpenID Connect services.

Communication is bi-directional. Cedarlings can send data to the Lock Server, and the Lock Server can push policy and config updates to Cedarlings using **Server-Sent Events (SSE)**.

![image](../../assets/admin-ui/jans.png)

## Authorization Roles in Lock

Lock aligns with distributed authorization architecture as defined in standards like XACML and RFC 2409:

| Role                        | Acronym | Description                                      | Lock Equivalent     |
| --------------------------- | ------- | ------------------------------------------------ | ------------------- |
| Policy Decision Point       | PDP     | Evaluates access requests against policies       | **Cedarling**       |
| Policy Information Point    | PIP     | Provides data such as user, roles, resource info | **JWT Tokens**      |
| Policy Enforcement Point    | PEP     | Web/API that asks PDP if access is allowed       | **Application**     |
| Policy Administration Point | PAP     | Where admins define policies and roles           | **Jans Config API** |
| Policy Retrieval Point      | PRP     | Stores policies and PDP configs                  | **Lock Server**     |

## Policy Store

By convention, the Cedarling loads a file named `cedarling_store.json`, which includes:

- **Schema** (base64-encoded Cedar schema)
- **Policies** (base64-encoded Cedar policy set)
- **Trusted Issuers** (list of valid token issuers)

```json
{
  "policies": "...",
  "schema": "...",
  "trusted_idps": []
}
```

## Trusted Issuer Schema

Trusted issuers define how identity providers (IDPs) integrate with Cedarling. Each trusted IDP entry guides how tokens are validated and which claims are used for building user roles and identities.

### Example Entry

```json
[
  {
    "name": "Google",
    "Description": "Consumer IDP",
    "openid_configuration_endpoint": "https://accounts.google.com/.well-known/openid-configuration",
    "access_tokens": { "trusted": true },
    "id_tokens": { "trusted": true, "principal_identifier": "email" },
    "userinfo_tokens": { "trusted": true, "role_mapping": "role" },
    "tx_tokens": { "trusted": true }
  }
]
```

## Entity Mapping in Cedarling

Entities are constructed from token claims and schema definitions. Cedarling maps them as follows:

- **Client**: Derived from the access token.
- **Application**: Created if the request specifies an application name.
- **Role**: One entity per role claim found in ID token or userinfo.
- **User**: Created from the ID token or userinfo (typically using the `sub` claim).
- **Access Token / ID Token / Userinfo Token**: Each is mapped 1:1 based on claims.
- **TrustedIssuer**: Added if defined in the policy store.
