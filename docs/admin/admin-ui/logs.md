---
tags:
- administration
- admin-ui
- installation
- logs
---

# Gluu Flex Admin UI Logs

Log files are essential components of a web application's infrastructure as they provide valuable insights into its functioning, performance, and potential issues. Log files play a critical role in maintaining, troubleshooting, and monitoring the Gluu Flex Admin UI application. Understanding the different log types, their locations, and the process of accessing and analyzing them will empower administrators to efficiently manage the application's health and quickly address any issues that may arise.

## Log File Types

The Gluu Flex Admin UI generates two types of log files:

- **adminui.log**: This is the backend log file that captures various activities, errors, and events related to the Gluu Flex Admin UI's operation. It provides insights into the application's behavior and potential issues.
- **adminuiAudit.log**: This audit log file records user interactions, actions, and events related to administrative activities. It's particularly useful for tracking changes made to the system and ensuring accountability.

## Configuration of Log Locations

The log locations for Gluu Flex Admin UI can be configured by modifying the log4j2-adminui.xml file located at:

```text
/opt/jans/jetty/jans-config-api/custom/config/log4j2-adminui.xml
```

Within this configuration file, you can adjust various settings such as log levels, appenders, and formats.

## Default Log Location

The default log location for the Admin UI backend is:

```text
/var/log/adminui
```

It is also recommended to check the browser's console log and network tab for any failing requests, as this can provide additional information to diagnose and troubleshoot issues.
