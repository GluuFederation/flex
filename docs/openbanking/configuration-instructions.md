## Generate/install keys and certs for Gluu Open Banking Identity Platform

This section covers details about setting up the keys and certificates in Cloud-Native distribution.

* For MTLS keys, see the document that demonstrates [enabling mTLS in nginx ingress](https://gluu.org/docs/openbanking/install-cn/#enabling-mtls-in-ingress-nginx).

Remember, MTLS is needed not only for the TPPs to call the authorization and token endpoints for OpenID Connect flows, but also by clients that are calling the configuration API.

## Add/Update Custom Scripts:

To add or update custom scripts, you can use either `jans-cli` or `curl`.

* `jans-cli` in interactive mode, `option 13` enables you to manage custom scripts. For more info, see the [docs](https://gluu.org/docs/openbanking/jans-cli/).

* `jans-cli` in command line argument mode is more conducive to scripting and automation. To display the available operations for custom scripts, use `config-cli.py --info CustomScripts`. See the [docs](https://gluu.org/docs/openbanking/jans-cli) for more info.

* To use `curl` see these [docs](https://gluu.org/docs/openbanking/curl/#managing-scripts-with-curl)

Note: If using VM installation you can normally find `jans-cli.py` in the `/opt/jans/jans-cli/` folder.

