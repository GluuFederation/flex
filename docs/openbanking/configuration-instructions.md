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

<!--
## New Custom Scripts: 

This section presents details about useful interception scripts for an OBIE deployment. The scripts are accessible [here] (https://github.com/JanssenProject/jans-setup/tree/openbank/static/extension). Please setup [`jans-cli`](https://gluu.org/docs/openbanking/jans-cli/#using-jans-cli) prior to continuing. 
    
=== "Client Registration Script"

    ### Client Registration Script:
    
    The properties required for this script are defined in a [json file](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/client_registration/clientregistration.json) that follows the custom script schema as discussed [here](https://gluu.org/docs/openbanking/jans-cli/). Download the [script](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/client_registration/Registration.py), [JSON](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/client_registration/clientregistration.json) and keep them in a folder. 
    
    From this folder, run the following command: 
    
    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id post-config-scripts --data /clientregistration.json \
    -cert-file yourcertfile.pem -key-file yourkey.key
    ```
    
    Note: You will need keys and certificates to call the config-api using mutually authenticated TLS. 
    
    1. This script uses [jose4j](https://bitbucket.org/b_c/jose4j/wiki/Home) library for JavaScript object signing and encryption
    
        1.  Download the [`jose4j-0.7.7.jar`](https://bitbucket.org/b_c/jose4j/downloads/)
        
        1.   Create a `ConfigMap` containing the jar.
        
            ```bash
            kubectl create cm jose4j -n <gluu-namespace> --from-file=jose4j-0.7.7.jar
            ```
        
        1.  Add the volume and volume mount to `auth-server` in your [`override.yaml`](https://gluu.org/docs/openbanking/install-cn/#helm-valuesyaml) helm configuration.
        
            ```yaml
             volumes:
               - name: jose4j
                 configMap:
                   name: jose4j
             volumeMounts:
               - name: jose4j
                 mountPath: "/opt/jans/jetty/jans-auth/custom/libs/jose4j-0.7.7.jar"
                 subPath: jose4j-0.7.7.jar
            ```
        
        1.  Run helm upgrade.
        
            ```bash
            helm upgrade gluu gluu/gluu -n <gluu-namespace> --version=5.0.0 -f override.yaml
            ```

=== "Person Authentication Script"

    ### Person Authentication Script: 
    
    The properties required for this script are defined in a [json file](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/person_authentication/personauthentication.json) that follows the custom script schema as discussed [here](https://gluu.org/docs/openbanking/jans-cli/). Download the [script](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/person_authentication/OpenBanking.py), [JSON](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/person_authentication/personauthentication.json) and keep them in a folder. 
    
    From this folder, run the following command: 
    
    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id post-config-scripts --data /personauthentication.json \
    -cert-file yourcertfile.pem -key-file yourkey.key
    ```
    
    Note: You will need keys and certificates to call the config-api using mutually authenticated TLS. 
    
    
    The authorize endpoint when invoked passes the control to the PersonAuthentication Script.
    
    * **pepareForStep method**: This is the first method that gets called in the PersonAuthentication Script.
    
    The flow is as follows:
    
    1.  Build the URL to the consent app from the Internal OP (First party OP). The openbanking_intent_id is an important parameter that typically goes to the consent app.
    1.  Redirect to the 3rd Party URL.
    
    * **authenticate method**: When the third party consent app redirects back to Jans- Auth server, it returns to https://<hostname>/jans-auth/postlogin.htm. This takes us to the authenticate() method in the Person Authentication Script
    
    This is what needs to be done here:
    
    1.  To access request parameters use:
    
    ```   signedRequest = ServerUtil.getFirstValue(requestParameters, "request") ``` 
    
    1.  Add claims to session (those which you hope to find in access_token, refresh_token and id_token. The Introspection and UpdateToken script reads these session variables)
     
    ```
            sessionIdService = CdiUtil.bean(SessionIdService)
            sessionId = sessionIdService.getSessionId() # fetch from persistence
            sessionId.getSessionAttributes().put("openbanking_intent_id",openbanking_intent_id )
            sessionId.getSessionAttributes().put("acr_ob", acr_ob )
    ```
    
    *  All **session variables** should be returned from this method
    
    ```
    def getExtraParametersForStep(self, configurationAttributes, step):
              return Arrays.asList("openbanking_intent_id", "acr_ob")
    ```

=== "Introspection Script"

    ### Introspection Script:
    
    To easily setup this script, parameters are defined in a [json file](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/introspection/introspection.json) that follows the custom script schema as discussed [here](https://gluu.org/docs/openbanking/jans-cli/). Download the [script](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/introspection/IntrospectionScript.py), [JSON](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/introspection/introspection.json) and keep them in a folder. 
    
    From this folder, run the following command: 
    
    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id post-config-scripts --data /introspection.json \
    -cert-file yourcertfile.pem -key-file yourkey.key
    ```
    
    Note: You will need keys and certificates to call the config-api using mutually authenticated TLS. 
    
    This script can be used to add (persist) custom claims in an access token (and refresh token)
    * Access values from the session 
    
    ```
    sessionIdService = CdiUtil.bean(SessionIdService)
    sessionId = sessionIdService.getSessionByDn(context.getTokenGrant().getSessionDn()) # fetch from persistence
    
    ```
    
    * Add it to access token
     
    ```
         openbanking_intent_id = sessionId.getSessionAttributes().get("openbanking_intent_id")
         responseAsJsonObject.accumulate("openbanking_intent_id", openbanking_intent_id)
    ```
    
    * To persist claims in a refresh token refer to the following [article](https://github.com/GluuFederation/oxAuth/wiki/Retain-access-token-claim)

=== "Update Token Script"

    ### Update Token Script:
    
    To easily setup this script, parameters are defined in a [json file](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/update_token/updatetoken.json) that follows the custom script schema as discussed [here](https://gluu.org/docs/openbanking/jans-cli/). Download the [script](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/update_token/UpdateToken.py), [JSON](https://github.com/JanssenProject/jans-setup/blob/openbank/static/extension/update_token/updatetoken.json) and keep them in a folder. 
    
    From this folder, run the following command: 
    
    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id post-config-scripts --data /updatetoken.json \
    -cert-file yourcertfile.pem -key-file yourkey.key
    ```
    Note: You will need keys and certificates to call the config-api using mutually authenticated TLS. 
    
    This script can be used to add custom claims to the id_token.
    As per the open banking standard, the token should contain claim **openbanking_intent_id** and the same value should also reflect in the **sub** claim.
    A similar expectation is required to be fulfilled by the FAPI-RW standard where the sub claim should have the user id.
    
    * Access values from the session 
    
    ```
    sessionIdService = CdiUtil.bean(SessionIdService)
    sessionId = sessionIdService.getSessionByDn(context.getTokenGrant().getSessionDn()) # fetch from persistence
    
    ```
    
    * Add it to id_token token. 
     
    ```
        # header claims
        jsonWebResponse.getHeader().setClaim("custom_header_name", "custom_header_value")
                
        #custom claims
        jsonWebResponse.getClaims().setClaim("openbanking_intent_id", openbanking_intent_id)
                
        #regular claims        
        jsonWebResponse.getClaims().setClaim("sub", openbanking_intent_id)
    
    ```

!!!note
    After any changes in the custom scripts remember to restart the jans-auth service to apply them by restarting `kubectl rollout restart deployment gluu-auth-server -n <gluu-namespace>`.

-->
