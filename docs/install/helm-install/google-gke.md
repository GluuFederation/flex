---
tags:
  - administration
  - installation
  - helm
  - GKE
  - Google Cloud
  - GCP
---

# Install Gluu on GKE

## System Requirements

The resources may be set to the minimum as below:

- 8 GiB RAM
- 8 CPU cores
- 50GB hard-disk

Use the listing below for detailed estimation of minimum required resources. Table contains the default resources recommendations per service. Depending on the use of each service the resources needs may be increase or decrease.

| Service           | CPU Unit | RAM   | Disk Space | Processor Type | Required                           |
|-------------------|----------|-------|------------|----------------|------------------------------------|
| Auth server       | 2.5      | 2.5GB | N/A        | 64 Bit         | Yes                                |
| LDAP (OpenDJ)     | 1.5      | 2GB   | 10GB       | 64 Bit         | Only if couchbase is not installed |
| fido2             | 0.5      | 0.5GB | N/A        | 64 Bit         | No                                 |
| scim              | 1.0      | 1.0GB | N/A        | 64 Bit         | No                                 |
| config - job      | 0.5      | 0.5GB | N/A        | 64 Bit         | Yes on fresh installs              |
| persistence - job | 0.5      | 0.5GB | N/A        | 64 Bit         | Yes on fresh installs              |
| nginx             | 1        | 1GB   | N/A        | 64 Bit         | Yes if not ALB                     |
| auth-key-rotation | 0.3      | 0.3GB | N/A        | 64 Bit         | No [Strongly recommended]          |
| config-api        | 1        | 1GB   | N/A        | 64 Bit         | No                                 |
| casa              | 1        | 1GB   | N/A        | 64 Bit         | No                                 |
| admin-ui          | 2        | 2GB   | N/A        | 64 Bit         | No                                 |

Releases of images are in style 1.0.0-beta.0, 1.0.0-0

## Initial Setup

1. Before initiating the setup, please contact Gluu to obtain a valid license or trial license. Your organization needs to register with Gluu to trial Flex, after which you are issued a JWT in base64 format that you can use to install, specified by the `.global.licenseSsa` key in the `values.yaml` of Gluu's Chart.

2. Enable [GKE API](https://console.cloud.google.com/kubernetes) if not enabled yet.

3. If you are using `Cloud Shell`, you can skip to step 7.

3. Install [gcloud](https://cloud.google.com/sdk/docs/quickstarts).
    
4. Install `kubectl` using `gcloud components install kubectl` command.
    
5. Install [Helm3](https://helm.sh/docs/intro/install/).

6. Create cluster using a command such as the following example:

    ```  
    gcloud container clusters create gluu-cluster --num-nodes 2 --machine-type e2-highcpu-8 --zone us-west1-a
    ```
    You can adjust `num-nodes` and `machine-type` as per your desired cluster size    

7. Create `gluu` namespace where our resources will reside
    ```
    kubectl create namespace gluu
    ```

## Gluu Installation using Helm
1.  Install [Nginx-Ingress](https://github.com/kubernetes/ingress-nginx), if you are not using Istio ingress
    
      ```
      helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
      helm repo add stable https://charts.helm.sh/stable
      helm repo update
      helm install nginx ingress-nginx/ingress-nginx
      ```

2.  Create a file named `override.yaml` and add changes as per your desired configuration:

    - FQDN/domain is *not* registered:
    
        
        Get the Loadbalancer IP: 
        ```
        kubectl get svc nginx-ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
        ```

      
        
        Add the following yaml snippet to your `override.yaml` file:

        ```yaml
        global:
            lbIp: #Add the Loadbalance IP from the previous command
            isFqdnRegistered: false
        ```

    - FQDN/domain is registered:

        Add the following yaml snippet to your `override.yaml` file`:

        ```yaml
        global:
            lbIp: #Add the LoadBalancer IP from the previous command
            isFqdnRegistered: true
            fqdn: demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
        nginx-ingress:
          ingress:
              path: /
              hosts:
              - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
              tls:
              - secretName: tls-certificate
                hosts:
                - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
        ```






    -  LDAP/Opendj for persistence storage


          Add the following yaml snippet to your `override.yaml` file:
          ```yaml
          global:
            cnPersistenceType: ldap
            storageClass:
              provisioner: kubernetes.io/gce-pd
            opendj:
              enabled: true
          ```

          So if your desired configuration has no-FQDN and LDAP, the final `override.yaml` file will look something like that:

          ```yaml
           global:
             cnPersistenceType: ldap
             lbIp: #Add the Loadbalancer IP from the previous command
             isFqdnRegistered: false
             storageClass:
               provisioner: kubernetes.io/gce-pd
             opendj:
               enabled: true
           nginx-ingress:
            ingress:
                path: /
                hosts:
                - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
                tls:
                - secretName: tls-certificate
                  hosts:
                  - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu    
          ```







    - MySQL for persistence storage

      In a production environment, a production grade MySQL server should be used such as `Cloud SQL`

      For testing purposes, you can deploy it on the GKE cluster using the following commands:

      ```
      helm repo add bitnami https://charts.bitnami.com/bitnami
      helm install my-release --set auth.rootPassword=Test1234#,auth.database=gluu bitnami/mysql -n gluu
      ```

      Add the following yaml snippet to your `override.yaml` file:
      
      ```yaml        
      global:
        cnPersistenceType: sql
      config:
        configmap:
          cnSqlDbName: gluu
          cnSqlDbPort: 3306
          cnSqlDbDialect: mysql
          cnSqlDbHost: my-release-mysql.gluu.svc
          cnSqlDbUser: root
          cnSqlDbTimezone: UTC
          cnSqldbUserPassword: Test1234#
      ```

      So if your desired configuration has FQDN and MySQL, the final `override.yaml` file will look something like that:

      ```yaml
      global:
        cnPersistenceType: sql
        lbIp: "" #Add the LoadBalancer IP from previous command
        isFqdnRegistered: true
        fqdn: demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
      nginx-ingress:
        ingress:
            path: /
            hosts:
            - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
            tls:
            - secretName: tls-certificate
              hosts:
              - demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu  
      config:
        configmap:
          cnSqlDbName: gluu
          cnSqlDbPort: 3306
          cnSqlDbDialect: mysql
          cnSqlDbHost: my-release-mysql.gluu.svc
          cnSqlDbUser: root
          cnSqlDbTimezone: UTC
          cnSqldbUserPassword: Test1234#
      ```

3.  Install Gluu



      After finishing all the tweaks to the `override.yaml` file, we can use it to install gluu.

      ```
      helm repo add gluu-flex https://docs.gluu.org/charts
      helm repo update
      helm install gluu gluu-flex/gluu -n gluu -f override.yaml
      ```