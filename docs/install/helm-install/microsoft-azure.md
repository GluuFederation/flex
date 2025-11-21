---
tags:
  - administration
  - installation
  - helm
  - AKS
  - Microsoft
  - Azure
---

# Install Gluu Flex on AKS

## System Requirements

{% include "includes/cn-system-requirements.md" %}

## Initial Setup

1. Before initiating the setup, please obtain an [SSA](https://docs.gluu.org/vreplace-flex-version/install/agama/prerequisites/#obtaining-an-ssa) for Flex trial, after which you will issued a JWT.

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

## Gluu Flex Installation using Helm
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

        Add the following yaml snippet to your `override.yaml` file:

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

    - PostgreSQL for persistence storage

        In a production environment, a production grade PostgreSQL server should be used such as `Azure Database for PostgreSQL`

        For testing purposes, you can deploy it on the AKS cluster using the following command:

        ```
        helm install my-release --set auth.postgresPassword=Test1234#,auth.database=gluu,image.repository=bitnamilegacy/postgresql,image.tag=16.4.0-debian-12-r0 -n gluu oci://registry-1.docker.io/bitnamicharts/postgresql
        ```

        Add the following yaml snippet to your `override.yaml` file:
        
        ```yaml
        
        global:
          cnPersistenceType: sql
        config:
          configmap:
            cnSqlDbName: gluu
            cnSqlDbPort: 5432
            cnSqlDbDialect: pgsql
            cnSqlDbHost: my-release-postgresql.gluu.svc
            cnSqlDbUser: postgres
            cnSqlDbTimezone: UTC
            cnSqldbUserPassword: Test1234#
        ```


    - MySQL for persistence storage

        In a production environment, a production grade MySQL server should be used such as `Azure Database for MySQL`

        For testing purposes, you can deploy it on the AKS cluster using the following command:

        ```
        helm install my-release --set auth.rootPassword=Test1234#,auth.database=gluu,image.repository=bitnamilegacy/mysql,image.tag=9.4.0-debian-12-r1 -n gluu oci://registry-1.docker.io/bitnamicharts/mysql
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

3.  Install Gluu Flex



      After finishing all the tweaks to the `override.yaml` file, we can use it to install gluu flex.

      ```
      helm repo add gluu-flex https://docs.gluu.org/charts
      helm repo update
      helm install gluu gluu-flex/gluu -n gluu -f override.yaml
      ```

## Configure Gluu Flex
  You can use the Janssen [TUI](https://docs.jans.io/head/admin/kubernetes-ops/tui-k8s/) to configure Flex components. The TUI calls the Config API to perform ad hoc configuration.
