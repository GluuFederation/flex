# Manipulating data

!!! Note
    Content in this page regards LDAP mostly, if you are using other type of database in your Gluu Server it is generally not difficult to find direct analogies. If you have questions or need troubleshooting please open a support ticket.

Gluu LDAP directory is key in Gluu Casa [architecture](./architecture.md#backend). Plugins are very likely to require LDAP interaction so it's important to learn how this works in Casa. Formerly in the [introductory page](./intro-plugin.md) we highlighted the importance of `casa-shared` module which brings an abstraction to easily perform CRUD. In this page we will get into the details and provide some useful examples.

## Requisites

Before proceding ensure you have:

- [A basic grasp of LDAP](./intro-plugin.md#ldap-notions)
- The means to connect to Gluu lightweight directory, as mentioned [here](./intro-plugin.md#find-a-graphical-ldap-client). Normally, you'll use the `o=gluu` base branch DN.

## Know your LDAP

It is important to get some acquaintance with the structure of the directory. One you connect you will see two branches, `ou=appliances` and `o=...`. The former contains mostly configuration of the server itself, the latter holds more interesting stuff for developers such as:

- Users and groups data
- OpenID clients and scopes
- Custom scripts

Traverse the tree. Use your LDAP client to inspect schema, that way you can familiarize with the most relevant object classes (e.g. `gluuPerson`) and attributes types they can hold (e.g. `nickname`).

### Adding attributes to directory schema

While Gluu schema exhibits lots of attribute types, there are cases where you need to add your own attributes to cope with particular needs, for instance, storing user's age.

This [page](https://gluu.org/docs/ce/admin-guide/attribute#custom-attributes) is a reference doc demonstrating how an attribute can be added to directory schema. In this case an attribute is added to `gluuCustomPerson` object class, but you can use any other or even create your own. Basically you need to:

1. Choose a name and a description for the attribute.
1. Assign a syntax (e.g. string, boolean, etc.). For more information check RFC 4517 or search "LDAP syntax definitions" in the web.
1. Assign the attribute to one or more object classes.
1. Save the editions in the (plain text) schema file of your LDAP server.
1. Restart the LDAP service. Normally this service will not start if the supplied changes don't have the correct format expected by the LDAP implementation bundled in your Gluu Server.

For plugin development there is no need to register the attribute in oxTrust unless you know you'll need to inspect the attribute in oxTrust itself.

### Branches DNs

Instances of `org.gluu.casa.service.IPersistenceService` interface provide some `get*` methods to easily obtain distinguished names for the most relevant branches in the directory. Accessing DNs allow plugin developers to specify proper locations for searches or updates.

### POJOs for reuse

`casa-shared` provides a few [persistence compatible POJOs](./intro-plugin.md#persistence-ready-pojos) you can reuse or extend when developing. Plugin requirements are varied so we decided not to provide ready-to-use classes for the majority of existing LDAP object classes. This would have resulted in classes with several dozens of fields (plus associated getters and setters) that are not as meaningful as having small tailored focused classes on modeling the problem at hand. Additionally, writing your own classes will allow you to understand how modeling works and do troubleshooting if problems arise.

## About the persistence framework

If you have ever used the Java Persistence API (JPA), the term "object/relational mapping" may result familiar to you. It consists of a series of rules and annotations to facilitate managing relational data in Java applications. The oxcore persistence framework is aimed at solving a similar problem: it allows to express (via annotations) the logical rules to store a Java object into a database, and the conversion (retrieval) of an entry into a Java object.
    
Now let's proceed with an example. Here, we will create a properly annotated POJO and put it to work on real data.

## A simplified client management tool

Suppose your boss asked you to write a plugin so that your Gluu administrator can edit some details of the existing OpenID Connect Clients found in the Gluu Server installation. Of particular interest is the possibility to assign ownership to clients. This ownership would consist of assigning one or more existing users to a client.

Admins are supposed to have access to a page of your plugin where clients are listed and when a item of the list is selected, client's details are shown as well as the possibility to assign people to it.

In the following, we will focus on what needs to be done just from data perspective. You'll have to figure out how to build the UI and presentation logic code.

### Key facts from schema

Task description involves at least the following is required to fulfil:

1. Query the existing clients. Assume we only need to show their names in the list.
1. Obtain the information of a particular client. In practice OpenID clients have a bunch of attributes, assume only identifier, name, and owners will be shown.
1. Modify the owners of a client. To keep this simple, only usernames will be displayed.

If you have some Gluu LDAP acquaintance, you already know clients are stored under `ou=clients,o=...,o=gluu` branch. Every entry listed there 	correspond to a single client which you can also visualize via oxTrust web console (navigate to `OpenID` > `clients`).

After some LDAP inspection the following facts are worth noting:

- There is an objectClass named `oxAuthClient` to which every client (entry) belongs to.
- Associated to `oxAuthClient` there are around 60 LDAP attribute types in the schema.
- There is an attribute type `associatedPerson` that can serve the purpose of storing the ownerships needed. This attribute has syntax `1.3.6.1.4.1.1466.115.121.1.12` also known as "distinguished name". In other words, `associatedPerson` can be used to reference DNs users (no their user names directly).
- Users are stored under `ou=people,o=...,o=gluu` branch, and subordinate entries belong to `gluuPerson` objectClass. There is an attribute `uid` where the user name is stored.

### Generating a persistence-aware POJO

Most of the complexity in this tasks revolves around retrieving and updating clients, so let's create a Java class that allow us to manipulate client data!. 

In your IDE or favorite editor you are using to code your plugin, create a java package (eg. `com.mycompany.casa.plugins.clientmanager`) with an empty Java class named `Client` for instance. Then do the following:

- Make it a subclass of `org.gluu.persist.model.base.InumEntry` (ie. add a suitable `extends` clause)

- Annotate the class with `org.gluu.persist.annotation.DataEntry` and `org.gluu.persist.annotation.ObjectClass`

- Make the parameter `value` of `ObjectClass` be "oxAuthClient" (ie. `@ObjectClass("oxAuthClient")` )

- Add a `String` field in this class named `displayName`, annotate the field with `org.gluu.persist.annotation.AttributeName`

- Add a `List<String>` field named `owners` field and annotate the field with `org.gluu.persist.annotation.AttributeName`

- Supply for parameter `name` of the annotation the string "associatedPerson" (ie. `@AttributeName(name = "associatedPerson")` )

- Generate getters and setters for both `displayName` and `owners`

That's all we will need in order to query clients. Save your file.

### Do some retrieval

Create a Java class intended for manipulating clients (for instance `ClientService`). Add to it:

- A private field `persistenceService` of class `org.gluu.casa.service.IPersistenceService`
- Add a public, zero parameters constructor and initialize `persistenceService`. You can do `persistenceService = org.gluu.casa.misc.Utils.managedBean(IPersistenceService.class);`
- Create a method `getClients` that returns a `List<Client>`
- Perform a retrieval of all clients and return it, it is this simple: `persistenceService.find(Client.class, persistenceService.getClientsDn(), null);`

Here `persistenceService` is the object you use to interface with Gluu LDAP (there is no need to worry about LDAP connection details). In the command above, `find` will query all entries under `ou=clients,o=...,o=gluu` that are structurally conformant to `Client` class, that is, entries that belong to `oxAuthClient` objectClass. The actual query will only account for the attributes that are mapped as fields in `Client` class not the whole attributes found at each entry.

**Test it!**: Override `start` method of your plugin class and instantiate `ClientService` in it, then call `getClients`. You can use a logging statement like the following to print the names of all Gluu Server clients registered so far:

```
logger.info("{}", clientService.getClients().stream().map(Client::getDisplayName)
    .collect(Collectors.toList()).toString())
```

Compile, pack your plugin, and deploy it. You should be able to see the list printed in Casa log.

### Retrieve info of a particular client

So far point 1 of basic goals listed [here](#key-facts-from-schema) is satisfied. Now let's try to gather information of a single client, having `inum` as key to retrieve it:

- Add a method `getClient` to class `ClientService` receiving one `String` parameter, say `id`
- Copy the following:

```
Client client = new Client();
client.setInum(id);
client.setBaseDn(persistenceService.getClientsDn());
return persistenceService.find(client)
		.stream().findFirst().orElse(null);
```

Lines 1-3 creates a `Client` object that resembles the real client we want to find. It sets its `inum` and the DN under which it should belong to (ie. `ou=clients,o=...,o=gluu`). Line 4 executes a search for `Client` instances that "look like" `client` object.

Since `find` method returns a `List`, in line 5 we try to retrieve just the first item: Due to this search being performed using the client's unique identifier, the list could have zero or one elements.

**Test it!**: Add to your plugin's `start` method a call to `getClient` passing, for instance a harcoded `inum` value. You can print the client contents this way:

```
logger.info("Client {} has owners {}", 
    client.getDisplayName(), client.associatedPerson());
```

We are already done with point 2 of the [list](#key-facts-from-schema). Let's move onto the more interesting 3 (modifying).

### Setting the owners of a client

This task only involves retrievals so you can easily extrapolate your current knowledge to the field of users. This time use as base the branch `persistenceService.getPeopleDn()` (ou=people,o=...,o=gluu) and `gluuPerson` as structural class. Actually, for our toy example you can write a class that reuses `org.gluu.casa.core.model.BasePerson` (found in `casa-shared` maven dependency).

Assuming `client` variable represents the instance you want to assing owners to, you can do the following:

```
//People to co-own this client
Stream<BasePerson> owners = Stream.of(larry, moe, curly... 
List<String> peopleDNs = owners.map(BasePerson::getDn).collect(Collectors.toList());
client.setAssociatedPerson(peopleDNs);

persistenceService.modify(client);
```

`modify` takes charge of the underlying complexity of LDAP entry updates. Just ensure `client` was previously retrieved with a call to `find`. The return value here was ignored (a boolean value), in a real world example, you should add logic to process whether the update was successful or not.

This basically covers the need. There are more useful methods found in `org.gluu.casa.service.IPersistenceService` to manipulate the database. We encourage you to check this interface java docs.

### The final result

The fully functional code for this plugin can be found in the sample plugins folder [here](https://github.com/GluuFederation/casa/tree/version_4.4.0/plugins/samples/clients-management). Once installed login as administrator, and go to `Administration console` > `clients ownership`.
