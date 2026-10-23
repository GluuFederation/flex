---
tags:
  - administration
  - kubernetes
  - operations
  - helm
  - backup
  - restore
---

This guide shows how to back up a Gluu Flex Helm deployment and restore it, into the same cluster or a new one. Take a backup before every [upgrade](./upgrade.md). It uses only `kubectl`, `helm` and the database's own tools.

We recommend a backup **once daily**, and always before an upgrade or any change to the values file.

## What to back up

Flex keeps its state in four places. A restore needs all four.

| What | Where it lives | Contains |
| --- | --- | --- |
| Configuration and secrets | ConfigMap `cn` and Secret `cn` | Server configuration, client credentials, keystore passwords and other secrets that the database contents depend on |
| Data | The database (MySQL or PostgreSQL) | Users, clients, scopes, Admin UI roles and settings, custom scripts, deployed Agama projects |
| Helm values | Your `override.yaml` and the chart version | How the release was installed |
| Customizations mounted from the cluster | ConfigMaps, Secrets or volumes named in `volumes` and `volumeMounts` of your values | For example custom login pages, CSS, logos and fonts |

!!! Note
    The ConfigMap, the Secret and the database are a set. Restore them together from the same backup. A database restored with a `cn` Secret from a different installation cannot be used.

## Manual Backup

Set these once and reuse them in the commands below:

```bash
export NS=<namespace>
export RELEASE=<release-name>
```

1.  Configmap backup:

    ```bash
    kubectl get configmap cn -n $NS -o yaml > configmap-backup.yaml
    ```

2.  Secret backup:

    ```bash
    kubectl get secret cn -n $NS -o yaml > secret-backup.yaml
    ```

3.  Get the user supplied values:

    Save the `override.yaml` that was used to install Flex with helm.

    If the file was lost, you can obtain the values with:

    ```bash
    helm get values $RELEASE -n $NS > override.yaml
    ```

4.  Keep note of the installed chart version:

    ```bash
    helm list -n $NS
    ```

    Keep note of the chart version. For example: `replace-flex-version`

5.  Back up the customizations that your values mount from the cluster.

    List the ConfigMaps and Secrets that your values use under `volumes`:

    ```bash
    helm get values $RELEASE -n $NS | grep -B1 -A3 -E "configMap|secret|persistentVolumeClaim"
    ```

    Save each ConfigMap and Secret that you created for customizations (replace `<name>`):

    ```bash
    kubectl get configmap <name> -n $NS -o yaml > custom-configmap-<name>.yaml
    kubectl get secret <name> -n $NS -o yaml > custom-secret-<name>.yaml
    ```

    If your customizations live on a PersistentVolumeClaim instead, back it up with your storage's snapshot feature. Also keep the source files of anything you deployed to Flex, for example the `.gama` archive of a customized Agama project.

6.  Back up the database.

    **PostgreSQL in the cluster**

    ```bash
    kubectl exec <postgresql-pod> -n $NS -- pg_dump -U postgres -Fc gluu > gluu-db-backup.dump
    ```

    **MySQL in the cluster**

    ```bash
    kubectl exec <mysql-pod> -n $NS -- mysqldump --single-transaction --routines -u root -p<password> gluu > gluu-db-backup.sql
    ```

    **External database**

    Use the backup tool of your database or cloud provider (a managed snapshot, `pg_dump`, `mysqldump`). The database name and user are in `configmap.cnSqlDbName` and `configmap.cnSqlDbUser` of your values.

    `pg_dump` and `mysqldump --single-transaction` give a consistent copy while Flex is running. For an exact copy in a maintenance window, scale the Flex deployments down first with `kubectl scale deployment <name> -n $NS --replicas=0`, take the dump, then scale back up.

7.  Check the backups and store them away from the cluster.

    ```bash
    ls -lh *.yaml *.dump *.sql 2>/dev/null
    pg_restore -l gluu-db-backup.dump | head
    ```

    The Secret backup contains credentials. Keep it encrypted, and never put it in a ticket or a repository.

## Manual Restore

Use these steps to restore into a new cluster, or into the same cluster after the namespace was removed. Restore the **same chart version** that the backup was taken from. To move to a newer version, restore first, then follow the [upgrade guide](./upgrade.md).

1.  Create the namespace:

    ```bash
    kubectl create namespace $NS
    ```

2.  Restore the ConfigMap and Secret:

    Before you apply the backups, remove the lines `resourceVersion`, `uid`, `creationTimestamp` and the `managedFields` block from `metadata`. They identify the old objects and the cluster rejects them on creation.

    ```bash
    kubectl create -f configmap-backup.yaml -n $NS
    kubectl create -f secret-backup.yaml -n $NS
    ```

3.  Restore your customizations (the ConfigMaps and Secrets from backup step 5). They must exist **before** Flex is installed, because the pods mount them at start:

    ```bash
    kubectl create -f custom-configmap-<name>.yaml -n $NS
    kubectl create -f custom-secret-<name>.yaml -n $NS
    ```

4.  Restore the database.

    Create an empty database with the same name, user and password as before (for a database inside the cluster, install or start the database first), then load the backup:

    **PostgreSQL**

    ```bash
    kubectl exec -i <postgresql-pod> -n $NS -- pg_restore -U postgres -d gluu --no-owner < gluu-db-backup.dump
    ```

    **MySQL**

    ```bash
    kubectl exec -i <mysql-pod> -n $NS -- mysql -u root -p<password> gluu < gluu-db-backup.sql
    ```

    **External database**

    Restore from your provider's snapshot, or load the dump with `pg_restore` or `mysql`.

5.  Install Flex with your saved values and the same chart version:

    ```bash
    helm repo add gluu-flex https://docs.gluu.org/charts
    helm repo update
    helm install $RELEASE gluu-flex/gluu -n $NS -f override.yaml --version=replace-flex-version
    ```

6.  Check the result:

    ```bash
    kubectl get pods -n $NS
    curl -k https://<fqdn>/.well-known/openid-configuration
    ```

    Sign in to the Admin UI at `https://<fqdn>/admin` as a user with an Admin UI role, and confirm that your users, clients and scopes are present and that your customized login pages appear.

## Customizations after a restore or an upgrade

| Customization | Stored in | After a restore | After an upgrade |
| --- | --- | --- | --- |
| Login page templates, CSS, logos, fonts mounted from a ConfigMap | ConfigMap named in your values | Restore the ConfigMap, keep the mounts in `override.yaml` | Still mounted. A mounted file hides the new image's version of that file, so compare it with the new image |
| Custom scripts | Database | Restored with the database | Kept. Review them against the new version, they are not updated |
| Agama projects (flows and their pages) | Database | Restored with the database | The upgrade can redeploy the stock `agama-pw` and Casa projects and overwrite your changes. Deploy your archive again |
| Admin UI roles and settings | Database | Restored with the database | Kept |

## Automatic Backup and Restore

There are tools that automate backup and restore of a whole namespace, such as [Kasten K10](https://www.kasten.io/kubernetes/use-cases/backup-restore). Follow the tool's guide to deploy it and schedule backups. Keep a separate database dump, because a volume snapshot of a running database may not be consistent.
