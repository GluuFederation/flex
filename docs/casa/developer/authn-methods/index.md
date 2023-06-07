# Adding authentication mechanisms

This page summarizes the steps to follow when adding a new authentication method to a Gluu Casa instance, if a method isn't supported out-of-the-box in the Gluu Server for example. 

## Tasks

Supporting a new authentication method consists of two tasks: coding a custom interception script and creating a plugin that contributes an authentication method extension point. Let's elaborate a bit on this.

!!! Note
    Overall acquaintance with the Gluu Server will result in a more straightforward development process.  
    
### Coding custom interception scripts

Custom scripts are mechanisms supported by the Gluu Server to add a degree of flexibility to server behavior. They allow administrators to extend certain features and supply custom business logic. Particularly in the setting of strong authentication, they are instrumental in implementing authentication flows where a second factor should be presented once the usual username/password challenge is passed.
    
In the Gluu Server, custom scripts commonly contain both enrollment and authentication logic, that is, they normally allow users to add their own credentials, but also challenge users to present a valid credential in order to gain access to a protected resource. In the case of Casa, enrollment of credentials take place from within the application itself, thus requiring the custom script to implement only the authentication portion of the flow, i.e. ask a user to present a credential and determine whether it is valid or not.

Another important distinction from regular custom scripts is that Casa expects scripts to meet certain conditions which are required for the overall Casa authentication flow to work properly. Normally they don't entail a big effort. More details on this are explored on [this page](./authn-logic.md).

### Creating a plugin

The [index](../index.md) page of this guide describes what plugins are. It is important to familiarize yourself with how plugins work and how they are built before proceeding. [This document](../intro-plugin.md) and [this one](../writing-first.md)  cover most of what you need to know. 

Plugins can be very powerful and depending on the actual need, a mix of skills can be demanded. The following are the most relevant:

- Java programming 
- HTML/CSS/Javascript
- Database in use by your Gluu Server

The building blocks of plugins are called **extensions**. A plugin can bundle one or more extensions and they can be of different types. Every extension contributes ("adds") specific behavior. For the problem at hand, your plugin will just need one extension as well as one UI page (where credential enrollment will take place). Also you can include supporting Java classes or static files you may need.

A plugin that adds one (or more) authentication mechanisms will have a strong interaction with the the underlying Gluu database (eg. LDAP) since that's the natural place where users' credential data will be stored. Also, all configurations (parameters) of the authentication method itself should be there in the DB as well.

## What's next?

Now that you have a minimal grasp, we suggest planning before coding. Working on the design first will save you some valuable time. The following are some things you should figure out now:

- The `acr` value associated with your authentication method. This is a concept found often in [OpenID spec](http://openid.net/specs/openid-connect-core-1_0.html). In the case of the Gluu Server, this is a short "nickname" you assign to your script that serves the purpose of uniquely identifying the authentication mechanism it represents. Make a good choice, changing it afterwards may force you to change your Java code.

- How will you model and store credentials associated to the authentication method? As an example, if you were to add OTP tokens as the authentication method, how do you represent such credentials and what attributes will you use to store such info in the database?. Will you have to add attribute types to LDAP schema? If so, what syntaxes will be used?.

- Will you parameterize your authentication method? Using OTP as an example, you may have the key length as a parameter, or the number of digits that generated codes will have. Every possible authentication method on its own will have some characteristic you will prefer not to be hardcoded.

- What's the algorithm for authenticating users once they have supplied a valid username/password combination? Most probably it implies reading the user's stored credential from the database and do some crazy computation.

- Should this method be treated as a candidate requisite for 2FA to be enabled?. For more info, check [here](../../administration/2fa-basics.md#forcing-users-to-enroll-a-specific-credential-before-2fa-is-available).

- What should it happen when the plugin is removed from the system? Of course we don't want this to happen, but in case you were forced to do so, should enrolled credentials so far be removed, retained, or backed-up?

Now it's time to get into the details. You can proceed with the following links:

- [Coding authentication logic](./authn-logic.md)
- [Credentials management](./credentials-management.md)

To be able to tackle credential management, you have to have a custom script that implements the authentication logic created. This does not mean it has to be fully functional, a dummy script should suffice.

## Overriding an authentication mechanism

If you are interested in overriding how credential enrollment takes place for any of the default supported methods (e.g. Super Gluu, U2F keys, OTP, etc.), follow these steps:

- [Create a plugin](#creating-a-plugin) that contributes an authentication method extension point. This requires coding a class that implements the `org.gluu.casa.extension.AuthnMethod` interface. Of particular importance is returning the proper value for `getAcr` method. It should match the value that identifies the already existing custom script for the method.

- Associate the plugin to the authentication method: once the plugin is added to your Casa installation, visit the "enabled methods" section of Gluu Casa [dashboard](../../administration/admin-console.md#enabled-methods). In the row corresponding to the acr of interest, change "System" in the selection list by the plugin ID you have just added.

Next time you visit the home page, the default widget for that method will be replaced by one generated using the data supplied in your plugin extension.
