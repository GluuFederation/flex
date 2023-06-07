# Writing your first plugin

In this page we will disect the "Hello world" plugin project, apply editions on the code, do the packaging, deploy, and testing on a Gluu Casa installation.

## Requirements

Requirements for this task are the same as those listed in the [introductory page](intro-plugin.md#requirements-and-tools) except for database-related stuff which is not required. Additionally, maven will be used as build tool. If you don't want to use maven you'll need to investigate how to perform the tasks in the tool of your preference. 

If you skipped ["Introduction to plugin development"](intro-plugin.md) we strongly encourage you to check it now.

## Hello?

Hello world is minimalistic plugin that showcases very basic aspects of plugin development. This plugin will simply add an item to Casa users menu which in turn takes users to a separate page showing a salutation. In this page you can enter some text, execute server-side logic and update the UI back accordingly.

### Download project

Let's start by downloading the code. Hello World plugin is found in the [sample plugins folder](https://github.com/GluuFederation/casa/tree/version_4.4.0/plugins/samples).

If you have `git` installed in your machine, issue the following command. Replace the content in the angle brackets with your Gluu Casa version (e.g. "version_4.4.0"):

```
$ git clone https://github.com/GluuFederation/casa.git
$ git checkout <branch>
```

Alternatively you can download a zipped version of the project from github:

- Visit this [page](https://github.com/GluuFederation/casa) and pick from the dropdown the branch matching your Casa version
- Click on the "Clone or download" button, then on "download ZIP"
- Extract the contents of the file to a convenient location

### Extract war contents

This step is optional, however, it is illustrative to peek at some UI templates while getting acquaitance with UI design:

1. Log into chroot 
1. Transfer the file `/opt/gluu/jetty/casa/webapps/casa.war` somewhere to your local environment (say to `~/temp`)
1. create a folder and navigate to it: `mkdir casa && cd casa`
1. Execute `jar -xf ../casa.war`
1. Remove war: `rm ../casa.war`

`casa` directory will contain the exploded application fully.

#### Useful javadocs

`casa-shared` maven dependency is of remarkable interest. To generate the java docs do:

1. `cd` to the local directory where you cloned or download the git repo
1.  Run `mvn javadoc:javadoc -pl shared`

API docs will be found under `shared/target/site`. 

## Anatomy

Plugin directory is found in `helloworld` folder. As you can see, this is a [standard maven project](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html).

### POM

 Let's start by disecting the build descriptor (`pom.xml`):

- Identifiers and versions: At the top of the file variables `plugin.id` and `plugin.version` are defined. These are key for plugin's metadata. Also we reuse those to name the artifact to be produced: note the `artifactId` and `version` tags; this means the name of the generated jar will follow the pattern: `{plugin.id}-{plugin.version}`.

- Assembly: We leverage the `maven-assembly-plugin` that allow us to generate a jar with dependencies and a suitable manifest file (see ["anatomy of a plugin"](./intro-plugin.md#anatomy-of-a-plugin)). Note the `<archive>` section of `pom.xml` reuses the ID and version defined previously and also supplies extra info, being `<Plugin-Class>` the most relevant.

- Dependencies: This simple plugin just accounts for one dependency, namely the [`casa-shared`](./intro-plugin.md#casa-shared-module) module. This dependency is obtained from Gluu repository (see `<repositories>` section).

### Plugin's class

In the build descriptor, `<Plugin-Class>` element points us to class `org.gluu.casa.plugins.helloworld.HelloWorldPlugin`. This class extends `org.pf4j.Plugin` which is a requirement of the [plugin framework](./intro#plugin-framework). A plugin project should bundle only one class of this kind.

Plugin classes can override methods of `org.pf4j.Plugin` (e.g. `start` and/or `stop`) if they need to do some processing upon plugin start or stop. For HelloWorld we don't need so we simply call the constructor of the superclass.

### Extension

In the same package of plugin class, that is, `org.gluu.casa.plugins.helloworld` class `HelloWorldMenu` is found, this is the only extension this plugin contributes. Recall from the intro page [concepts](./intro-plugin.md#plugin-framework) that extensions are classes that implement extension points (interfaces annotated with `org.pf4j.ExtensionPoint` that define a set of methods of interest).

`HelloWorldMenu` is a class annotated with `org.pf4j.Extension` that implements extension point `org.gluu.casa.extension.navigation.NavigationMenu`. `NavigationMenu` defines a couple of methods that allow implementing classes to add items (more generally, content) to menus. Check the javadocs for a thorough description. Note that `menuType` is a default interface method. If it weren't present in `HelloWorldMenu` the same effect would be achieved.

Method `getContentsUrl` references a path to a page that can contain markup of any kind. It will get added to the overall menu markup you are targetting (user, admin, or auxiliary), see `org.gluu.casa.extension.navigation.MenuType`. Markup is added in order of priority (see `getPriority` method), the higher the value, the upper position in the menu.

!!! Note
    All "extra" menu items are added after Casa defaults. For example, if you are targetting user menus, the 2FA menu and password reset will be shown first, those dynamically added come afterwards.  

In this particular case, `NavigationMenu` returns the String `"menu.zul"` which you can find in HelloWorld dir `src/main/resources/assets`. Once your plugin is loaded and started in Casa, this file (and any other in `assets`) will be accessible under the URL `https://hostname/casa/pl/hello-world-plugin/`. Later, we will explain more in detail how the [filesystem to URL mapping](#assets-folder-to-url-mapping) works.

### Resource bundle

As described in [Anatomy of a plugin](./intro-plugin.md#anatomy-of-a-plugin), plugins may declare one resource bundle with internationalization labels. This is a neat approach to decouple UI pages from actual text content. In folder `src/main/resources/labels` of plugin's directory we find the resource bundle which consists of a single file, `zk-label.properties`. This contains just a couple of entries that are referenced by UI pages.

### UI pages

HelloWorld bundles a couple ZK files in `src/main/resources/assets`:

#### menu.zul

It contains the markup required to render this plugin menu item. Important facts about this page are:

- Default XML namespace (`xmlns`) is associated to `native` (this is shortcut for namespace `https://www.zkoss.org/2005/zk/native`). This ZK namespace is used to specify native HTML tags. This kind of elements have no components associated in the server side, thus, having the highest performance. The big majority of casa pages markup is built by using only native components.

- `z` prefix is associated to the zul namespace (`http://www.zkoss.org/2005/zul`). This is comprised by most of standard ZK components. In examples you find in the Internet about ZK, you'll see this is used as the default namespace (no prefix). We don't follow this practice here because native namespace is the most common in Casa.

- Expressions of the form `${...}` are known as EL expressions and are useful to access data held in objects living in the server side (Java) or parameter values.

- The `css` object is a Java map that contains reusable styles, `menuItem` being one of those. Once the key (i.e. `menuItem`) is looked up in the map, a set of primitive styles are obtained. These primitives are usually Tachyons rules you can find in the stylesheet at `https://host/casa/styles/tachyons.min.css`.

- `zkService` is a managed bean of type `org.gluu.casa.core.ZKService`. It exposes two useful properties for writing zul templates, `contextPath` and `appName`.  When writing links (`a` tag) in native dialect is useful to know what the root path of the application is (aka the context path). This is the preferred method instead of simply hardcoding `/casa` in your pages.

- `base` is a parameter your page can read and contains the relative path associated to the plugin, in this case `/pl/hello-world-plugin`. Ultimately, the `href` attribute of the `a` tag is pointing to this plugin `index.zul` file.

- `labels` is a Java map which can be used to access the labels defined in all resource bundles the application uses (including this plugin's).

- The markup in this file resembles a lot how the already existing menu items of Casa were created. You are not required to build your markup this way, however it keeps it visually and functionally consistent with the rest of the application. For instance, usage of rule `collapsible-menu-item` allows the inner `span` to be hidden when the hamburguer icon on the top is pressed.

#### index.zul

It has the contents of the page where the user is taken after clicking on this plugin's menu item. We highlight the following facts:

- The `page` processing instruction sets the language to use when this page is interpreted by the rendering engine. ZK supports several languages being `xul/html` and `xhtml` the most prominent. In this case we use `xhtml` since the root template all Casa pages reuse is based on this language.

- The `init` processing instruction tells the rendering engine to use the file at `/general.zul` as the template for the content to produce. `general.zul` is the base skeleton for most of application pages, and is based at the same time on `basic.zul`. The effect produced is that it surrounds the actual content with the header, left menu, and footer. If you [extracted](#extract-war-contents) the war file, both files will be listed under `casa` directory.
   
!!! Note 
    For more information on templates, check "Templating" in ZK developers reference. Note that template injection (using `<template>` and `<apply> tags) don't work since this requires ZK EE.  

- `index.zul` defines two named contents, `title` and `maincontent`. The former contains markup that ends up being added to the `HEAD` section of the markup generated, the latter has the markup that will be included in the main content area of the page. You can see this happens at  `@insert` directive found in `general.zul` file.

- In general **all** pages are structured as in the figure below: a content heading area appearing just under the header. Below it a wrapper consisting of one or more sections. Every section can contain one or more panels whose structure depends on the specific need to cope. In your plugins try to adhere to this standard: new pages will fit neatly in current Casa design.

![general structure](../img/developer/main-content-structure.png)

!!! Note
    Use existing pages in Casa as a guide to write your own. Do not use as a initial guide the actual markup generated by the browser but the .zul pages you [extracted](#extract-war-contents).  
    
In addition to the above, the following are functional aspects worth to mention:

- The class `org.gluu.casa.plugins.helloworld.HelloWorldVM` is employed as this page [ViewModel](./intro-plugin#key-concepts).

- A salutation is displayed: the expression to compose the actual message is `${labels.hello.user_message} ${sessionContext.user.userName}` (a concatenation of an entry in the resource bundle and a value in a managed bean).

- There is a binding of the text entered in a textbox with the class field `message` of the ViewModel (`HelloWorldVM`). This means that if text changes in the UI, `message` is synced with the value, and if `message` is changed in the Java backend, the UI will update with the proper value.

- When the button of this page is clicked, it triggers a call to method `loadOrgName` in the ViewModel. This method exists in that Java class and changes the value of class field `organizationName`. The same call is triggered when enter key is pressed when the textbox has focus (see `onOK` attribute).

- There is a one-way binding ("load") with regard to ViewModel's field `organizationName`. This means that its value can be used in the page (e.g. for display), but no syncing takes place from page to server.

### ViewModel

Some key facts about class `org.gluu.casa.plugins.helloworld.HelloWorldVM` (the [ViewModel](./intro-plugin#key-concepts) for `index.zul`):

- It has a getter/setter for the field where 2-way binding is required (i.e. `message`). The getter is called when the page loads the first time (resulting in the text field with empty text), and the setter is called when text is typed in the textbox by the user.

- It has a getter for the field which is displayed only (organizationName). The getter is called upon page loading as well after server side processing occurs (like when pushing the button). This allows the value salutation be shown.

- Every time the page is loaded, method `init` is called (due to the presence of annotation `org.zkoss.bind.annotation.Init`). In this method some initialization takes place: we obtain a reference to a managed bean using `Utils.managedBean`.

### Logging

Being able to log statements is key for any project and Casa plugins are not an exception. You can obtain an instance of `org.slf4j.Logger` using `getLogger` method of `org.slf4j.LoggerFactory` (as in `HelloWorldVM`). `slf4j` is available when you include `casa-shared` in your project dependencies.

Here `Logger-Name` entry of your plugin manifest plays a key role (see file `pom.xml`): in your plugin any `Logger` associated with a class whose name is prefixed by the value of such entry will be effectively logged in [Casa log file](../administration/faq.md#where-are-the-logs). Statements are logged using the same level as the global logging level of the application. This can be configured in the [admin dashboard](../administration/admin-console.md#logging).

As an example, if a plugin you are writing has all its classes under `com.mycompany.plugins.MyPlugin` hierarchy and you obtain `Logger` instances using `LoggerFactory.getLogger(getClass())`, a good choice for `Logger-Name` would be `com.mycompany.plugins.MyPlugin` or `com.mycompany.plugins`. Statements won't be logged for a class `com.mycompany.MyClass` if `Logger-Name` is `com.mycompany.plugins`.

<!--
Every time a plugin is onboarded in Casa, a new logger is created using the value provided in this entry (it is created only if there is no previously existing logger with that name). The logger is assigned the same level as the global logging level of the application (this can be configured in the [admin dashboard](../admin-console.md#logging)).
-->

## Packaging

Let's do our first attempt to generate a jar for HelloWorld. In a command line `cd` to plugin directory (i.e. `helloworld` of the repo you [cloned](#download-project)) and issue:

```
$ mvn clean package
```

This will produce a file named `hello-world-plugin-0.1-jar-with-dependencies.jar`. Note it follows the pattern `{plugin.id}-{plugin.version}` we mentioned [earlier](#pom). Open the file in a compression (zip) utility to inspect its composition:

```
jar
|
+-- assets 
+------ index.zul
+------ menu.zul
+-- labels
|   +-- zk-label.properties
+-- META-INF
|   +-- extensions.idx
|   +-- MANIFEST.MF
+-- org
    +-- gluu
        +-- casa
            +-- plugins
                +-- helloworld
                    +-- HelloWorldMenu.class
                    +-- HelloWorldPlugin.class
                    +-- HelloWorldVM.class
```

This resembles what we had already described in the intro page with regard to the [plugin anatomy](#anatomy-of-a-plugin). If you have been reading in detail, no file is a stranger. Note how `extensions.idx` lists our single plugin extension:

```
# Generated by PF4J
org.gluu.casa.plugins.helloworld.HelloWorldMenu
```


### Assets folder to URL mapping

In the following section we will start playing around with our plugin. Before moving onto that, please notice all files you place in the `assets` directory of your plugin will be web accessible at URL `https://hostname/casa/pl/hello-world-plugin/`, this means that once deployed, if you hit `https://hostname/casa/pl/hello-world-plugin/index.zul` or `https://hostname/casa/pl/hello-world-plugin/menu.zul` in a browser you will see those ZK documents rendered as HTML content.

You can include an arbitrary structure of folders and files in `assets` directory and they would accessible. This is a perfect place to add javascript, images, stylesheets, etc.

## Testing

!!! Note
    Ensure your environment is aligned with respect to the [requirements](#requirements) beforehand.  
    
### Loading HelloWorld

Follow these steps:

1. Login to Gluu Casa using administrator credentials: `https://hostname/casa`.
1. Access the admin dashboard and select "Logging". Set the severity to `TRACE`
1. Select the "Plugins" option and click on the "Add a plugin..." button
1. Browse for the jar file generated [here](#packaging). Your plugin will be started in 1 minute at most.
1. After this time has elapsed, the plugin will be listed showing basic details, including a summary of extensions detected.

### Check the log

Do a quick check of the logs. It is a good idea to familiarize with the [internal](./plugin-management-internals#resource-extraction-and-registration) steps Casa performs to onboard plugins. This may also help troubleshooting for future work.

### Access plugin page

Access the home page of Casa, you will be able to see a new link was added to user menu on the left (it's labelled "Hello world!" and has a cool accompanying icon). After clicking on it a separate page (`https://hostname/casa/pl/hello-world-plugin/index.zul`) is shown.

Check the app log, you will see a statement like "Hello World ViewModel inited" this is added by method `init` of `HelloWorldVM`.

The page is showing a message that includes your current user name inviting you to type something in the text box. Type anything and press the button. This will end up in the execution of `loadOrgName` method of `HelloWorldVM`. This adds a new log statement and sets the value of class member `organizationName`. This value is obtained after a database query!.

After execution of this method, the UI is partially refreshed, which causes a new message to appear in the UI. 

### Unload the plugin

1. Access the admin dashboard and select the "Plugins" option.
1. Press the "delete" button for the HelloWorld plugin.
1. Wait 1 minute and try hitting again `https://hostname/casa/pl/hello-world-plugin/index.zul`, you should see the "NOT FOUND" error.

## Apply editions

You have now a good sense of how plugins work. Now let's alter the project a bit...

1. Edit the file `src/main/resources/assets/index.zul`. Remove `pt3` rule from `class` attribute of the sections wrapper. What does `pt3` mean?

1. Just **before** this tag, add `<z:include src="/back-home.zul" />`. This will make the contents of `back-home.zul` (at directory `app/src/main/webapp`) be included. Inspect that file, what does it do?

1. Alter the EL expressions in `label` tag so that the user's lastname is shown instead of username. 

1. Edit `HelloWorldVM` in the following way:

    Remove the line `sessionContext = ...` in `init` method, then edit `sessionContext` member by adding a `WireVariable` annotation like this:

    ```
    @WireVariable
    private ISessionContext sessionContext;
    ```
    
    `WireVariable` is an annotation of package `org.zkoss.zk.ui.select.annotation` which is a sort of equivalent for `javax.inject.Inject`. It allows us to reference an instance of `ISessionContext` (see `casa-shared` javadocs). Usage of `WireVariable` has a disadvantage though: you need to know the EL name of the bean you are trying to inject. 
    
    Specifically the injection above is equivalent to this one:

    ```
    @WireVariable("sessionContext")
    private ISessionContext sessionContext;
    ```
    
    if the variable name were `mySessionContext` instead of `sessionContext`, you would be forced to supply the parameter for the annotation. This parameter should match the EL name of the bean you are injecting, that is, the managed bean in Casa that implements the interface `ISessionContext` is annotated this way: `javax.inject.Named("sessionContext")`. If the bean weren't annotated with `Named`, `WireVariable` injection would give you a null reference.
    
    For the reasons above, `Utils.managedBean` is a safer way to go.
    
1. Save changes, and [repackage](#packaging) the project once more.

1. Deploy again an verify all is working as expected.


## Troubleshooting and testing tips

- First source for trouble investigation is the log file. Check your `/opt/gluu/jetty/casa/logs/casa.log` and read [this](#logging) beforehand

- While you get acquiantance with writing pages, you can use the `z:label` component to debug variable or expression values in zul. In most cases errors are caused by wrong usage of available namespaces. Locate an already existing page having a similar behaviour you desire and inspect its markup. This can save you lots of trial/error cycles. Also, it's good to work in small increments: do not attempt to write the entire page and backing Java code at once to test it thoroughly

- The life cycle for plugin development isn't tedious, but you can boost your performance by following the [Tips for plugin development](./tips-development.md)
