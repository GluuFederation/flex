---
tags:
  - administration
  - admin-ui
  - admin
  - role
  - permission
  - custom scripts
  - mau
---

# Custom Scripts

[Custom Scripts](https://docs.jans.io/stable/janssen-server/developer/scripts/) are used to implement custom business logic for authentication, authorization, client registration, cache refresh, scopes, token revocation, etc.

The Janssen Authentication Server leverages custom scripts, which, when implemented, can facilitate complex business workflows without changing the server code. Gluu Flex Admin UI provides the interface to add/edit/delete custom scripts.

![image](../../assets/admin-ui/admin-ui-custom-script-1.png)
![image](../../assets/admin-ui/admin-ui-custom-script-2.png)

## Custom Scripts fields

This menu allows administrators to create, configure, and manage custom scripts.  
Custom scripts extend the server by allowing developers to plug in logic at various points such as authentication, client registration, token handling, and more.


1. INUM
    * A unique identifier for the custom script object in the system.
    * Used internally by the Janssen Server to distinguish and manage custom scripts. Each script must have a unique INUM.

2. Name
    * A user-defined name for the script.
    * Helps administrators identify and reference the script easily in the UI and logs. Only alphanumeric characters and underscores are allowed.

3. Description
    * A short summary or explanation of the script.
    * Provides context about the function or usage of the script to administrators.

4. Select SAML ACRS
    * Specifies the supported SAML Authentication Context Class References (ACRs).
    * ACRs define the authentication mechanisms supported by the script, which can be used during SAML authentication flows.

5. Script Type
    * Specifies the functional area where the script is applied.
    * Defines how and where the script is executed in the Janssen server, such as: 
        * `PERSON_AUTHENTICATION` for user login flows
        * `CLIENT_REGISTRATION` for client registration customization
        * `INTROSPECTION`, `UMA_RPT_POLICY`, etc.

5. Programming Language
      * The scripting language used for writing the custom script.
      * Determines which runtime engine to use for executing the script. Common options include:
          * Jython (Python for Java)
          * Java

6. Location Type
      * Indicates where the script is stored.
      * Allows selection between storing scripts in the:
        * `Database` (default and recommended)
        * `File` system (useful for version control or external development)

7. Interactive
      * Determines whether the script is used in an interactive web context.
      * Useful in authentication scenarios where user interaction via a web UI is required (e.g., login pages).

9. Level
      * Numeric value that indicates the security and reliability level of the script.
      * Helps in ordering and prioritizing multiple authentication mechanisms. A higher level may indicate higher assurance or preference.

10. Custom Properties (Key/Values)

      * A list of custom key-value pairs used inside the script.
      * Allows passing of dynamic parameters (like OTP type, config file path, QR code settings, etc.) to the script without hardcoding values.

11. MODULE PROPERTIES (KEY/VALUES)

      * A set of static key-value properties that define how the module (script) behaves internally. These are often used by specific scripts to define operational parameters.
      * Used to provide metadata or behavioral settings required by the module during execution. These properties can be referenced programmatically inside the script and are typically implementation-specific.

12. Script

      * The actual source code of the script.
      * Contains the logic that will be executed based on the script type. Typically written in Jython or Java.

13. Enable

      * A toggle to enable or disable the script.
      * Allows admins to turn off a script without deleting it, useful for testing or phasing out older scripts.