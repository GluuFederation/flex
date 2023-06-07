# REST Services

Plugin developers can add RESTful web services to Casa easily. Simply create your resource classes and use JAX-RS 2.0 annotations such as `@Path`, `@GET`, `@POST`, etc. so when a plugin is started all endpoints are dynamically added.

There is no need to add extra dependencies to your project. Module `casa-shared` already includes most of what you'll need. In summary, the following is required to add a RESTful service:

1. Create a class in your plugin (any package and file name is fine)
1. Annotate the class with `javax.ws.rs.Path` and supply a value for the annotation
1. Annotate the class with `org.gluu.casa.rest.RSResourceScope` if you want to specify whether the resource should be treated as a singleton or a new instance should be created upon every request. If not used, default behavior will be "singleton"
1. Add methods with annotations such as `@Path`, `@GET`, `@POST`, etc. (i.e. implement your service)

Services created this way will be available at the URL

```
https://<host>/casa/rest/pl/<plugin-id>/<path>
```

where `path` is the value supplied in step 2.

## Protection

By default, all services are anonymously accessible. In case you want to protect your endpoints, Casa allows you to do so by means of an OAuth token, that is, clients of the service must pass in the Authorization header of HTTP requests a valid bearer token. It must be obtained via an OpenID client registered in the underlying Gluu Server.

!!! Note
    Registering OpenID clients and getting access tokens is out of the scope of this document, but you can check [this](https://tools.ietf.org/html/rfc6750) for a quick start.  

To make a method protected, simply add the annotation `org.gluu.casa.rest.ProtectedApi` to it and optionally set the scopes you require the token to have, for instance `@ProtectedApi(scopes = {"read", "write"})`. If you use the annotation at the class level, the method will still be considered protected if it has no annotations. Also method annotations override those at the class if any.

The following HTTP status codes could arise when using protected methods:

- FORBIDDEN (403): This will arise when access was attempted to a protected endpoint but no token was passed.

- UNAUTHORIZED (401): The token passed was invalid (it has expired for instance) or does not have the expected scopes. To handle the former case, clients of the service should re-request an access token (e.g. with a refresh token), and retry accessing the endpoint.

## JSON support

Casa uses the RESTEasy 3.0 library (an implementation of JAX-RS 2.0 specification) internally. Developers are subject to Jackson 2.0 for JSON content marshalling (classes with `com.fasterxml` annotations). The jettison (JAXB) and the Jackson 1.9.x providers are not supported.

## Cross domain consumption of services

When building client-side only applications (HTML+CSS), accessing services located in servers not in the same origin domain can be a big blocker. For these reasons, you can add your origin domain to the set of allowed origins of Casa to overcome the problem. For this, simply do the following:

- Login to Gluu chroot
- `cd` to `/opt/gluu/jetty/casa`
- `touch` file `casa-cors-domains`
- Add the domains you want to grant access to, one per line, and then save. For example:

``` 
http://myapp.acme.com
https://some.app.acme.com
```

Wait 1 minute for the change to take effect and try a request from your browser. You will see the preflight request (OPTIONS HTTP method) contains suitable response headers and the actual responses can be read from your javascript code.

For more information on Cross-Origin Resource Sharing (CORS), visit this [page](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
