# Coding credentials management

This page summarizes key facts about how enrollment logic for an authentication method can be added in Casa using a plugin. Ensure you understand well the process that users undergo when managing credentials in Casa:

1. At home page users are presented some sections (widgets): one allowing them to choose a preferred authentication method and others showing a summary of enrolled credentials they have added so far (for a set of authentication methods that administrator has [enabled previously](../../administration/admin-console.md#enabled-methods)).

1. A widget that shows a summary of credentials contains elements such as a title, a descriptive text, a button to take users to the actual enrollment page, and optionally some extra text. You will have to supply all of this elements in the plugin you are coding.

    ![enrollment page](../../img/developer/authn-methods/widgets.png)
    
1. The enrollment page for a specific method normally consists of a heading with a title and a descriptive text, followed by a detailed list of credentials. Buttons for edition and removal are provided. Plugin developers have to craft all these elements in their UI pages (normally using already existing enrollment pages as a guide). It is recommended to follow a similar structure as in existing enrollment pages, however you may present information to your users in a way you consider convenient.

    ![list of credentials](../../img/developer/authn-methods/credentials-detailed.png)
    
1. Below the credentials list, all the elements for actual enrollment should be presented. This varies widely among methods: some require a few text boxes and buttons, while others are more involved. In most cases, they require using specialized libraries (client and/or server side libs). Keep in mind the user experience is key in this part of the process so it should be intuitive and pleasant.

    ![enrollment page](../../img/developer/authn-methods/enrollment-page.png)

## Create a plugin
  
In the [introductory](./index.md#whats-next) page we highligthed the importance of some design points. Particularly in the enrollment logic, the following have to be very well-defined before any coding:

- How a credential will be represented in terms of data in the database?
- What parameters of the authentication method have effect on the enrollment process itself?

Follow the instructions given in [Introduction to plugin development](../intro-plugin.md) to create your first plugin. This will require you to setup an environment for development previously. Ideally, you should have your first experience with the dummy [Hello-World](../writing-first.md) plugin so that you get acquaintace with the [development lifecycle](../intro-plugin.md#development-lifecycle).

From here on we assume you have:

- A ready environment (dev tools, LDAP client, Gluu Server VM, etc.)
- A [clone or copy](../writing-first.md#download-project) of Casa sample plugins
- A maven project looking like:

```
+-- pom.xml
+-- src
    +-- main
        +-- java
        |   +-- com
        |       +--mycompany
        |          +-- casa
        |              +-- plugin
        |                  +-- MyAuthnMethodPlugin.java
        +-- resources
            +-- assets
            |   +-- index.zul
            +-- labels
                +-- zk-label.properties
```

## Maven descriptor

For `pom.xml` you can use the project file of "Hello World" found at Casa project in folder `plugins/helloworld/pom.xml`. Replace the elements to suit your tastes, there is a brief explanation of those [here](../writing-first.md#pom)

## Plugin class

In your plugin class (`MyAuthnMethodPlugin` in the example above), just supply a constructor with a single parameter and call the superclass constructor. It may look like:

``` 
package ...

import org.pf4j.*;

public class MyAuthnMethodPlugin extends Plugin {

    public MyAuthnMethodPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

}
```

## Create a extension class

Add a new class to the project (use a package location you like) and make it implement the interface `org.gluu.casa.extension.AuthnMethod`:

```
@org.pf4j.Extension
public class MyAuthnMethod implements AuthnMethod {
    ...
```

Please take a while to check the javadocs of `AuthnMethod`.

!!! Note
    Methods supported by default in Casa (u2f, otp, etc.) already follow the pattern of extensions. You can make direct analogies with the existing classes found in package `org.gluu.casa.plugins.authnmethod` and the one you are creating. The patterns to structure the code and do credential management can also be used as inspiration for you.  
    
### UI-related methods

These are a set of methods that map directly to what will be shown in the widget containing the summary of credentials for this type. Have the image below as a reference:

![widget authn method](../../img/developer/authn-methods/widget-summary.png)
    
- `getPanelTitleKey`: See box in gray
- `getPanelTextKey`: Red box
- `getPanelButtonKey`: Blue box
- `getPanelBottomTextKey`: Black box

These methods must not return text but the identifiers of the labels that actually contain it. As an example, if your authentication method has to do with iris scanning, you could have an entry in your project's `zk-label.properties` this way:

```
iris.method_title=Iris scanning
```

so `getPanelTitleKey` is implemented this way:

```
public String getPanelTitleKey() {
    return "iris.method_title";
}
```

Note that `getPanelBottomTextKey` is a default method, in this case if you don't need the extra text under the button, there is no need to implement it. Text referenced in this method can contain HTML markup, as the image shows.

With regard to `getUINameKey`, the text being referenced is used as the "official" name of your authentication method, and you will see it in different places, such as the introductory text at user's home, the enabled authentication methods page in admin dashboard, etc.

Finally, `getPageUrl` must return the relative URL (with respect to your plugin's assets directory) where the enrollment page will be accessible. If you followed the structure suggested [here](#create-a-plugin), returning "index.zul" suffices.

### Config-related methods

These are methods related to settings of your authentication method:

- `getAcr`: The acr you assigned this method when the custom script was created (display name in oxTrust GUI). This is normally a constant value.

- `mayBe2faActivationRequisite`: Whether this method should be treated as a candidate requisite for 2FA to be enabled (more info [here](../../administration/2fa-basics.md#forcing-users-to-enroll-a-specific-credential-before-2fa-is-available)). If you want to read this value from one property of your custom script read the section "[Reading configuration properties of a custom script](#reading-configuration-properties-of-a-custom-script)" below.

- `reloadConfiguration`: A method invoked directly by Casa when there is a change in the underlying custom script (think of it as a listener of an *onChange* event). This allows for example to re-read configuration parameters of the script which may potentially drive the behaviour
of the enrollment process of your plugin. Account this method is not called as soon as you change some property via oxTrust, it could take up to one minute for the call to be issued. Also, any change to the script (level, script contents, etc.) will trigger a call to `reloadConfiguration`.

### Credentials-related methods

These are summarizing methods which are called directly by Casa in different situations. These methods should not throw exceptions and be as performant as possible. Please check the javadocs.

- `getTotalUserCreds`: The number of credentials associated to this method that the user identified by the parameter passed has currently enrolled. The value of this parameter will be the `inum` attribute of the user.

- `getEnrolledCreds`: The list of credentials a user has currently enrolled. Very basic data is required, see class `org.gluu.casa.credential.BasicCredential`. This method is called for every authentication method enabled in Casa when a user hits the home page of the application.

These methods will probably require you to read data from the underlying database. The same goes when saving a credential for its enrollment. We will cover this aspects in "[Credentials retrieval](#credentials-retrieval)" section.

Interface `AuthnMethod` does not expose an "add" credential Java method since mechanisms for enrollment are varied and usualy demand several steps for completion which are far from being homogeneous.

## Reading configuration properties of a custom script

It is a common need to be able to read the properties of a script from within a plugin's code. Use the following as a guide:

```
IPersistenceService persistenceService = Utils.managedBean(IPersistenceService.class);
Map<String, String> properties = persistenceService.getCustScriptConfigProperties(acr);
//properties is null if the script does not exist, otherwise it will contain a key/value mapping of script properties
```

## Credentials retrieval

!!! Note
    This subsection assumes you are using LDAP. If this is not the case, please perform the analogies appropriately. Account Couchbase, for instance, is schemaless.

This [page](../ldap-data.md) contains some guidelines in order to manipulate data from your plugin's code. Take some time now to get the grasp of how database access work in Casa.

In the [introductory](./index.md#whats-next) page we mentioned about credential data modelling, so it's time to manually create some dummy entries to simulate the process of retrieval. Add all elements you consider relevant for your case, for instance: 

- Create your own object classes and attributes
- Add attributes to `gluuCustomPerson` object Class
- Create a sub-branch under a test user entry

Any of the above may require changing LDAP schema. [Here](../ldap-data.md#adding-attributes-to-directory-schema) you can find some useful instructions in this regard. 

Once you create some sub-entries or attributes under a test user representing a couple of already enrolled credentials, you can proceed to implement the logic to list credentials (useful for the user's home page and for the enrollment page). These are some hints:

- Create a persistence-aware Java class to represent the relevant info about a credential. You can use the concepts and examples found [here](../ldap-data.md#about-the-persistence-framework) for this.

- Create a separate Java class that will take charge of doing all credential management (CRUD over credentials). Focus on retrieval first: normally you will have to return a `List` of objects belonging to the previously created class.

- Implement methods `getTotalUserCreds` and `getEnrolledCreds` of interface `AuthnMethod` potentially reusing the work of your previous step.

## Quick test the achievements

Once you manage to do the above, you are ready to test how the summary of credentials looks in the home page for the testing user. Note we haven't started writing any UI page yet, we will tackle this later.

Follow the steps listed [here](../writing-first.md#packaging) to generate your plugin's jar package, and [here](../writing-first.md#loading-helloworld) to learn how to deploy your plugin.

Once your plugin is started successfully, go to `Enabled authentication methods` in the admin console. There, a new row will appear showing a new ACR with the name given by method `getUINameKey` of the extension coded. Ensure to select the plugin you created in the selection list and finally hit `Save`.

Open a separate browsing session (if user admin is not the testing user), and access the home page. You have to see a new widget appeared for your authentication method. Check the title, description, etc. look as you are expecting. The following is an example for Security keys:

![widget authn method](../../img/developer/authn-methods/widget-summary.png)

Make adjustments as needed. It is useful to drop some logging statements in your code, specially when starting, it can save you some time with continuous redeployments.

!!! Note
    In "[Tips for plugin development](../tips-development.md#skipping-package-and-deployment-phases)" you can find tricks to make your development cycle more agile.  

## Credentials retrieval - part 2

Once confident of your result, proceed to code your `index.zul` page or whatever return value you used for `getPageUrl` method of the extension. Choose any of the existing method pages to base your work on. The files are found in Casa project inside folder `app/src/main/webapp/user`:

|ACR|file|
|--------|--------|
|otp|otp-detail.zul|
|twilio_sms|twilio-phone-detail.zul|
|smpp|smpp-phone-detail.zul|
|super_gluu|super-detail.zul|
|u2f|u2f-detail.zul|
|fido2|fido2-detail.zul|

It will take some reading and inspection of existing code to understand how pages are built and how they are bound to backend classes. "[Adding UI pages](../ui-pages.md)" contains useful tech tips to write UI pages in Casa. A relevant overview of fundamental concepts can be found [here](../intro-plugin.md#ui-framework).
 
Once you are able to effectively show the detailed list of credentials for one user, you have enough background to tackle the most important thing: actual enrollment.

## Credentials enrollment

Steps for enrolling a credential clearly depend on the type of credential itself. Since there is no generalized formula the process can only be described in abstract terms:

- Add suitable UI elements to your page (e.g. textboxes, buttons, etc.) that users should fill for enrolling
- Add any required javascript libraries to your plugin and include those in your page. Copy these files in the `assets` directory of your project and use the "extra" content fragment to attach them to the page, as mentioned [here](../ui-pages.md#template-usage)
- Add presentation logic to the Java class you are using as controller of your page. This logic basically takes charge of receiving input from the user and storing it in temporary variables or small POJOs.
- Add the handlers to persist credentials to the database. Generally this involves filling a persistence-aware POJO with data previously grabbed from the user, and calling `add`, `modify`, or `delete` methods of `IPersistenceService`.

As you make progress with the task also ensure you have added:

- Tooltips where necessary
- Prompts to proceed in case of credential removal
- Alerts to nofify the general outcome of operations (e.g. enrollment success, update failure, etc.)

!!! Note
    It is strongly recommended to call method `notifyEnrollment(User, String)` defined at interface `org.gluu.casa.service.SndFactorAuthenticationUtils` after a successful enrollment takes place. Obtain an instance of `SndFactorAuthenticationUtils` via `Utils#managedBean`.

Enrollment pages of default authentication methods already have this kind of elements in place to bring users the best experience.
