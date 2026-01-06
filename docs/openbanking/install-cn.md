# Cloud-Native

## System Requirements


Use the listing below for a detailed estimation of the minimum required resources. The table contains the default resources recommendation per service. Depending on the use of each service the resources need may increase or decrease.

|Service           | CPU Unit   |    RAM      |   Disk Space     | Processor Type | Required                                    |
|------------------|------------|-------------|------------------|----------------|---------------------------------------------|
|Auth-server       | 2.5        |    2.5GB    |   N/A            |  64 Bit        | Yes                                         |
|config - job      | 0.5        |    0.5GB    |   N/A            |  64 Bit        | Yes on fresh installs                       |
|persistence - job | 0.5        |    0.5GB    |   N/A            |  64 Bit        | Yes on fresh installs                       |
|nginx             | 1          |    1GB      |   N/A            |  64 Bit        | Yes if not ALB or Istio                     |
|config-api        | 1          |    1GB      |   N/A            |  64 Bit        | No                                          |


## Installation


### Install using Helm(production-ready)

  -  The below certificates and keys are needed to complete the installation.

    | Certificate / key                | Description                                                                             |
    |----------------------------------|-----------------------------------------------------------------------------------------|
    |OB Issuing CA                     | Used in nginx as a certificate authority                                                |
    |OB Root CA                        | Used in nginx as a certificate authority                                                |
    |OB Signing CA                     | Used in nginx as a certificate authority                                                |
    |OB AS Transport key               | Used for mTLS. This will also be added to the JVM                                       |
    |OB AS Transport crt               | Used for mTLS. This will also be added to the JVM                                       |
    |OB AS signing crt                 | Added to the JVM. Used in SSA Validation                                                | 
    |OB AS signing key                 | Added to the JVM. Used in SSA Validation                                                |
    |OB transport truststore           | Used in SSA Validation. Generated from OB Root CA nd Issuing CA                         |

  - Based on the provider/platform you're using, you can follow the [docs](../install/helm-install/README.md) to install your platform prerequistes, nginx-ingress, and the yaml changes needed in `override.yaml` based on the Gluu persistence choosed.

  - To enable mTLS in ingress-nginx, add the following to your `override.yaml`:
      ```yaml
      nginx-ingress:
        ingress:
          additionalAnnotations:
            nginx.ingress.kubernetes.io/auth-tls-verify-client: "optional"
            nginx.ingress.kubernetes.io/auth-tls-secret: "gluu/tls-ob-ca-certificates"
            nginx.ingress.kubernetes.io/auth-tls-verify-depth: "1"
            nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true"
      ```

      Adding these annotations will enable [client certificate authentication](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#client-certificate-authentication).

  - Enable `authServerProtectedToken` and `authServerProtectedRegister`:
      ```yaml
      global
        auth-server:
          ingress:
            authServerProtectedToken: true
            authServerProtectedRegister: true
      ```

  - Enable HTTPS

      During fresh installation, the config-job checks if SSL certificates and keys are mounted as files. If no mounted files are found, it attempts to download SSL certificates from the FQDN supplied. If the download is successful, an empty key file is generated. If no mounted or downloaded files are found, it generates self-signed SSL certificates, CA certificates, and keys.


      | certificates and keys of interest in https | Notes                                      |
      | ----------------------------------------  | ------------------------------------------ |
      | web_https.crt         | (nginx) web server certificate. This is commonly referred to as server.crt |
      | web_https.key         | (nginx) web server key. This is commonly referred to as server.key |
      | web_https.csr         | (nginx) web server certificate signing request. This is commonly referred to as server.csr |
      | web_https_ca.crt      | Certificate authority certificate that signed/signs the web server certificate. |
      | web_https_ca.key      | Certificate authority key that signed/signs the web server certificate.|




  -  Create a secret containing the OB CA certificates (issuing, root, and signing CAs) and the OB AS transport crt. For more information read [here](https://kubernetes.github.io/ingress-nginx/examples/auth/client-certs/).

    ```bash
    cat web_https_ca.crt issuingca.crt rootca.crt signingca.crt >> ca.crt
    kubectl create secret generic tls-ob-ca-certificates -n gluu --from-file=tls.crt=web_https.crt --from-file=tls.key=web_https.key --from-file=ca.crt=ca.crt
    ```

    If you have an existing helm deployment, those secrets can be retrieved and then create using the following commands:

    ```bash
    kubectl get secret cn -n gluu --template={{.data.ssl_ca_cert}} | base64 -d > ca.crt
    kubectl get secret cn -n gluu --template={{.data.ssl_cert}} | base64 -d > server.crt
    kubectl get secret cn -n gluu --template={{.data.ssl_key}} | base64 -d > server.key

    kubectl create secret generic ca-secret -n gluu --from-file=tls.crt=server.crt --from-file=tls.key=server.key --from-file=ca.crt=ca.crt
    ```

1.  Inject OBIE signed certs, keys and uri: 

    1.  When using OBIE signed certificates and keys, there are  many objects that can be injected. The certificate signing pem file i.e `obsigning.pem`, the signing key i.e `obsigning-oajsdij8927123.key`, the certificate transport pem file i.e `obtransport.pem`, the transport key i.e `obtransport-sdfe4234234.key`, the transport truststore p12 i.e `ob-transport-truststore.p12`, and the jwks uri `https://mykeystore.openbanking.wow/xxxxx/xxxxx.jwks`.

    1.  base64 encrypt all `.pem` and `.key` files.

        ```bash
        cat obsigning.pem | base64 | tr -d '\n' > obsigningbase64.pem
        cat obsigning-oajsdij8927123.key | base64 | tr -d '\n' > obsigningbase64.key
        cat obtransport.pem | base64 | tr -d '\n' > obtransportbase64.pem
        cat obtransport-sdfe4234234.key | base64 | tr -d '\n' > obtransportbase64.key
        ```


    1.  Generate your transport truststore or convert it to `.p12` format. Please name it as `ob-transport-truststore.p12`

        ```bash
        cat obissuingca.pem obrootca.pem obsigningca.pem > transport-truststore.crt
        keytool -importcert -file transport-truststore.crt -keystore ob-transport-truststore.p12 -alias obkeystore
        ```

    1.  base64 encrypt the `ob-transport-truststore.p12`

        ```bash
        cat ob-transport-truststore.p12 | base64 | tr -d '\n' > obtransporttruststorebase64.pem
        ```


    1.  Add the kid as the alias for the JKS used for the OB AS external signing crt. This is a kid value.Used in SSA Validation, kid used while encoding a JWT sent to token URL i.e XkwIzWy44xWSlcWnMiEc8iq9s2G. This kid value should exist inside the jwks uri endpoint.

    1. Add those values to `override.yaml`:
    ```yaml
      global:
        # -- Open banking external signing jwks uri. Used in SSA Validation.
        cnObExtSigningJwksUri: "<JWKS URI>"
        # -- Open banking external signing jwks AS certificate authority string. Used in SSA Validation. This must be encoded using base64.. Used when `.global.cnObExtSigningJwksUri` is set.
        cnObExtSigningJwksCrt: <base64 string in obsigningbase64.pem>
        # -- Open banking external signing jwks AS key string. Used in SSA Validation. This must be encoded using base64. Used when `.global.cnObExtSigningJwksUri` is set.
        cnObExtSigningJwksKey: <base64 string in obsigningbase64.key>
        # -- Open banking external signing jwks AS key passphrase to unlock provided key. This must be encoded using base64. Used when `.global.cnObExtSigningJwksUri` is set.
        cnObExtSigningJwksKeyPassPhrase: <base64 string passphrase of obsigningbase64.key>
        # -- Open banking external signing AS Alias. This is a kid value. Used in SSA Validation, kid used while encoding a JWT sent to token URL i.e. XkwIzWy44xWSlcWnMiEc8iq9s2G
        cnObExtSigningAlias: <Alias of the entry inside the keystore ob-ext-signing.jks>
        # -- Open banking signing AS kid to force the AS to use a specific signing key. i.e. Wy44xWSlcWnMiEc8iq9s2G
        cnObStaticSigningKeyKid: <Alias of the entry inside the keystore ob-ext-signing.jks>
        # -- Open banking AS transport crt. Used in SSA Validation. This must be encoded using base64.
        cnObTransportCrt: <base64 string in obtransportbase64.pem>
        # -- Open banking AS transport key. Used in SSA Validation. This must be encoded using base64.
        cnObTransportKey: <base64 string in obtransportbase64.key>
        # -- Open banking AS transport key passphrase to unlock AS transport key. This must be encoded using base64.
        cnObTransportKeyPassPhrase: <base64 string passphrase in obtransportbase64.key>
        # -- Open banking transport Alias used inside the JVM.
        cnObTransportAlias: ""
        # -- Open banking AS transport truststore crt. This is normally generated from the OB issuing CA, OB Root CA and Signing CA. Used when .global.cnObExtSigningJwksUri is set. Used in SSA Validation. This must be encoded using base64.
        cnObTransportTrustStore: <base64 string in obtransporttruststorebase64.pem>
    ```   

   -  Please note that the password for the keystores created can be fetched by executing the following command:

      `kubectl get secret cn -n gluu --template={{.data.auth_openid_jks_pass}} | base64 -d`
      
      The above password is needed in custom scripts such as the `Client Registration script`

   - After finishing all the tweaks to the `override.yaml` file, run `helm install` or `helm upgrade` if `Gluu` is already installed

    ```bash
    helm repo add gluu-flex https://docs.gluu.org/charts
    helm repo update
    helm install gluu gluu-flex/gluu -n gluu -f override.yaml
    ```

### Install on microK8s(development/testing)

On your Ubuntu VM, run the following commands:

```bash
sudo su -
wget https://raw.githubusercontent.com/GluuFederation/flex/main/automation/startopenabankingdemo.sh && chmod u+x startopenabankingdemo.sh && ./startopenabankingdemo.sh
```

Running this script will install the Gluu Open Banking Platform with mTLS enabled along with the mysql backend as a persistence.

After running the script, you can go ahead and [test the setup](#testing-the-setup).

## Testing the setup

After successful installation, you can access and test the Gluu Open Banking Platform using either [curl](https://docs.gluu.org/head/openbanking/curl/) or [Jans-CLI](https://docs.gluu.org/head/openbanking/jans-cli/).


## Changing the  signing key kid for the AS dynamically


1.  Get a client id and its associated password. We will use the jans-config-api client id and secret

    ```bash
    TESTCLIENT=$(kubectl get cm cn -n gluu --template={{.data.jca_client_id}})
    TESTCLIENTSECRET=$(kubectl get secret cn -n gluu --template={{.data.jca_client_pw}} | base64 -d)
    ```

1.  Get a token. To pass mTLS, we will use client.crt and client.key:

    ```bash
    curl -k -u $TESTCLIENT:$TESTCLIENTSECRET https://<FQDN>/jans-auth/restv1/token -d "grant_type=client_credentials&scope=https://jans.io/oauth/jans-auth-server/config/properties.write" --cert client.crt --key client.key
    ```

1.  Add the entry `staticKid` to force the AS to use a specific signing key. Please modify `XhCYDfFM7UFXHfykNaLk1aLCnZM` to the kid to be used:          

    ```bash
    curl -k -X PATCH "https://<FQDN>/jans-config-api/api/v1/jans-auth-server/config" -H  "accept: application/json" -H  "Content-Type: application/json-patch+json" -H "Authorization:Bearer 170e8412-1d55-4b19-ssss-8fcdeaafb954" -d "[{\"op\":\"add\",\"path\":\"/staticKid\",\"value\":\"XhCYDfFM7UFXHfykNaLk1aLCnZM\"}]"
    ```

1.  Perform a rolling restart for the auth-server and config-api deployments.

    ```bash
    kubectl rollout restart deployment <gluu-release-name>-auth-server -n gluu
    kubectl rollout restart deployment <gluu-release-name>-config-api -n gluu
    ```


## Adding custom scopes upon installation

1. Download the original scopes file

	```
	wget https://raw.githubusercontent.com/JanssenProject/docker-jans-persistence-loader/master/templates/scopes.ob.ldif
    ```

1. Add to the file the custom scopes desired.

1. Create a configmap with the scopes file

	```
	kubectl create cm custom-scopes -n gluu --from-file=scopes.ob.ldif
	```

1. Mount the configmap in your override.yaml under `persistence.volumes` and `persistence.volumeMounts`

	```yaml
	persistence:
		volumes:
			- name: custom-scopes
				configMap:
					name: custom-scopes
		volumeMounts:
			- name: custom-scopes
				mountPath: "/app/templates/scopes.ob.ldif"
				subPath: scopes.ob.ldif
	```


1. Run helm install or helm upgrade if Gluu has already been installed.
