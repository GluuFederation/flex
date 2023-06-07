# Architectural details

## Application

Gluu Casa ("Casa") is a web application (more specifically, a Java EE 7 web module).

### UI aspects

To generate HTML content, this application uses the [ZK Community Edition](https://www.zkoss.org) framework. Pages built with ZK are lightweight, still preserving a Java backend binding typical of JSF applications. The lifecycle of ZK pages and components is simpler than that of JSF, but at the same time shares many aspects such as interfaces defined in terms of XML tags and usage of EL expressions. 

ZK helps developers write highly interactive interfaces in a fast-paced manner still using similar dialects of other Java-based UI frameworks. Additionally, although it uses a lot of Ajax in the browser, no knowledge about Javascript is required.

There are a handful of approaches for ZK development, particularly in Casa the MVVM pattern is used. This pattern has 3 roles: View, Model, and ViewModel which allow separation of data and logic from presentation. For more information see [ZK MVVM Reference](http://books.zkoss.org/zk-mvvm-book/9.0/).

Plugin developers are encouraged to use the MVVM development style of ZK, however any other approach is pluggable and should supported.

#### CSS frameworks

To bring Casa users the best UI experience, we followed an approach to style the application different from a typical ZK application. The following summarizes this aspects:

- The ZK theme was disabled. This helped us to have total control over the style of components

- A functional CSS approach was taken. [Here](https://www.smashingmagazine.com/2013/10/challenging-css-best-practices-atomic-approach/), [here](https://css-tricks.com/lets-define-exactly-atomic-css/), and [here](https://johnpolacek.github.io/the-case-for-atomic-css/) you can find useful introductory material in this regard. The framework chosen was [Tachyons](http://tachyons.io).

- To avoid redefining common UI elements, such as alerts, tooltips, etc., Bootstrap was employed. Despite this, Casa cannot be considered a full Bootstrap-based app since few of its components are leveraged.

- The [Font Awesome](https://fontawesome.com) project was used for icon management. We encourage reusing those in your plugins instead of adding your own images.

As a consequence of the above, a small number of CSS rules had to be manually created. The main stylesheet of this project is just 3KB (after GZip).

In addition, certain pages may employ additional CSS files such as:

* [IntTelInput (International Telephone Input)](https://github.com/jackocnr/intl-tel-input)
* [Spectrum color picker](https://github.com/bgrins/spectrum)
* [Jquery UI](http://jqueryui.com)

### Backend

From the server-side perspective, the following summarizes the most relevant aspects:

#### Contexts and Dependency Injection (CDI)

Casa uses Weld 3.0 (JSR-365 aka CDI 2.0) for managed beans. The most important aspects of business logic are implemented through a set of beans found in Java package `org.gluu.casa.core`.

Managed beans are injected into UI controller classes (ZK ViewModels) by means of custom ZK annotations. ZK pages can access bean properties via EL expressions when they are annotated `javax.inject.Named`.

#### Logging

Casa uses "Simple Logging Facade for Java" (SLF4J) with the Log4j2 binding. Log files are located in `/opt/gluu/jetty/casa/logs` of Gluu Server chroot container. To get more information on loggers and appenders, check the `log4j2.xml` file found in `/WEB-INF/classes` of the application war. Alternatively, you can check the file online in [Github](https://github.com/GluuFederation/casa/blob/master/app/src/main/resources/log4j2.xml) (point to the branch that corresponds to your Casa version).

#### Async timers

Casa employs a number of asynchronous jobs to:

- Periodically clean users trusted devices list if any
- Detect changes in relevant custom interception scripts and notify plugin handlers of this event
- Detect changes in logging level
- Deploy/undeploy plugins based on recent changes in the file system
- Synchronize configuration changes 

For these tasks, the Quartz 2 library is used.

#### Plugin framework

The "Plugin Framework for Java" ([PF4J](http://www.pf4j.org)) is the mechanism Casa supports for plugin management. Plugins are artifacts intended to extend and under certain circumstances, override application functionalities.

Plugins are added at runtime, which, requires no restart of Casa. Additionally, plugins can be temporarily stopped or permanently removed.
To add a plugin, a jar file must be uploaded via the admin dashboard. 

#### Persistence

As expected, access to Gluu database is key in Casa. To cover this need, the oxCore persistence library. This is a small framework which allows to easily establish a mapping between Java objects (POJOs) and database entries facilitating CRUD operations a lot. Plugins leverage the persistence framework as well as some functionalities exposed directly by the application which makes access to the database fairly easy to understand and highly productive at the same time. 

#### Rest services

Plugins can add RESTful web services dynamically. For this purpose, the well-known JBoss RESTEasy  libraries were included in this project. Additionally, Gluu Casa exposes some API endpoints that leverage these libraries. 

## External dependencies

### Authorization server

The oxAuth component of your Gluu Server installation is the most relevant. Although Casa leverages (oxd)[#oxd-server] to simplify the authorization process, some endpoints of oxAuth are consumed directly to support credential enrollment functionalities or gathering certain configuration parameters. 

More importantly, the workflow exhibited by the authorization server when an authentication attempt is made by the application depends on a set of interception scripts and custom pages which were built specifically for this application. 

### oxd server

oxd server (version 4.x required) acts as a mediator to simplify the authorization process (which follows the OpenID Connect code flow). This required component's location is supplied during Casa installation (in case administrators don't have an oxd server available, they can make use of the option to install and configure on an instance).

### Geolocation service

Casa uses the "IP-API" geolocation service for two purposes: gathering basic location information in the moment of the login itself and when enrollments take place for Super Gluu devices. The latter is available only if the administrator has added Super Gluu as one of its [enabled methods](../administration/#enabled-methods) previously.

Casa supports free and pro service of IP-API.

## Data storage

### Backend database

Casa uses the same lightweight directory (LDAP) or database of your Gluu Server to store users data such as [enrolled credentials](../administration/credentials-stored.md), users' trusted devices information, and so on. 

It is recommended that developers writing plugins leverage the existing database to save their data. Nonetheless, any other alternative mechanism can be embraced; it is up to administrators and developers to agree on how to incorporate this to the current stack.

### Application configuration

All configuration parameters are stored in attribute `oxConfApplication` under database branch `ou=casa,ou=configuration,o=gluu`in JSON-formatted style. It contains all aspects that allow parameterization/customization of application behaviour, in other words, it stores all settings accessible through the application's [admin dashboard](../administration/admin-console.md) as well as configurations for certain plugins, such as [strong authentication settings](../plugins/2fa-settings.md) plugin.

If by means of misconfiguration, administrators cannot log in to access the dashboard anymore, it is a matter of connecting to the database and apply editions on `oxConfApplication` to recover access.

To force the application to pick up changes manually applied in the database, a [restart](../administration/faq.md#how-do-i-restart-the-application) is required.

### Plugins directory

Jar files of deployed [plugins](#plugin-framework) reside in the file system at `/opt/gluu/casa/plugins`.

## Runtime environment

These are key facts for potential Casa developers:

* Underlying operating system: The Linux distro where your Gluu Server is running. For plugin development, there is no restriction on the operating system.

* Java version: Gluu Server comes with Java 11 installed in the chroot container, that is, the war file of Casa uses a JVM in such version.  For plugin development, JDK 11 is recommended as well.

* Application container: Casa runs in a Jetty 9 instance (which is setup upon installation of Casa). Plugin writers don't need to use an application container since they only produce jar files.

* Build tool: To write plugins, we recommend Maven 3. However, any build system which allows the user to create fat (Uber) jars will suffice.
