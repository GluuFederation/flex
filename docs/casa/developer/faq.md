# Frequently asked questions (for developers)

## Plugin developement

### How many extensions can a plugin advertise?

There is no limit on "how much" functionality a plugin may add. Normally every plugin should consist of a small number of extension points and supporting files all tightly related to the same topic.

### Can several plugins implementing the same authentication method coexist?

Yes (in the sense those plugins can all be started), however only one plugin can be associated to an authentication method at a time. Also, if a plugin bundles several extensions mapping to the same acr, only one of them will take effect. The rest will be skipped.

### Can I use dependency injection in my plugins?

No. You can merely obtain certain managed bean references by using the `org.gluu.casa.misc.Utils` class.

### How do I use an external java library to my plugin?

Simply add it to your project as you normally would. Ensure the jar files needed will be part of the resulting fat jar (aka "jar with dependencies"). Check the runtime libraries already available in casa (see [dependencies](./intro-plugin#dependencies)), if you find something you can use there, just assign a `provided` scope to the dependency you are interested in.

### How do I have access to objects such as the HTTP request?

You don't normally need to, but here is an example on how to obtain references to `javax.servlet.http.HttpServletRequest` and `javax.servlet.http.HttpSession` objects respetively:

```
request = org.gluu.casa.misc.WebUtils.getServletRequest();
session = request.getSession();
```

## Enrollment APIs

### Are enrollment APIs protected?

Yes. To be able to do any useful interaction, you have to pass in the authorization header of your requests a token.

### How do I obtain a token?

From oxAuth's token endpoint. For this purpose, you have to register a client previously, say, by using oxTrust admin GUI. You might use the already existing casa client as well. Ask your administrator for instructions on how to do so and how to pass a token in HTTP headers.

### Do I need special setup before using the endpoints?

Authentication methods are parameterized by configuration properties set in oxTrust (`Configuration` > `Manage custom scripts`). This normally requires providing some values to setup behavior, for example:

- `twilio_sms`: The details of a Twilio account to be able to send SMS.
- `otp`: A configuration file containing key length, algorithm, and number of OTP digits.
- `super_gluu`: A credentials file that configures the underlying service to send mobile pushes for Android and iOS. Optionally a license file to remove advertisements.

Before attempting the endpoints, make sure the scripts are already running and well configured according to your organization needs. Ask your administrator.

### How does enrollment process work?

Enrolling a credential is not simply a matter of calling an endpoint supplying some data. Since enrollment requires the user to present some data or device standing at his browser, the process consists of several steps where some data must be partially supplied and validated until the operation is considered complete.

The swagger document of the API (ie. `https://<host>/casa/enrollment-api.yaml`) and the client found in [extras directory](https://github.com/GluuFederation/casa/tree/version_4.4.0/extras/enrollment-client) illustrate the steps required for every type of credential (authentication method).

### How can I visualize an enrollment?

Every authentication method has at least one API endpoint that allows to *save* or *finalize* a credential enrollment. Once you receive a positive response from it, you can simply navigate to Casa (with the user you were doing enrollments on behalf): the enrollment will appear in the home page of the application.

### Can I use the API to get/set 2FA data?

The API provides some operations to retrieve the status of a user in terms of 2FA as well as to turn 2FA on and off. Check the swagger document of the API. 

## My problem is not listed here

Feel free to open a [support](https://support.gluu.org/) ticket.
