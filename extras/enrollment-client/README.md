# A sample client for Casa credentials enrollment

This is a client-side only application (HTML+JS). Intended to be illustrative and simple in order to writing a real app with enrollment capabilities. For your app, you **must** use server side technology!

- Check the swagger definition file of the API when interacting with endpoints (available in your casa installation at `https://host/casa/enrollment-api.yaml`)

- To try it, HTML files have to be served via HTTP/HTTPs (use a server such as Apache)

- Edit file **globals.js** prior to use. Ensure to add your domain to the authorized Javascript origins of the OpenID client

- Ensure to include this domain in [casa cors config](https://gluu.org/docs/casa/3.1.4/developer/rest-services.md#cross-domain-consumption-of-services)

- This app has been tested on Firefox only
