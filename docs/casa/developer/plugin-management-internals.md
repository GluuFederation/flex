# Plugin management internals

This page does not cover aspects needed for plugin development. It surveys how Casa handles some aspects of plugin processing under the hood. This information can be useful for developers of Casa or to understand certain behaviors of plugins.

## Hot deployment

Every time a plugin is uploaded, its jar file is copied to `/opt/gluu/jetty/casa/plugins`. A background task is in place so that when a change in the directory contents is detected, a proper action is triggered, like loading and starting the plugin.

If you manually replace a jar file in the plugins dir, the plugin will be unloaded and then loaded and started. If a file is dropped then the plugin will be stopped and then unloaded.

If two different jars reference the same plugin, one of the jar files will be removed automatically. Make sure to overwrite existing jar files to ensure the most recent is being used.

## Resource extraction and registration

When a plugin is started, the following occurs internally:

- All files in the `assets` directory are extracted into the application's exploded directory inside `pl/<plugin-id>` 
- A new custom ZK Label Locator is registered. This allows labels defined in jar file `labels` directory to be recognized by the ZK framework 
- The jar is thoroughly scanned to search for JAX-RS resources annotated with `javax.ws.rs.Path`. These classes are attached to the RestEasy registry and associated with URLs prefixed by `https://<host>/casa/rest/pl/<plugin-id>/`
- A new log4j2 appender is added dynamically, based on the plugin's `Logger-Name` metadata property

When a plugin is unloaded, the analog steps are performed to de-register all elements added dynamically. Also, plugin assets are removed.

## Default (system) extensions

Casa uses the PF4J concept of [default/system extensions](https://pf4j.org/doc/defaultsystem-extension.html) to implement the authentication mechanisms supported out of the box. Basically these are extensions that are not tied to a plugin. This approach was employed for developers to have examples to follow when adding authentication mechanisms in their plugins.

Currently, Casa has the following system extensions:

- `org.gluu.casa.plugins.authnmethod.OTPSmsExtension` for OTP sent via SMS (using Twilio service)
- `org.gluu.casa.plugins.authnmethod.OTPSmppExtension` for OTP sent via SMS (using SMPP)
- `org.gluu.casa.plugins.authnmethod.SecurityKeyExtension` for U2F security keys
- `org.gluu.casa.plugins.authnmethod.SecurityKey2Extension` for FIDO 2 security keys
- `org.gluu.casa.plugins.authnmethod.OTPExtension` for OTP tokens (hard and soft)
- `org.gluu.casa.plugins.authnmethod.SuperGluuExtension` for Super Gluu devices
