# Frequently Asked Questions (FAQ)


### Why is the Gluu Flex Admin UI displaying the following error message after the Flex VM installation?

```
Error Code: 404
The requested page was not found on this server.
```

This error is displayed when Gluu Flex Admin UI is not properly installed. 

1. Check if Gluu Flex Admin UI build is present at `/var/www/html/admin`.

```
Error Code: 503
Gluu Flex Admin UI is not getting any response from the backend (Jans Config Api).
```

Gluu Flex Admin UI facilitates interaction with the Jans Auth Server through a REST API layer, [Jans Config API](https://docs.jans.io/v1.0.16/contribute/implementation-design/jans-config-api/). This error prompts administrators to perform a series of troubleshooting steps.

1. Check the status of Jans Config API service. It can be simply verified using command `systemctl status jans-config-api.service`.
2. It is essential to verify the server's network connectivity, including firewall rules, ports, and routing, to ensure that there are no network-related impediments preventing communication with the Jans Config API. Jans Config API runs at port `8074` for Janssen vm installation.
3. Check Jans Config API logs at `/opt/jans/jetty/jans-config-api/logs/configapi.log` to see if there is any error.
4. Check Admin UI logs at `/opt/jans/jetty/jans-config-api/logs/adminui.log` to see if there is any error.
5. Check `/opt/jans/jetty/jans-config-api/custom/libs/gluu-flex-admin-ui-plugin.jar` exits. This is Admin UI's backend jar in form Jans Config API extension.

```
Error Code: 500
Error in generating token to access Jans Config Api endpoints.
```

Jans Config API endpoints are protected and require token with the appropriate scopes for access. This error displayed when there is some internal server error in generating `Jans Config API` access token.

1. Check Gluu Flex Admin UI log at `/opt/jans/jetty/jans-config-api/logs/adminui.log` to see any error in requesting token.
2. Check Janssen Auth server log at `/opt/jans/jetty/jans-auth/logs/jans-auth.log` (in debug/trace mode) to see any error while generating token. 

### Why is the Gluu Flex Admin UI is displaying following page to upload SSA? 

![image](../../assets/admin-ui/upload-ssa.png)

During installation, we need to provide a Software Statement Assertion (SSA) which is used by Admin UI to register an OIDC client to access license APIs. Check the following [guide](../../install/software-statements/ssa.md) for the steps to issue SSA from the Agama Lab web interface. The SSA used during installation has expired or become invalidated; therefore, you need to upload the SSA again to access the Admin UI.

### Why is the Gluu Flex Admin UI is displaying following message on screen to generate trial license?

![image](../../assets/admin-ui/license-error-payment-required.png)

```
Payment Required.
```

This message indicates that you will need to subscribe for Gluu Flex Admin UI license at [Agama Lab](https://cloud.gluu.org/agama-lab) site to enjoy long term access.

```
License validity period has expired.
```

This message is displayed when a user tries to generate a trial license (from the Admin UI) after the trial license generated previously has expired. The Admin UI 30-day trial license can only be generated once for an Agama Lab user.  