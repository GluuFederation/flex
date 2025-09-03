---
tags:
  - administration
  - admin-ui
  - scim
---

# SCIM Admin Guide

System for Cross-domain Identity Management, in short SCIM, is a specification that simplifies the exchange of user identity information across different domains. The Janssen Server provides an implementation for the [SCIM specification](https://docs.jans.io/stable/janssen-server/scim/).

Gluu Flex Admin UI allows administrators to view and manage the [configuration](https://docs.jans.io/stable/janssen-server/scim/config/) of the Janssen SCIM server.

## SCIM Use Cases

Some common use cases for SCIM in enterprise environments include:

- **User Provisioning**: Automatically creating and updating user accounts from identity sources like HR systems.
- **Group Synchronization**: Managing group memberships across services to control access.
- **Self-Service Portals**: Enabling users to update their own profile attributes.
- **Single Sign-On (SSO) Integration**: Aligning SCIM data with identity federation protocols.

To build a production-grade integration with SCIM, it's critical to understand both the specification (RFC 7642–7644) and Janssen's implementation specifics.


For detailed information, please refer to the official documentation [here](https://docs.jans.io/stable/janssen-server/scim/)

## SCIM Configuration 

The SCIM configuration page in the Admin UI allows administrators to manage and customize how SCIM services operate within the Janssen platform. These settings control endpoints, logging, caching, performance limits, and schema extensions. Proper configuration ensures secure, efficient, and scalable user and group management through the SCIM API.  

![image](../../assets/admin-ui/admin-ui-scim.png)

**Base DN**

  * Defines the root distinguished name (DN) in the directory where all SCIM-managed resources such as users, groups, and custom entities will be created or stored. It serves as the anchor point for SCIM operations within the LDAP tree.
  * By setting the base DN, administrators ensure that SCIM-related objects are isolated under a well-defined hierarchy. This prevents conflicts with other directory data, enforces proper organization, and simplifies data management.

**Application URL**

  * The base URL through which the SCIM service application is accessed. This URL is usually the address of the Janssen Admin UI or API gateway.
  * The application URL provides a clear entry point for applications and administrators to locate the SCIM service. It also acts as an identifier in integrations, ensuring that clients always know the correct location of the service.

**Base Endpoint**

  * Specifies the root REST API endpoint for SCIM operations. All SCIM-compliant requests (such as create, read, update, delete) are sent to this endpoint.
  * The endpoint allows external systems—like HR systems, identity providers, or provisioning tools—to interact with SCIM in a standardized way. This makes user lifecycle management interoperable and easier to integrate.

**Person Custom Object Class**

  * Defines the LDAP object class used to extend the default schema for user entries. This allows custom attributes to be added to user profiles beyond the standard SCIM schema.
  * By using a custom object class, organizations can capture additional information (such as employee ID, department code, or role metadata). This makes user records more flexible and aligned with specific business needs.

**Auth Issuer**

  * The URL of the authorization server that issues access tokens for securing SCIM API requests. It typically points to the Janssen authorization server.
  * This ensures that all incoming SCIM requests are authenticated and validated against a trusted issuer. It prevents unauthorized access to sensitive user data and maintains compliance with security standards.

**Max Count**

  * The maximum number of records that a SCIM search or query operation can return in a single response.
  * Limiting the result size helps control server performance, prevents accidental data dumps, and ensures clients receive manageable responses instead of overwhelming amounts of data.


**Bulk Max Operations**

  * Specifies the maximum number of operations (create, update, delete) that can be included in a single bulk request.
  * This prevents excessive strain on the server by limiting batch sizes. It ensures bulk requests are processed efficiently while maintaining fair resource usage across all clients.

**Bulk Max Payload Size**
  
  * The maximum payload size (in bytes) allowed for SCIM bulk requests. Any request exceeding this limit will be rejected.
  * By restricting payload size, the system prevents abuse through oversized requests and ensures stability. It also helps maintain predictable performance and avoids memory exhaustion.

**User Extension Schema URI**

  * Defines the URI that points to custom schema extensions for SCIM user resources. This allows administrators to extend the base SCIM user schema.
  * This gives organizations flexibility to define and manage custom attributes within SCIM. For example, fields like “employeeNumber” or “managerId” can be added and still conform to SCIM standards.

**Logging Level**

  * Controls the level of detail included in SCIM logs. Higher levels (like DEBUG or TRACE) capture detailed system behavior, while lower levels (like ERROR or WARN) capture only critical issues.
  * Options:TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF
  * Adjusting the logging level helps administrators troubleshoot issues effectively. During development or debugging, higher verbosity is useful, while in production, a reduced level prevents log overload.

**Logging Layout**

  * Specifies the format in which log entries are recorded. Common formats include plain text or structured formats like JSON.
  * The layout ensures logs are easy to read and compatible with external tools. For instance, JSON logs integrate smoothly with modern logging pipelines (like ELK), while text logs are simple to inspect manually.

**External Logger Configuration**

  * Allows integration with external logging frameworks or platforms. Administrators can provide specific configuration strings or JSON settings for third-party log collectors.
  * This makes it possible to centralize SCIM logs into enterprise-level logging platforms such as Splunk, Graylog, or ELK. It improves observability and supports auditing, compliance, and advanced analytics.

**Metric Reporter Interval**

  * Specifies how often (in seconds) the SCIM service reports metrics about its operations, such as performance, request counts, or error rates.
  * Frequent reporting ensures administrators always have up-to-date visibility into the service’s health. Metrics help spot issues early and optimize performance tuning.

**Metric Reporter Keep Data Days**

  * Defines the number of days metric data is stored before it is purged.
  * This prevents excessive disk usage from retaining old metrics indefinitely. At the same time, it ensures that enough history is available to analyze trends and troubleshoot problems.

**Metric Reporter Enabled**

  * Enables or disables the collection and reporting of SCIM metrics.
  * Metric reporting is crucial for monitoring system health, identifying bottlenecks, and ensuring SLAs are met. Disabling it may reduce overhead but removes visibility into performance.

**Disable JDK Logger**

  * Determines whether native Java Development Kit (JDK) logging should be disabled.
  * This prevents duplicate log entries when using other logging systems. It helps streamline logs and ensures administrators don’t waste storage on redundant messages.


**Use Local Cache**

  * Controls whether the SCIM service uses a local cache to store frequently accessed data.
  * Caching improves performance by reducing the number of repeated queries to the backend directory. It also minimizes latency for frequent operations, especially in high-traffic environments.


Once all parameters are set, click the Apply button at the bottom of the page to save the configuration changes.

