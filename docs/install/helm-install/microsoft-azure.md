---
tags:
  - administration
  - installation
  - helm
  - AKS
  - Microsoft
  - Azure
---

# Install Gluu on AKS

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

1. Before initiating the setup please obtain an [SSA](../../install/software-statements/ssa.md) to trial Flex, after which you are issued a JWT. You need to convert it into base64 format that you can use to install, specified by the `.global.licenseSsa` key in the `values.yaml` of Gluus Chart.

2. Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

3. Create a [Resource Group](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli#create-a-resource-group)
    ```
    az group create --name gluu-resource-group --location eastus
    ```
  
4. Create an [AKS cluster](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli#create-aks-cluster) such as the following example:
    ```
    az aks create -g gluu-resource-group -n gluu-cluster --enable-managed-identity --node-vm-size NODE_TYPE --node-count 2 --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys 
    ``` 
    You can adjust `node-count` and `node-vm-size` as per your desired cluster size


4.  Connect to the [cluster](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli#connect-to-the-cluster) 
    ```
    az aks install-cli
    az aks get-credentials --resource-group gluu-resource-group --name gluu-cluster
    ```

5.  Install [Helm3](https://helm.sh/docs/intro/install/)

6.  Create `gluu` namespace where our resources will reside
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
              provisioner: disk.csi.azure.com
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
               provisioner: disk.csi.azure.com
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


    - Couchbase for pesistence storage
      
        Add the following yaml snippet to your `override.yaml` file:

        ```yaml
        global:
          cnPersistenceType: couchbase

        config:
          configmap:
            # The prefix of couchbase buckets. This helps with separation in between different environments and allows for the same couchbase cluster to be used by different setups of Janssen.
            cnCouchbaseBucketPrefix: jans
            # -- Couchbase certificate authority string. This must be encoded using base64. This can also be found in your couchbase UI Security > Root Certificate. In mTLS setups this is not required.
            cnCouchbaseCrt: SWFtTm90YVNlcnZpY2VBY2NvdW50Q2hhbmdlTWV0b09uZQo=
            # -- The number of replicas per index created. Please note that the number of index nodes must be one greater than the number of index replicas. That means if your couchbase cluster only has 2 index nodes you cannot place the number of replicas to be higher than 1.
            cnCouchbaseIndexNumReplica: 0
            # -- Couchbase password for the restricted user config.configmap.cnCouchbaseUser that is often used inside the services. The password must contain one digit, one uppercase letter, one lower case letter and one symbol
            cnCouchbasePassword: P@ssw0rd
            # -- The Couchbase super user (admin) username. This user is used during initialization only.
            cnCouchbaseSuperUser: admin
            # -- Couchbase password for the superuser config.configmap.cnCouchbaseSuperUser that is used during the initialization process. The password must contain one digit, one uppercase letter, one lower case letter and one symbol
            cnCouchbaseSuperUserPassword: Test1234#
            # -- Couchbase URL. This should be in FQDN format for either remote or local Couchbase clusters. The address can be an internal address inside the kubernetes cluster
            cnCouchbaseUrl: cbjanssen.default.svc.cluster.local
            # -- Couchbase restricted user
            cnCouchbaseUser: janssen
        ```




    - MySQL for persistence storage

        In a production environment, a production grade MySQL server should be used such as `Azure Database for MySQL`

        For testing purposes, you can deploy it on the AKS cluster using the following commands:

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