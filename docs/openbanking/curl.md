# Managing scripts with CURL

## Curl Prerequisites

- Gluu open banking distribution
- client-id
- client-secret
- client certificate
- client key

## Getting the prerequisites

1.  Get a client id  and its associated password. Here, we will use the client id and secret created for config-api. 
    ```bash
    TESTCLIENT=$(kubectl get cm cn -n <namespace> --template={{.data.jca_client_id}})
    TESTCLIENTSECRET=$(kubectl get secret cn -n <namespace> --template={{.data.jca_client_pw}} | base64 -d)
    ```

1. `client.crt` and `client.key` are the certificate and key files respectively for MTLS.

    Use your `ca.crt` and `ca.key` that was provided during setup to generate as many client certificates and keys as needed.

    If you have an existing helm deployment, you can retrieve `ca.crt` and `ca.key` using the following commands:
    ```bash
    kubectl get secret cn -n <namespace> --template={{.data.ssl_ca_cert}} | base64 -d > ca.crt
    kubectl get secret cn -n <namespace> --template={{.data.ssl_ca_key}} | base64 -d > ca.key
    ```


1.  Generate client.crt and client.key files:
    ```bash
    openssl req -new -newkey rsa:4096 -keyout client.key -out client.csr -nodes -subj '/CN=Openbanking'
    openssl x509 -req -sha256 -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 02 -out client.crt
    ```

## CURL operations

1.  The curl commands to list, add, or update custom script require a token, so first call the token endpoint to get the token using:

    ```bash
    curl -u $TESTCLIENT:$TESTCLIENTSECRET https://<FQDN>/jans-auth/restv1/token -d  "grant_type=client_credentials&scope=https://jans.io/oauth/config/scripts.readonly" --cert client.crt --key client.key
    ```
    
    Example:

    ```bash
    curl -u '1801.bdfae945-b31d-4d60-8e47-16518153215:rjHoLfjfsv2G2qzGEasd1651813aIXvCi61NU' https://bank.gluu.org/jans-auth/restv1/token -d  "grant_type=client_credentials&scope=https://jans.io/oauth/config/scripts.readonly" --cert apr22.crt --key apr22.key
    {"access_token":"ad34ac-8f2d-4bec-aed3-343adasda2","scope":"https://jans.io/oauth/config/scripts.readonly","token_type":"bearer","expires_in":299}
    ```

1. Save the `access_token` for use in subsequent commands.

1.  Use different scope values as per the requirement:

    1.  View scripts information: https://jans.io/oauth/config/scripts.readonly

    1.  Manage scripts-related information: https://jans.io/oauth/config/scripts.write

    1.  Delete scripts-related information: https://jans.io/oauth/config/scripts.delete

1.  Use the obtained access token to perform further operations on custom scripts as given in subsequent text:

    1.  Use the following command to display details of all the available custom scripts:

        ```bash
        curl -X GET https://<FQDN>/jans-config-api/api/v1/config/scripts -H "Accept: application/json" -H "Authorization:Bearer <access_token>" -H "Content-Type: application/json"
        ```
        
        Example:

        ```bash
        curl -X GET https://bank.gluu.org/jans-config-api/api/v1/config/scripts -H "Accept: application/json" -H "Authorization:Bearer ad34ac-8f2d-4bec-aed3-343adasda2" -H "Content-Type: application/json"
        ```     

    1.  The following command will add a new custom script (Obtain token with write scope) and if it is successful it will display the added script in JSON format. The scriptformat.json file has script details according to the custom script schema. It should have the entire script inside the scriptformat.json as a string value under the script field. Converting a multiline script into a string requires converting newlines into \n. So curl is not a suitable choice for adding new script, jans-cli is a better option.
    
        ```bash
        curl -X POST "https://<FQDN>/jans-config-api/api/v1/config/scripts" -H  "Accept: application/json" -H "Authorization:Bearer <access_token>" -H "Content-Type: application/json" --data @/home/user/scriptformat.json
        ```
        
        Example:

        ```bash
        curl -X POST "https://bank.gluu.org/jans-config-api/api/v1/config/scripts" -H  "Accept: application/json" -H "Authorization:Bearer ad34ac-8f2d-4bec-aed3-343adasda2" -H "Content-Type: application/json" --data @/home/user/scriptformat.json
        ```

