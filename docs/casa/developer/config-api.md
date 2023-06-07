# Config API

Most aspects of Casa that are configurable through the admin console UI can be programmatically operated using the configuration API. A formal description of the API can be found in this [swagger](https://raw.githubusercontent.com/GluuFederation/casa/version_4.4.0/app/src/main/webapp/admin-api.yaml) file. Note all endpoints are protected by tokens which must have the `casa.config` OAuth scope.

At a high level the following are the steps to get a token:

- Create an OAuth scope named `casa.config` (this can be done using oxTrust)
- Register or create a client with at least grant type `client_credentials`, response type `token`, and scope `casa.config` (this can be done using oxTrust as well)
- Request a token from oxAuth's token endpoint with the required scopes. This procedures varies and depends on the method selected to authenticate against the token endpoint when the client was created.

Once a token is obtained, it may be passed as a bearer token in the authorization header of the requests you make to the API endpoints.

## Clients for service consumption

You can quickly generate client stubs in a variety of languages and frameworks with [Swagger code generator](https://swagger.io/tools/swagger-codegen) using the swagger descriptor mentioned earlier. This allows developers to start interacting with the service quickly and easily saving lots of from boilerplate code.

In the github [repository](https://github.com/GluuFederation/casa/) of Casa, there is an example of a generated client in Java language (see `config-client` subdirectory). This client was employed to make some testing of the service itself!. 

You can reuse the client in your projects by pointing to the right artifact. If you use maven you can add the following snippet of code to your `pom`:

```
<dependency>
	<groupId>org.gluu</groupId>
	<artifactId>casa-config-client</artifactId>
	<version>4.4.0.Final</version>
</dependency>
```

## curl samples

The following contains sample requests and responses of some operations. 

**Notes**:

- Line breaks were added for readability
- It is assumed the token used has enough scopes to call the given endpoint
- Add the `-k` switch to bypass SSL cert checks

### Enabled authentication methods

Request:

```
curl -H 'Authorization: Bearer ...token here ...' -G 
    https://some.gluu.info/casa/rest/config/authn-methods/available
```

Response (OK):

```
["super_gluu", "fido2"]
```

### Disable one authentication method

Request:

```
curl -H 'Authorization: Bearer ...token here ...' -d acr=fido2 
    https://some.gluu.info/casa/rest/config/authn-methods/disable
```

Empty response (OK).

### Set the CORS domains

Request:

```
curl -H 'Authorization: Bearer ...token here ...'
    -X PUT -H 'Content-Type: application/json'
    -d '["http://we.rock", "https://some.biz"]' 
    https://some.gluu.info/casa/rest/config/cors
```

Empty response (OK).

### Get an authentication method's plugin data

Request:

```
curl -H 'Authorization: Bearer ...token here ...' -G
    https://some.gluu.info/casa/rest/config/plugins/authn-method-impl/bioid
```

Response:

```
[
    "pluginId": "bioid-plugin",
    "version": "4.1",
    "pluginDescription": "Allows usage of biometric credentials"
    "pluginClass": "org.gluu.casa.plugins.bioid.BioIDPlugin"
]
```
