---
tags:
  - administration
  - installation
  - helm
  - EKS
  - Amazon Web Services
  - AWS
---

# Install Gluu Flex on EKS

## System Requirements

{% include "includes/cn-system-requirements.md" %}

## Initial Setup

1. Before initiating the setup please obtain an [SSA](../../install/software-statements/ssa.md) to trial Flex, after which you are issued a JWT. You need to convert it into base64 format that you can use to install, specified by the `.global.licenseSsa` key in the `values.yaml` of Gluu's Chart.

2. Install [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

3. Configure your AWS user account using [aws configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) command. This makes you able to authenticate before creating the cluster.
    Note that this user account must have permissions to work with Amazon EKS IAM roles and service linked roles, AWS CloudFormation, and a VPC and related resources
    
4. Install [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)

5. Install [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) 

6. Create cluster using eksctl such as the following example:

    ```  
    eksctl create cluster --name gluu-cluster --nodegroup-name gluu-nodes --node-type NODE_TYPE --nodes 2  --managed --region REGION_CODE
    ```
    You can adjust `node-type` and `nodes` number as per your desired cluster size

7. To be able to attach volumes to your pod, you need to install the Amazon [EBS CSI driver](https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html)

8. Install [Helm3](https://helm.sh/docs/intro/install/)

9. Create `gluu` namespace where our resources will reside
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
    
        
        Get the Loadbalancer address: 
        ```
        kubectl get svc nginx-ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
        ```

      
        
        Add the following yaml snippet to your `override.yaml` file:

        ```yaml
        global:
            isFqdnRegistered: false
        config:
            configmap:
                lbAddr: http:// #Add LB address from previous command
        ```

    - FQDN/domain is registered:

        Add the following yaml snippet to your `override.yaml` file`:

        ```yaml
        global:
            isFqdnRegistered: true
            fqdn: demoexample.gluu.org #CHANGE-THIS to the FQDN used for Gluu
        config:
            configmap:
                lbAddr: http:// #Add LB address from previous command
        nginx:
          ingress:
              enabled: true
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
              provisioner: kubernetes.io/aws-ebs
            opendj:
              enabled: true
          ```

          So if your desired configuration has no-FQDN and LDAP, the final `override.yaml` file will look something like that:

          ```yaml
           global:
             cnPersistenceType: ldap
             isFqdnRegistered: false
             storageClass:
               provisioner: kubernetes.io/aws-ebs
             opendj:
               enabled: true
           config:
            configmap:
                lbAddr: http:// #Add LB address from previous command
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



    - PostgreSQL for persistence storage

        In a production environment, a production grade PostgreSQL server should be used such as `Amazon RDS`

        For testing purposes, you can deploy it on the EKS cluster using the following command:

        ```
        helm install my-release --set auth.postgresPassword=Test1234#,auth.database=gluu -n gluu oci://registry-1.docker.io/bitnamicharts/postgresql
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

        In a production environment, a production grade MySQL server should be used such as `Amazon RDS`

        For testing purposes, you can deploy it on the EKS cluster using the following command:

        ```
        helm install my-release --set auth.rootPassword=Test1234#,auth.database=gluu -n gluu oci://registry-1.docker.io/bitnamicharts/mysql
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
            lbAddr: http:// #Add LB address from previous command
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