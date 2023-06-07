# Introduction to plugin development
 
This page covers basic notions required for Gluu Casa plugin development. In practice, writing plugins is easy but requires understanding of some key concepts. If you skip the background part and proceed straight to [Writing your first plugin](./writing-first.md), you will get bounced here very soon.
 
## Requirements and tools
 
### A Gluu Server VM

For development, you need a virtual machine with Gluu Server installed. Recall Gluu Server installation is constrained to a number of [Linux distributions](https://gluu.org/docs/gluu-server/installation-guide). Keep in mind to opt in for Casa when prompted. The Gluu server version used should match that of the machines you are targetting for production environment.

Ideally, you should populate your Gluu Server with data (e.g. users/groups) to somewhat resemble a testing or production server of your organization. Writing a plugin to be run on a server with no users other than admin will lead to very poor testing scenarios.

!!! Note
    Ask your administrator for help on preparing your virtual machine. It is likely they already have one available for immediate use. Check the [CE docs](https://gluu.org/docs/gluu-server/installation-guide) for instructions on how to install Gluu Server from scratch if you need to do so.

Ensure you have credentials for a user with administrator privileges in your Gluu Server as well as in the VM (e.g root). Ensure you can connect to that VM via SSH with a client and that your can transfer files.

### A running Gluu Casa installation

Once you are up and running with a Gluu Server VM, ensure you can log in to Casa when finished, eg. `https://<host>/casa`.

#### Change file check period

By default .zul templates are cached for a very long period, however, for development we need to alter this behavior. Do the following:

1. Connect to your VM and log in to Gluu chroot (e.g. `gluu-serverd login`)
1. Extract ZK descriptor: 
    ```
    # cd /opt/gluu/jetty/casa/webapps
    # jar -xf casa.war WEB-INF/zk.xml
    ```    
1. Locate XML tag `file-check-period` and remove it including its surrounding parent `desktop-config`
1. Save the file and patch application war:
    ```
    # jar -uf casa.war WEB-INF/zk.xml
    ```
1. [Restart](https://gluu.org/docs/gluu-server/4.4/operation/services/#restart) casa

The above guarantees changes in .zul files are picked very often (5 seconds is default ZK cache refresh time).

#### Find a graphical database client

Ensure you can use a GUI client in order to connect to your database (eg. LDAP). While command line tools can be employed, the only means to have an agile development experience is leveraging a point-and-click tool. 

In case of LDAP two graphical clients worth mentioning are [LDAP Admin](http://www.ldapadmin.org/) and [Apache DS](https://directory.apache.org/studio/downloads.html). Ask your administrator how to setup a connection from the client running on your desktop to Gluu container's LDAP or 
follow [these](https://gluu.org/docs/gluu-server/user-management/local-user-management/#manage-data-in-gluu-ldap) instructions.

In case you cannot establish the tunnel mentioned in the docs you can do this if your Gluu Server is backed by OpenDJ:

- Run `/opt/opendj/bin/dsconfig -h localhost -p 4444 -D "cn=directory manager" -w PASSWORD -n set-connection-handler-prop --handler-name="LDAPS Connection Handler" --set listen-address:0.0.0.0 -X` in chroot
- Open port 1636 in your VM firewall
- [Restart](https://gluu.org/docs/gluu-server/4.4/operation/services/#restart) LDAP

### LDAP notions

!!! Note
    This section applies for installations where the underlying database is LDAP

It is advisable to get some basic acquaintance with the structure of Gluu's LDAP. We suggest doing a quick introductory reading about LDAP (you'll find many articles in the Internet) if your plugins needs to access or store information from the directory. Ensure you get the **basic** grasp of the following concepts:

- Entry
- DN and RDN
- Objectclass
- Attributes
- Search filters (optional)

### Programming language

Java coding skills are a must and basic-to-intermediate knowledge of web applications is desirable. Previous knowledge of the [UI framework](https://www.zkoss.org) or the [plugin framework](http://www.pf4j.org/) are not required but readers will likely need to glance at both when the time for coding comes.

Alternatively, you can use [Kotlin](https://kotlinlang.org) as it provides full compatibility with Java. Both ZK and P4FJ demonstrates feasibility to work with Kotlin; check [here](https://dzone.com/articles/kotlin-zk) and [here](http://www.pf4j.org/doc/kotlin.html) as a reference.

In theory, any other language supported in the JVM such as Scala or Groovy may work, however at Gluu we haven't experimented with those. Feel free to create a Github project and share with us.

### IDE and building tools

You can use the tools of your choosing as long as you can produce fat (Uber) jars, which is the form in which Gluu Casa plugins are delivered. In the following pages, we will use command line interface (CLI) and [Maven 3](https://maven.apache.org) as build tool.

### oxCore persistence annotation lib

Plugins will likely require reading and writing data from and to the underlying Gluu Server database. There is one Java library (part of Gluu casa project) called `casa-shared` at developers disposal which abstracts and simplifies access to the DB (basically CRUD operations). Manipulation of this abstraction requires developers to create simple classes (POJOs) that can be mapped to actual database entities. 

For this purpose, Gluu's oxcore [persistence-annotation](https://github.com/GluuFederation/oxCore/blob/master/persistence-annotation/pom.xml) library is leveraged.

## Basic concepts

### UI Framework

#### Reference docs

Previous knowledge of the [ZK framework 9](https://www.zkoss.org) is not required but we advise to have some relevant docs at hand. From the list found [here](https://www.zkoss.org/documentation#References) we highlight:

* Get ZK Up and Running with MVVM (*glance at it now if possible*)
* ZK MVVM Reference
* ZK Developers' Reference
* ZK ZUML Reference
* ZK Component Reference

The [api-docs](https://www.zkoss.org/documentation#API) are also a good source of low-level details.

There is no need to get into the installation details of ZK since plugins will just leverage the ZK 9 libraries available in Gluu Casa at runtime. 

#### Key concepts

In ZK, you use ZUML (ZK User Interface Markup Language) which is an XML-formatted language to describe UIs. The default extension file name for ZUML pages is **.zul**. In zul files, components are represented as XML tags (elements) and each component's style and behavior is configured by setting XML element's attributes.

ZK provides many ready-to-use UI components, but it also allows to use pure HTML code which is universally known by designers and developers in the field of web applications.

You can use any of the resources listed above to get an idea of how typical zul files look. You can also extract casa war contents to inspect those. In the [Writing your first plugin](./writing-first.md) page you will have the opportunity to view and edit .zul files your own.

Particularly in Gluu Casa code, the amount of zul components used is very small to favor plain HTML5 tags. This allows to reduce the time it takes to incorporate a UI design handed by a third party into a project. Additionally it helps reducing the time to learn ZK by focusing only on the relevant components that make the interaction with the backend possible.

Besides ZUML, ViewModels are an important concept. *ZK MVVM Reference* contains a great introduction to the topic. By now it suffices to say  the *View* is the user interface, i.e. the zul page which contains ZK components, and the *ViewModel* is a type of View abstraction which contains a *View*'s state and behavior. Physically, it is a POJO that contains no direct references to UI components but fields (with getters and setters) that store data state of the view, for instance, the text being entered in a text box, the enabled status of a button, the selected item of list. With regard to behaviour, it may contain the methods that will be called when something interesting happens (e.g. a button was clicked or checkbox was ticked, etc.)

ZK framework takes charge of handling the communication and state synchronization between the *View* and its associate *ViewModel*. While you don't normally reference UI components in *ViewModels*, if you need to manipulate those in your POJO, account that there is a Java class in the framework for every possible ZK component (e.g. Button, CheckBox, etc.) and they reside in package `org.zkoss.zul`. 

The process of synchronizing data between the *View* and *ViewModel* is called binding. ZK uses a set of Java-like annotations to drive this mechanism. We will see some of those when [Writing our first plugin](./writing-first.md). ZK binder is also responsible for hooking up a UI component's event such as a button's onClick to a method defined in a *ViewModel*. In this case Java annotations are used.

### Plugin framework

PF4J is a very extensible simple lightweight plugin framework for java. The project [site](http://pf4j.org), [repository](https://github.com/decebals/pf4j/) and [api-docs page](http://pf4j.org/ref/javadoc.html) contain all required info to get the grasp of the framework.

!!! Note  
    Gluu Casa only accepts plugins packaged in jar files. See the [constraints](#important-constraints) section for more information.  
    
The following is a summary of relevant concepts (somewhat tailored to the particular case of Gluu Casa):

* A plugin contains zero or more extensions
* An extension implements one extension point
* Extension points are Java interfaces defining a set of methods of interest (this way behavior is added/overriden in a host application)
* Extension points are declared in external projects (i.e. in shared libraries - not in the plugin itself or the host application)
* Extension points must extend the interface `org.pf4j.ExtensionPoint`

In PF4J there are a handful of concepts such as the *Plugin manager* and others but they are of use for developers of the main application only, not for plugin developers. Just knowing about the concepts above will let you focus on the real deal: writing the extensions (the classes that implement the logic declared in extension point interfaces).

In addition to the plugin (which is represented by a class that extends `org.pf4j.Plugin`) and its extensions, you can also bundle any other classes or files with your plugin. We will see this in more detail in the [Anatomy of a plugin](#anatomy-of-a-plugin), but you can package styles sheets, javascript files, images, or any sort of file that will be of use for your plugin to add/extend functionality to Gluu Casa. A good example would be .zul files and associated ViewModel classes.

### Casa shared module

There is an important Java artifact called `casa-shared`. It's a small jar file that exposes a number of interfaces and utility classes instrumental in doing plugin development. 

You include `casa-shared` in plugins by adding the following to your maven project:

```
        <dependency>
            <groupId>org.gluu</groupId>
            <artifactId>casa-shared</artifactId>
            <version>YOUR-CASA-VERSION</version>
            <scope>provided</scope>
        </dependency>
```

You can find the physical artifact [here](https://maven.gluu.org/maven/org/gluu/casa-shared/).

Note that "provided" scope is used because classes of this library are available at runtime in Gluu Casa already, thus you don't have to make them part of your plugin jar.

#### Extension points for Gluu Casa

`casa-shared` defines a couple of extension points that you may like your plugins to implement for your extension classes:

- *Navigation menu* (`org.gluu.casa.extension.navigation.NavigationMenu`): Implementing an extension of this kind allows adding one or more menu items to a specific navigation menu found in Gluu Casa: user menu, admin dashboard menu, or drop down menu (the one shown on the top right of the app UI).

- *Authentication method* (`org.gluu.casa.extension.AuthnMethod`): Implementing an extension of this kind allows adding (or overriding) and authentication mechanism used in Gluu Casa (with regards to enrolling capabilities only). Adding a method requires some planning. There is a dedicated [section](./authn-methods/index.md) around this.

The existence of these two extension points means that you can tweak menus or authentication method behaviors. These are core aspects of the application, specially the later. However, if your plugin is not related to any of those, you can pack your plugin with no extensions and still provide assets like UI pages, ViewModels, etc.

#### Utility classes

- `org.gluu.casa.ui.CustomDateConverter`: This is an instance of `org.zkoss.bind.Converter` very handful for date formatting in your .zul templates.

- `org.gluu.casa.ui.UIUtils`: A class containing static methods to show auto-dismiss notification success/error ZK notification boxes. You can call these methods from within your ViewModels.

- `org.gluu.casa.misc.Utils`: A class containing a handful of static miscelaneous methods. There are good chances that you'll leverage some methods of `Utils` when writing plugins, specially `scriptConfigPropertiesAsMap` and `managedBean`.

- `org.gluu.casa.misc.WebUtils`: Provides web-related utility methods. Most of them inspect the `javax.servlet.ServletRequest` under the hood. You may call these methods specially from within your ViewModels.

#### Data objects

The following are some classes which help represent remarkable entities:

- `org.gluu.casa.credential.BasicCredential`: A class that represents the basic info about an enrolled credential (authentication device). 

- `org.gluu.casa.core.pojo.BrowserInfo`: A class that holds basic information about a user's browser.

- `org.gluu.casa.core.pojo.User`: Represents the current logged in user. It provides access to common attributes such as given name, last name, etc. The whole set of claims returned by the authorization server can be obtained via `getClaims` method or individually with `getClaim`. The claims (user attributes) available are determined by the scopes requested upon user authentication (../administration/admin-console.md#oxd-settings)

Actual instances of `BrowserInfo` and `User` are obtained by interacting with an instance of `org.gluu.casa.service.ISessionContext`. See below.

#### Service objects

Package `org.gluu.casa.service` of `casa-shared` provides a couple of interfaces that used in combination with method `Utils.managedBean` open access to key features or information:

- `SndFactorAuthenticationUtils`: Provides helper methods for several 2FA-related tasks.

- `ISessionContext`: It allows you to obtain information about the current user session: who the logged-in `User` is, and which their `BrowserInfo` settings are.

- `IPersistenceService`: Obtain an instance of this class (via `managedBean` method) and you are ready to start performing CRUD operations in the local database!. Recall that objects and classes passed around are supposed to be annotated with some of the annotations from the oxCore [persistence framework](#oxcore-persistence-annotation-lib). This interface also contains some methods that allows to quickly obtain the DN (distinguished name) of the most important branches of Gluu's LDAP tree.

!!! Note  
    When obtaining your IPersistenceService reference there is no need to worry about connecting to the database. You are ready to go.  

#### Persistence-ready POJOs

`casa-shared` already provides some persistence-framework compatible POJOs that you can reuse or extend when writing plugins. The following are the most prominent:

##### BasePerson

The class `org.gluu.casa.core.model.BasePerson` represents an entry in the *people* LDAP branch, or its equivalent table in case of other databases. It only exposes attributes `inum` and `uid` so you might extend this class and add the attributes your plugin needs to handle. Note that field attributes may require annotations so that the framework automatically populates and/or persists values appropriately.

For an example on `BasePerson` derivation, check [Owner](https://github.com/GluuFederation/casa/blob/version_4.4.0/plugins/samples/clients-management/src/main/java/org/gluu/casa/plugins/clientmanager/model/Owner.java) class from the client management sample plugin, which in addition to `BasePerson` fields, handles `givenName`, and `sn` attributes.

##### CustomScript

The class `org.gluu.casa.core.model.CustomScript` represents a Gluu custom interception script. This class is useful for plugins working with authentication methods since those are parameterized via the configuration properties of scripts. You will find method `Utils.scriptConfigPropertiesAsMap` useful for easily reading a script properties set.

##### Client

The class `org.gluu.casa.core.model.Client` represents an OpenId Connect Client defined in the Gluu Server. To see the list of defined clients visit `OpenID Connect` > `Clients` in oxTrust admin console.

## Anatomy of a plugin

In this section we will explore the layout of a plugin - more exactly how Gluu Casa expects your plugins to be structured.

A Gluu Casa valid plugin is a jar-packaged PF4J plugin resembling the following structure:

```
plugin.jar

+-- assets 
+-- labels
|   +-- zk-label.properties
|   +-- zk-label_en.properties
|   +-- zk-label_de.properties
|   +-- ...
+-- META-INF
|   +-- extensions.idx
|   +-- MANIFEST.MF
+-- com
    +-- mycompany
        +-- MyClass.class
        +-- ...
```
   
- `assets` directory contains static resources (images, stylesheets, .js files, etc.) and Views (.zul files). This directory is optional and can be composed of arbitrarily nested subdirectories.

- `labels` is an optional directory and is expected to contain your plugin resource bundle (ZK [internationalization](../administration/localization.md) labels files). The resource bundle name is required to be **`zk-label`**. ZK rules for looking up labels is followed. For example, if user's locale is `de_DE` the first place to search for a label is `zk-label_de_DE.properties`, if the file does not exist or the label is not found, `zk-label_de.properties` is tried; a final attempt is made with `zk-label.properties`.

- `META-INF` is mandatory and should contain at least the two files shown in the figure above. `MANIFEST.MF` is the jar manifest file and should contain the metadata entries for your plugin (e.g. id, version, description, etc.). Check this [page](http://pf4j.org/doc/getting-started.html) to learn more. `extensions.idx` is automatically generated by PF4J at compile time so there is no need to craft this by hand. It contains references to all the extensions found in your plugin.

- Directories remaining should contain java classes and any other type of resource needed. Note that your plugin **must** have exactly one class (anywhere) extending `org.pf4j.Plugin`. Also you can can bundle zero or more classes annotated with `org.pf4j.Extension`. 

There are no explicit requirements about package naming or where to place plugin classes, extensions, or supporting classes. We suggest the following:

```
com
+-- mycompany
    +-- plugins
        +-- <pluginID>
            +-- <pluginID>Plugin.class
                +-- ExtensionClass1.class
                +-- ...
                +-- ExtensionClassN.class
            +-- service
                +-- ...
    
```

Where `<pluginID>` is the ID of the plugin you are writing. Here we assume you are a developer at `mycompany.com`. 

### About extensions

Extension classes can be declared inside the plugin class itself (nested static classes) as seen in the PF4J [examples and demos](https://github.com/decebals/pf4j/), or as regular classes in their own files as depicted in the figure above. Such classes **must** implement methods declared in extension point  interfaces.

In Gluu Casa extension classes are instantiated only once (singletons), so keep this in mind for your plugins development.

### Dependencies

It is likely you will use external libraries in your plugin. Unless such dependencies are already part of those Gluu Casa provides at runtime, you have to provide them in your project. This means you will generate a fat jar (a jar-with-dependencies).

To know the dependencies already available at runtime, do the following:

1. Create a temporary directory locally and `cd` to it

1. Create `app` and `shared` folders in it

1. Download file `https://maven.gluu.org/maven/org/gluu/casa-base/4.4.0.Final/casa-base-4.4.0.Final.pom` and save it as `pom.xml`. If you are on linux, you can use `wget` passing `-O pom.xml`

1. `cd` to `shared` and download `https://maven.gluu.org/maven/org/gluu/casa-shared/4.4.0.Final/casa-shared-4.4.0.Final.pom` (save as `pom.xml`)

1. `cd` to `../app` and download `https://maven.gluu.org/maven/org/gluu/casa/4.4.0.Final/casa-4.4.0.Final.pom` saving again as `pom.xml`

1. Do `cd ..` and run `mvn dependency:tree -pl app`. It will take some minutes until all dependencies are downloaded to your local maven repository. Finally the tree will be printed on the screen.

If you are already using in your project some dependencies found in Casa, you should skip those in your jar file to get a lighter plugin. To do so you can set the `scope` of the artifact to `provided` in your maven's pom descriptor.

If you are using maven as build tool, the Assembly Plugin will help you to easily generate your jar-with-dependencies and also get the manifest file as needed. The sample plugin we will study later uses this approach for your reference.

### A manifest file example

This is how a typical Gluu Casa plugin `MANIFEST.MF` looks like:

```
Plugin-Id: hello-world-plugin
Plugin-Version: 3.2.1
Plugin-Class: com.mycompany.plugins.HelloWorldPlugin
Plugin-Description: This plugin adds a link to users menu which takes
 you to a page where you are asked to fill a form with your credit
 card data and SSN. The information is sent to a hacker's inbox.
Plugin-License: Available under the Apache License 2.0. See 
 https://www.apache.org/licenses/LICENSE-2.0.html for full text
Plugin-Provider: My Company
Logger-Name: com.mycompany.plugins
Created-By: Apache Maven 3.2.5
Manifest-Version: 1.0
Built-By: you developer
Build-Jdk: 1.8.0_65
```

The `Logger-Name` entry allows you to include logging statements your project generates to `casa.log` when they belong to the prefix supplied. We will revisit this later.

## Handling plugin configuration

Most of times plugins will have to persist configuration data for normal operation. This data can be saved alongside existing Casa configuration in branch `ou=casa, ou=configuration, o=gluu`. To do so, create a Java bean that models the configuration you require and then obtain an instance of `IPluginSettingsHandler` this way:

```
import org.gluu.casa.service.settings.*;

...
IPluginSettingsHandler<Configuration> settingsHandler = Utils.managedBean(IPluginSettingsHandlerFactory.class).getHandler("<plugin-id>", Configuration.class);
```

Above we assumed `Configuration.class` was the Java class created to model config data of the plugin identified with `<plugin-id>`. Account this class has to have proper getters and setters for the fields defined. Fields can be primitives or objects with complex structure (no recursive structures though).

In this case, `settingsHandler` is an object that allows to obtain an instance of `Configuration` (via `T getSettings()` method) that can be used to read the current configuration properties of your plugin. If no config data is defined yet, this method will return `null`. 
Method `void save()` will persist modifications performed on the object reference previously obtained by a call to `getSettings()`. In addition, there is `void setSettings(T)` which is helpful to set an initial value for the configuration if undefined. As with calling setters of object of type `T`, a call to `setSettings` only alters the in-memory copy of the configuration: changes will be lost in case Casa is stopped.

## Accessing cache facilities

Plugins can access the underlying cache provider in use by the Gluu Server installation at no cost. This is helpful when access to a quick key/value store is required. Click [here](https://gluu.org/docs/gluu-server/4.4/reference/cache-provider-prop/) to learn more about the cache types supported by the server.

To access the cache handler, do the following:

In your `pom.xml` add:

```
<dependency>
	<groupId>org.gluu</groupId>
	<artifactId>oxcore-cache</artifactId>
	<version>4.4.0.Final</version>
	<scope>provided</scope>
</dependency>
```

In your code do:

```
import org.gluu.service.cache.CacheProvider;
...
CacheProvider cache = Utils.managedBean(CacheProvider.class);
```

With `cache` object it is possible, for example, to retrieve values (`get` method), set values (`set` methods), and remove values by key (`remove`). By default a key/value pair has an expiration time defined at the server level in the [oxTrust admin UI](https://gluu.org/docs/gluu-server/4.4/reference/cache-provider-prop/). A different expiration time (in seconds) can be supplied using `put` method of signature `void put(int, String, Object)`.

!!! Note
    `Object`s to be stored in cache have to implement the interface `java.io.Serializable`.

## Important constraints

The following are some important considerations to account:

### CDI

[Earlier](./architecture.md#backend) we mentioned the usage of Weld for contexts and dependency injection. While Weld 3.0 API is available in `casa-shared` module, you **cannot** include managed beans, producer methods, or producer fields in your plugins. Weld is only aware of the beans discovered in the scanning phase at startup of Gluu Casa, while your classes are added dynamically at a later stage. Also injection simply won't take place.

To obtain references of already defined [service objects](#service-objects), use `Utils.managedBean`.

### Simultaneous plugin versions

Gluu Casa does not allow to upload a plugin whose plugin ID is already found in the system even when plugin versions do not match. 

### Plugin versioning

As required by PF4J, a plugin version must be compliant with [Semantic Versioning](http://pf4j.org/dev/versioning.html).

### Plugin format

PF4J supports zip-based, jar-based, and directory-based plugins (the last one in PF4J development mode). Gluu Casa runs in deployment mode and only accepts plugins in jar form.

### Plugin dependencies

PF4J allows a plugin to depend on other plugins. This feature is not supported in Gluu Casa yet.

## Development lifecycle

If you reached this part of the document, you already have the background required to start. Congratulations!. 

The following is a generic suggested flow for developing plugins once the [requirements](#requirements-and-tools) presented in the beginning of this document are met. It is assumed the goals to fulfil with your development are already clear for you:

1. Create a simple project in your development environment. Include `casa-shared` dependency (this will give you access to UI and plugin framework as well as other utilities). Create an empty resource bundle (labels file).    

1. Create a plugin class and write your plugin metadata (i.e. all descriptive elements that will appear in the plugin's manifest file).

1. Create the extension classes you need (don't forget the `@Extension` - a common mistake -).

1. Code the body of your extension classes (i.e. implement the methods that the extension interfaces may be requiring).

1. Create blank documents for the UI pages you may need. For every page add a minimal amount of markup code to start: for instance add a title and a heading text (probably you'll add the actual text to your labels file and reference the entries in your UI page via EL expressions).

1. Create the controller classes for your UI pages. We strongly encourage you to use the MVVM approach. Attach the controllers to your pages.

1. Code your ViewModel or controller classes with the logic required for page initialization. Add some logging statements here.

1. Build your plugin artifact. For your first artifact, ensure the jar complies with the [expected structure](#anatomy-of-a-plugin). Check your manifest file contains the entries you expect and that the `extensions.idx` was bundled alongside with the manifest.

1. Login to your Gluu Casa testing application and upload the plugin in the admin dashboard. Wait 1 minute and check your `casa.log` and `casa_async_jobs.log`. You may find a lot of interesting information there.

1. In a browser hit the page(s) you want to visualize in order to test your achievement so far. For the first attempts there is good likelihood of errors appearing. These are normally due to some misreference in URLs, class names, or label names. Some errors can be fixed without even regenerating and reuploading your plugins while others many need you to get back to your IDE. See this [page](./tips-development#skipping-package-and-deployment-phases) for more information.

1. Delete the current running plugin via the admin dashboard of Gluu Casa if a new jar file needs to be built.

1. Apply error fixing as needed.

1. Add more logic to your plugin. This may require you to do some of the following:

    - Generate Java classes intended for database manipulation
   
    - Adding elements to Gluu's LDAP schema (applicable only if LDAP is your backend database)
   
    - Add more code to your ViewModel classes (e.g. to handle interactions such as pressing a button or to bind data from UI components)
   
    - Add service classes (classes to concentrate business logic aspects) and use those in your ViewModels.
   
    - Add JAX-RS resource classes
   
    - Add assets (e.g style sheets, javascript files, etc.)
   
1. Generate a new plugin artifact and repeat the upload/test/fix/add logic loop.

1. Once you are confident with your results, review and polish your manifest file.

1. Test your plugin on a realistic Gluu Server instance (pre-production environment of your organization). Once approved give the plugin its final version (e.g. 1.0.0), generate the final jar file, and deploy in production.

!!! Note  
    Neither Gluu Casa nor Gluu Server requires to be **restarted** when you are developing plugins. In case you need to alter the lightweight directory schema, only the LDAP service needs a restart.  
