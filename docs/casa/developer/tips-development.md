# Tips for plugin development

The following are some techniques you can use to make development tasks more agile when writing plugins.

<!--

## Bootstrap a plugin using an archetype

Instead of creating a maven project from scratch, you can generate one quickly by leveraging the archetype.

This content will be added soon. TODO

-->

## Skipping package and deployment phases

In ["Introduction to plugin development"](./intro-plugin.md#development-lifecycle) we describe the typical steps developers may follow when developing Casa plugins. However, if by chance you ever touched upon the [internals](./plugin-management-internals.md#resource-extraction-and-registration) page, it's likely that you have come up with some shortcuts to be quicker. Here we describe how to get the most out of this.
    
Any change you need to apply on the plugin you have been working on that doesn't require the Java compiler to pitch in, like changes to Javascript, CSS, images, or ZK pages can be tested without redeploying your plugin. Here is what you need:

1. Connect to the VM where Gluu Server and Casa are running
1. Log in to the chroot
1. Locate the Jetty directory where Casa was exploded. This can be found at `/opt/jetty-9.4/temp` and has the form `jetty-localhost-8099-casa.war-_casa-any-RANDOM-CHARS.dir`
1. `cd` to `webapp/pl/<plugin-id>`
1. Upload the edited files that need revision to your VM
1. Retest your plugin features

!!! Warning
    Using this approach requires altering your `zk.xml` file in a suitable way for development use. Learn [here](intro-plugin.md#a-running-gluu-casa-installation) how to do so.
    
Although being able to change files this way doesn't seem like a big advantage, experience shows that it can save a lot of time. This is especially true when it comes to changes in visual layout, because this task requires a lot of attempts and experimentation to get the desired result. Not only can you replace files, you can also create new ones, which allows for more informal experiments during development.

Actually, **you can write Java** without requiring compilation. In ZK pages, you can include snippets of Java in `<zscript>` tags. See "ZScript" in [ZUML Reference](./intro-plugin.md#reference-docs) and "Scripts in ZUML" in [ZK Developers' Reference](./intro-plugin.md#reference-docs). ZScript can be used as a fast prototyping vehicle, but are not advised for use in production artifacts.

## Hot redeploy of jar files

When several files need to be updated and that includes Java classes, a cleaner approach is using the hot redeploying feature supported by Casa (starting with version 4.0). Here is how to proceed:

- Locally generate the jar file for the plugin to test 
- Connect to the VM and cd to `/opt/gluu/jetty/casa/plugins`
- Upload the file
- Wait 1 minute

More details can be found [here](./plugin-management-internals.md#hot-deployment).

Note this approach allows developers to save some clicks on the UI, not necessarily time.

!!! Warning
    It is a known issue that adding/modifying labels from the plugin's resource bundle doesn't take effect upon redeployment of the plugin. One way to overcome this is using a different file name for the jar file: remove the current jar and add another one named differently.

## Write a good manifest!

This won't make you more agile, but taking the time to write a good license and description notes in your plugin manifest file will allow you to communicate more effectively to others about the features you are delivering with your artifacts. You can also use the description note to describe prerequisites your plugin may have (such as interacting with an external system).
