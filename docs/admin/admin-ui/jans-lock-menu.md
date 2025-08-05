---
tags:
  - administration
  - admin-ui
  - cedar
  - jans-lock
  - cedarling
  - authorization
---

# Janssen Lock

[Janssen Lock](https://docs.jans.io/stable/janssen-server/lock/) (or just "Lock") provides a centralized control plane for domains to use [Cedar](https://www.cedarpolicy.com/en) to secure a network of distributed applications and audit the activity of both people and software.

Gluu Flex Admin UI enables administrators to manage Jans Lock settings, including logging configuration, metric reporter setup, and policy management, through a streamlined and user-friendly interface.

## Overview

Jans Lock is built for environments running multiple Cedarling, enabling bi-directional communication. Cedarling send data to the Lock Server, while the server can push updates back. Notifications are sent using **Server-Sent Events (SSE)**, and requests from Cedarling use HTTP POST to OAuth-protected endpoints.

### Component

A standard Lock setup includes the following software component:

- **[Cedarling](https://docs.jans.io/stable/cedarling/)**: A WebAssembly module running the [Amazon Rust Cedar engine](https://github.com/cedar-policy/cedar) to validate JWTs.
- **[Lock Server](https://docs.jans.io/stable/janssen-server/lock/lock-server/)**: A Java Weld application that links transient Cedarling to the enterprise infrastructure.
- **Jans Auth Server**: Provides OAuth and OpenID Connect services.

![image](https://docs.jans.io/stable/assets/lock-wasm-lock-server-OP.jpg)

For more information, please click [here.](https://docs.jans.io/stable/janssen-server/lock/)

Lock Server - Janssen Documentation
Janssen Project Deployment and Operation References
