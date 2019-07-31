# A sample client for Casa credentials enrollment

This is a client-side only application (HTML+JS). Intended to be illustrative and simple in order to writing a real app with enrollment capabilities. For your app, you **must** use server side technology!

- Check the swagger definition file of the API when interacting with endpoints (available in your casa installation at `https://host/casa/enrollment-api.yaml`)

- To try it, HTML files have to be served via HTTP/HTTPs (use a server such as Apache)

- Use fully qualified domain names for both client and server. `localhost` will not work

- Edit file **globals.js** prior to use

- Ensure to include this origin in [casa cors config](https://gluu.org/docs/casa/4.0/developer/rest-services/#cross-domain-consumption-of-services),
  that is, the domain you are using to serve this client (eg. https://my.local.org)

- This app has been tested on Firefox only

## Troubleshooting

If you face errors (in the browser's developer console) when accessing endpoints such as `/.well-known/openid-configuration`
or `/oxauth/restv1/token`, obtain a token manually and then gently add a line like `token = "token-value"` as the first statement
in the document.ready event handler for the page you are trying to visualize. The following shows how to obtain a token:

`curl -k -u 'clientId:clientSecret' -d grant_type=client_credentials https://<gluu-host-name>/oxauth/restv1/token`
