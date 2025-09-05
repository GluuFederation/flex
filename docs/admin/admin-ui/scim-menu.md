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

  * The Base DN specifies the root distinguished name in the LDAP directory where SCIM operations begin. It restricts SCIM searches, modifications, and provisioning to users and groups within this subtree, helping maintain organizational boundaries and improving directory performance. 
  * This setting ensures that identity operations are scoped and controlled for security, compliance, and clarity within large organizations.

**Application URL**

  * The Application URL is the fully qualified address for accessing the Janssen instance. It is crucial for integrations, allowing external systems to locate and communicate with the specific application for SCIM provisioning, authentication, or callbacks. 
  * Defines the endpoint for external services and identity clients, enabling smooth interoperability and accurate provisioning workflows.

**Base Endpoint**

  * Base Endpoint defines the path segment where SCIM API requests are received, such as `/jans-scim/restv1`. This groups all SCIM user/group management operations under one URL for standardized API access.
  * By clearly defining the API base path, this configuration removes ambiguity for developers and integrators, simplifying integration processes and reducing support burden when troubleshooting connectivity issues.


**Person Custom Object Class**

  * This field denotes the LDAP objectClass or objectClass list that SCIM uses when creating or provisioning person objects in the directory. It enables extended user schemas and custom attributes, supporting unique enterprise identity models. No default value is set.

  * Allows organizations to adapt SCIM provisioning for custom business requirements and compatibility with legacy or specialized systems.


**Auth Issuer**


  * The Auth Issuer field sets the URI for the OAuth 2.0 or OpenID Connect provider used to validate SCIM API requests. All issued access tokens are matched against this trusted issuer to enforce secure authentication.

  * Ensures SCIM operations are securely authenticated, protecting against unauthorized or forged requests

**Max Count**

  * Max Count controls the maximum number of directory entries (such as users or groups) returned per SCIM search or listing request. The default value is `200`.

  * Prevents oversized responses, improves performance, and enables efficient pagination for applications accessing large directories.


**Bulk Max Operations**

  * Bulk Max Operations establishes the limit on how many create, update, or delete actions are accepted in a single SCIM bulk request. The default value is `30`.
  * Protects the identity platform from resource exhaustion and runaway automation, maintaining operational stability during batch provisioning.


**Bulk Max Payload Size**
  
  * This is the maximum byte size allowed for bulk SCIM requests. Any batch exceeding this size will be rejected. The default value is 3072000 bytes (around 3 MB).
  * Guards against excessively large requests, securing system resources and preventing denial-of-service situations.


**User Extension Schema URI**

  * This field identifies the SCIM schema URI used for custom user attributes. The default value provided is `urn:ietf:params:scim:schemas:extension:gluu:2.0:User`.

  * Supports extended identity models, allowing organizations to provision, synchronize, and store tailored user attributes needed for compliance and business needs.


**Logging Level**

  * Logging Level sets the verbosity of SCIM logs, with possible values such as TRACE, DEBUG, INFO, WARN, ERROR, FATAL, or OFF. The default level is `INFO`
  * Tuning the log level aids in troubleshooting, monitoring, and compliance by controlling how much detail is recorded about service operations.


**Logging Layout**

  * This field establishes the format for log messages, which could be plain text, structured (e.g., JSON), or formatted for integration with external systems.
  * Ensures log compatibility with enterprise monitoring tools, supporting easier parsing, correlation, and alerting.

**External Logger Configuration**

  * Specifies the file or path for integrating an external logger configuration (such as Log4j2).
  * Centralizes event auditing and monitoring by sending SCIM logs to enterprise-wide logging systems.


**Metric Reporter Interval**

  * Defines the frequency in seconds with which SCIM gathers and reports operational performance metrics.

  * Gives operations and support teams regular insights into service performance and activity, enabling proactive response to incidents.


**Metric Reporter Keep Data Days**

* Controls the retention duration, in days, for storing metric data and operational statistics.
* Facilitates compliance, troubleshooting, and trend analysis through configurable historical data retention.


**Metric Reporter Enabled**

  * A boolean toggle to activate SCIM service metrics collection and reporting. 

  * Allows organizations to monitor health, usage, and trends, supporting proactive maintenance and decision-making.

**Disable JDK Logger**

* A boolean switch for disabling native Java (JDK) logging if another logger is configured.
* Prevents redundant and duplicate log entries, maintaining log clarity and reducing resource overhead.



**Use Local Cache**

  * This field enables or disables local in-memory caching for SCIM operations, improving query response times and lowering directory backend load.
  * Optimizes repeated read operations in high-traffic scenarios, boosting efficiency and scalability of SCIM provisioning.


Once all parameters are set, click the Apply button at the bottom of the page to save the configuration changes.

