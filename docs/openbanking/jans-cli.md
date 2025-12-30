## Introduction
Jans-cli is a command line interface to configure the Janssen software and it supports both interactive and command-line options for configuration.

Jans-cli calls the Jans-Config-API to perform various operations. During Janssen installation, the installer creates a client to use Jans Config API. Jans-cli uses this client to call Jans Config API.

## Supported Operations

Jans-cli supports the following six operations on custom scripts:

1. `get-config-scripts`: gets a list of custom scripts.
2. `post-config-scripts`: adds a new custom script.
3. `put-config-scripts`: updates a custom script.
4. `get-config-scripts-by-type`: requires an argument `--url-suffix TYPE: <>`.  
    You can specify the following types: 
    `PERSON_AUTHENTICATION`, `INTROSPECTION`, `RESOURCE_OWNER_PASSWORD_CREDENTIALS`, `APPLICATION_SESSION`, `CACHE_REFRESH`, `UPDATE_USER`, `USER_REGISTRATION`, `CLIENT_REGISTRATION`, `ID_GENERATOR`, `UMA_RPT_POLICY`, `UMA_RPT_CLAIMS`, `UMA_CLAIMS_GATHERING`, `CONSENT_GATHERING`, `DYNAMIC_SCOPE`, `SPONTANEOUS_SCOPE`, `END_SESSION`, `POST_AUTHN`, `SCIM`, `CIBA_END_USER_NOTIFICATION`, `PERSISTENCE_EXTENSION`, `IDP`, or `UPDATE_TOKEN`. 
5. `get-config-scripts-by-inum`: requires an argument `--url-suffix inum: <>`
6. `delete-config-scripts-by-inum`: requires an argument `--url-suffix inum: <>`

## Using jans-cli

1.  Download [`jans-cli.pyz`](https://github.com/JanssenProject/jans-cli/releases). This package can be built [manually](https://github.com/JanssenProject/jans-cli#build-jans-clipyz-manually) too.

1.  Get a client id  and its associated password. Here, we will use the client id and secret created for config-api. 
    ```bash
    TESTCLIENT=$(kubectl get cm cn -n <namespace> --template={{.data.jca_client_id}})
    TESTCLIENTSECRET=$(kubectl get secret cn -n <namespace> --template={{.data.jca_client_pw}} | base64 -d)
    ```

1. `client.crt` and `client.key` are the certificate and key files respectively for MTLS. We need to pass this certificate, key as the token endpoint is under MTLS and jans-cli obtains an appropriate token before performing the operation. 
    
    Use your `ca.crt` and `ca.key` that was provided during setup to generate as many client certificates and keys for operating jans-cli as needed.

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

1.  Run the jans-cli in interactive mode and try it out: 

    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --CC client.crt --CK client.key
    ```

## Examples

The `post-config-scripts` and `put-config-scripts` require various details about the scripts. The following command gives the basic schema of the custom scripts to pass to these operations.

```bash
python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --schema /components/schemas/CustomScript 
```

The output of the above command will be similar as:

```json
{
  "dn": null,
  "inum": null,
  "name": "string",
  "aliases": [],
  "description": null,
  "script": "string",
  "scriptType": "IDP",
  "programmingLanguage": "PYTHON",
  "moduleProperties": {
    "value1": null,
    "value2": null,
    "description": null
  },
  "configurationProperties": {
    "value1": null,
    "value2": null,
    "description": null,
    "hide": true
  },
  "level": "integer",
  "revision": 0,
  "enabled": false,
  "scriptError": {
    "raisedAt": null,
    "stackTrace": null
  },
  "modified": false,
  "internal": false
}
```

To add or modify a script first, we need to create the script's python file (e.g. /tmp/sample.py) and then create a JSON file by following the above schema and update the fields as :

/tmp/sample.json
```json
{
  "name": "mySampleScript",
  "aliases": null,
  "description": "This is a sample script",
  "script": "_file /tmp/sample.py",
  "scriptType": "PERSON_AUTHENTICATION",
  "programmingLanguage": "PYTHON",
  "moduleProperties": [
    {
      "value1": "mayvalue1",
      "value2": "myvalues2",
      "description": "description for property"
    }
  ],
  "configurationProperties": null,
  "level": 1,
  "revision": 0,
  "enabled": false,
  "scriptError": null,
  "modified": false,
  "internal": false
}
```

### Add a new custom script, update and delete existing custom script

The following command will add a new script with details given in /tmp/sampleadd.json file. __The jans-cli will generate a unique inum of this new script if we skip inum in the json file.__

```bash
python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id post-config-scripts --data /tmp/sampleadd.json \
--CC client.crt --CK client.key
```

The following command will modify/update the existing script with details given in /tmp/samplemodify.json file. __Remember to set inum field in samplemodify.json to the inum of the script to update.__

```bash
python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id put-config-scripts --data /tmp/samplemodify.json \
--CC client.crt --CK client.key
```

To delete a custom script by its inum, use the following command:

```bash
python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id delete-config-scripts-by-inum --url-suffix inum:HKM-TEST \
--CC client.crt --CK client.key
```

### Print details of existing custom scripts

These commands to print the details are important, as using them we can get the inum of these scripts which is required to perform update or delete operations.

1.  The following command will display the details of all the existing custom scripts. This will be helpful to get the inum of scripts to perform the update and delete operation.

    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id get-config-scripts --CC client.crt --CK client.key
    ```

1.  The following command displays the details of selected custom script (by inum). 

    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id get-config-scripts-by-inum --url-suffix inum:_____  \
    --CC client.crt --CK client.key
    ```

1.  Use the following command to display the details of existing custom scripts of a given type (for example: INTROSPECTION).

    ```bash
    python3 jans-cli-linux-amd64.pyz --host <FQDN> --client-id $TESTCLIENT --client_secret $TESTCLIENTSECRET --operation-id get-config-scripts-by-type --url-suffix type:INTROSPECTION \
    --CC client.crt --CK client.key
    ```
