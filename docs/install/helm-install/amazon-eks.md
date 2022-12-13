# Gluu Flex EKS , Amazon Secret manager and Aurora Production tutorial setup

## Cloud Native Distribution

## Getting Started with Kubernetes

## System Requirements for cloud deployments

Please calculate the minimum required resources as per services deployed. The following table contains default recommended resources to start with. Depending on the use of each service, the resources may be increased or decreased. 

| Service           | CPU Unit | RAM   | Disk Space | Processor Type | Required                           |
|-------------------|----------|-------|------------|----------------|------------------------------------|
| Auth server       | 2.5      | 2.5GB | N/A        | 64 Bit         | Yes                                |
| LDAP (OpenDJ)     | 1.5      | 2GB   | 10GB       | 64 Bit         | Only if couchbase is not installed |
| fido2             | 0.5      | 0.5GB | N/A        | 64 Bit         | No                                 |
| scim              | 1.0      | 1.0GB | N/A        | 64 Bit         | No                                 |
| config - job      | 0.5      | 0.5GB | N/A        | 64 Bit         | Yes on fresh installs              |
| persistence - job | 0.5      | 0.5GB | N/A        | 64 Bit         | Yes on fresh installs              |
| client-api        | 1        | 0.4GB | N/A        | 64 Bit         | No                                 |
| nginx             | 1        | 1GB   | N/A        | 64 Bit         | Yes if not ALB                     |
| auth-key-rotation | 0.3      | 0.3GB | N/A        | 64 Bit         | No [Strongly recommended]          |
| config-api        | 0.5      | 0.5GB | N/A        | 64 Bit         | No                                 |
| admin-ui          | 1.0      | 1.0GB | N/A        | 64 Bit         | No                                 |
| casa              | 1.0      | 1.0GB | N/A        | 64 Bit         | No                                 |


## Configure EKS with Aurora

### Amazon Web Services (AWS) - EKS
  
#### Setup Cluster

-  Follow this [guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) to install a cluster with worker nodes. This setup must use three `t2.xlarge` instances distributed in three different zones. Please make sure that you have all the `IAM` policies for the AWS user that will be creating the cluster and volumes.

#### Requirements

-   The above guide should also walk you through installing `kubectl` , `aws-iam-authenticator` and `aws cli` on the VM you will be managing your cluster and nodes from. Check to make sure.

        aws-iam-authenticator help
        aws-cli
        kubectl version
  
### Amazon Aurora

[Amazon Aurora](https://aws.amazon.com/rds/aurora/?aurora-whats-new.sort-by=item.additionalFields.postDateTime&aurora-whats-new.sort-order=desc) is a MySQL and PostgreSQL-compatible relational database built for the cloud, that combines the performance and availability of traditional enterprise databases with the simplicity and cost-effectiveness of open source databases. Gluu fully supports Amazon Aurora, and recommends it in production.

1. Copy the  below into a file named `override-values.yaml`. We will be referencing this file throughout this tutorial.

    ```yaml
    config:
      countryCode: US
      email: support@gluu.org
      orgName: Gluu
      city: Austin
      configmap:
        cnSqlDbName: gluu
        cnSqlDbPort: 3306
        cnSqlDbDialect: mysql
        cnSqlDbHost: my-release-mysql.gluu.svc
        cnSqlDbUser: root
        cnSqlDbTimezone: UTC
        cnSqldbUserPassword: Test1234#
        configAdapterName: aws
        configSecretAdapter: aws
        cnAwsAccessKeyId: ""
        cnAwsSecretAccessKey: ""
        cnAwsSecretsEndpointUrl: ""
        cnAwsSecretsNamePrefix: gluu
        cnAwsDefaultRegion: us-west-1
        cnAwsProfile: "gluu"
        cnAwsSecretsReplicaRegions: []  
        
    global:
      admin-ui:
        ingress:
          adminUiEnabled: true
      cnPersistenceType: sql
      fqdn: demoexample.gluu.org
      isFqdnRegistered: true
      scim:
        ingress:
          # -- Enable endpoint /.well-known/scim-configuration
          scimConfigEnabled: true
    nginx-ingress:
      ingress:
        path: /
        hosts:
        - demoexample.gluu.org
        tls:
        - secretName: tls-certificate
          hosts:
          - demoexample.gluu.org
    
    ```
 
2. Create an Amazon Aurora database with MySQL compatibility version >= `Aurora(8.x) 3.x` and capacity type `Serverless`. Make sure the EKS cluster can reach the database endpoint. You may choose to use the same VPC as the EKS cluster. Save the master user, master password, and initial database name for use in Gluus helm chart.

3. Inject the Aurora endpoint, master user, master password, and initial database name for use in Gluus helm chart [`override-values.yaml`](#helm-valuesyaml). 

| Helm values configuration            | Description                                                                      | default     |
|--------------------------------------|----------------------------------------------------------------------------------|-------------|
| config.configmap.cnSqlDbHost         | Aurora database endpoint i.e `gluu.cluster-xxxxxxx.eu-central.rds.amazonaws.com` | empty       |
| config.configmap.cnSqlDbPort         | Aurora database port                                                             | `3306`      |
| config.configmap.cnSqlDbName         | Aurora initial database name                                                     | `gluu`      |
| config.configmap.cnSqlDbUser         | Aurora master user                                                               | `gluu`      |
| config.configmap.cnSqldbUserPassword | Aurora master password                                                           | `Test1234#` |


## Install Gluu using Helm

1. Install [nginx-ingress](https://github.com/kubernetes/ingress-nginx) Helm [Chart](https://github.com/helm/charts/tree/master/stable/nginx-ingress).

    ```bash
    kubectl create ns <nginx-namespace>
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    # The below `set`  is needed currently as the admission webhook of nginx upon initial installation sometimes revokes the ingress definitions incorrectly.
    helm install <nginx-release-name> ingress-nginx/ingress-nginx --namespace=<nginx-namespace> --set controller.admissionWebhooks.enabled=false
    ```
    
2. Create a namespace  for gluu openbanking distribution:    
   
    ```bash
    kubectl create ns gluu
    ```
3. Modify other values in the helm chart configuration to fit your setup

    | Helm values configuration       | Description                     | default                  |
---------------------------------|---------------------------------------|--------------------------|-----------------------------|
    | config.city                     | City                           | `Austin`                 |
    | config.countryCode              | Country                        | `US`                     |
    | config.email                    | Email                          | `support@gluu.org`       |
    | config.orgName                  | Organization name              | `Gluu`                   |
    | config.state                    | State                          | `TX`                     |
    | global.fqdn                     | FQDN                           | `demoexample.gluu.org`   |
    | nginx-ingress.ingress.hosts     | A list containing the FQDN     | `[demoexample.gluu.org]` |
    | nginx-ingress.ingress.tls.hosts | A list containing the FQDN     | `[demoexample.gluu.org]` |

4. Modify the values in the helm chart to activate using `AWS Secret Manager` as the config and secret layer holder. 
    
    1. Change `global.configAdapterName` and `global.configSecretAdapter` to `aws`.
    2. Change the below values appropriately:

    | Helm values configuration       | Description                     | default                  |
---------------------------------|---------------------------------------|--------------------------|-----------------------------|
    | config.configmap.cnAwsAccessKeyId        | AWS Access key id  that belong to a user/id with SecretsManagerReadWrite policy                           | `""`                 | 
    | config.configmap.cnAwsSecretAccessKey        | AWS Secret Access key that belong to a user/id with SecretsManagerReadWrite policy                           | `""`                 | 
    | config.configmap.cnAwsSecretsEndpointUrl        | The URL of AWS secretsmanager service (if omitted, will use the one in specified region). Used only when global.configAdapterName and global.configSecretAdapter is set to aws.                           | `""`                 | 
    | config.configmap.cnAwsSecretsEndpointUrl        | The URL of AWS secretsmanager service (if omitted, will use the one in specified region). Used only when global.configAdapterName and global.configSecretAdapter is set to aws.                           | `""`                 | 
    | config.configmap.cnAwsSecretsNamePrefix        | The prefix name of the secrets. Used only when global.configAdapterName and global.configSecretAdapter is set to aws.                           | `"gluu"`                 | 
    | config.configmap.cnAwsDefaultRegion        | The default AWS Region to use, for example, `us-west-1` or `us-west-2`.                           | `us-west-1`                 | 
    | config.configmap.cnAwsProfile        | The name of the default profile to use.                           | `gluu`                 | 
    | config.configmap.cnAwsSecretsReplicaRegions        | Example replicated region [{"Region": "us-west-1"}, {"Region": "us-west-2"}]                           | `[]`                 | 
5. 
    **NOT REEQUIRED IF FQDN IS REGISTERED**: Please note that the FQDN **must** be resolvable or the `config-api` will fail to find the host. You may choose to modify the `CoreDNS` to reroute the domain internally to the nginx-ingress as following:
    
    Add rewrite rule to CoreDNS `ConfigMap`. In the following example we will be using ingress-nginx which you have installed previously. The internal address of this service will be `nginx-ingress-nginx-controller.nginx.svc.cluster.local` which is in the following format `<releasename>-ingress-nginx-controller.<namespace>.svc.cluster.local` and our example domain will be `demoexample.gluu.org`:
    
    1. Take a copy of the `ConfigMap`:
    
        ```bash
        kubectl -n kube-system get configmap coredns -o yaml > original_coredns_cm.yaml
        cp original_coredns_cm.yaml gluu_modified_coredns_cm.yaml 
        ```
    
    2. Edit the `ConfigMap` to include the rewrite using any edition:
    
        ```bash
        vi gluu_modified_coredns_cm.yaml
        ```
       
        ```yaml
           .:53 {
                    ....
                    rewrite name demoexample.gluu.org nginx-ingress-nginx-controller.nginx.svc.cluster.local
                }
        ```
    
    3. Apply the changes:
    
        ```bash
        kubectl apply -f gluu_modified_coredns_cm.yaml
        ```    
    
6. Install gluu flex, [refer here](https://artifacthub.io/packages/helm/gluu-flex/gluu)  for the latest version details:    
   
    ```bash
    helm repo add gluu https://docs.gluu.org/charts
    helm repo update
    helm install <release-name> gluu/gluu -n <namespace> -f override-values.yaml --version=5.0.10
    ```
  
7. Wait for your pods to be up and running , head to `https://<fqdn>/admin` place your license creds and login.