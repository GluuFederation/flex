---
tags:
  - administration
  - kubernetes
  - operations
  - helm
  - backup
  - restore
---

This guide shows how to back up a Gluu Flex Helm deployment and restore it, into the same cluster or a new one. Take a backup before every [upgrade](./upgrade.md). It uses only `kubectl`, `helm`, `curl` and the database's own tools.

We recommend a backup **once daily**, and always before an upgrade or any change to the values file.

## What to back up

Flex keeps its state in four places. A restore needs all four.

| What | Where it lives | Contains |
| --- | --- | --- |
| Configuration and secrets | ConfigMap `cn` and Secret `cn` | Server configuration, client credentials, keystore passwords and other secrets that the database contents depend on |
| Data | The database (MySQL or PostgreSQL) | Users, clients, scopes, Admin UI roles and settings, custom scripts, deployed Agama projects |
| Helm values | Your `override.yaml` and the chart version | How the release was installed |
| Customizations and other objects your values point to | ConfigMaps, Secrets or volumes named in `volumes` and `volumeMounts` of your values, and any Secret or ConfigMap that you created yourself and that the values name (for example `global.cnConfiguratorCustomSchema.secretName`) | For example custom login pages, CSS, logos and fonts, or a custom configuration schema |

!!! Note
    The ConfigMap, the Secret and the database are a set. Restore them together from the same backup. A database restored with a `cn` Secret from a different installation cannot be used.

## Manual Backup

Set these once and reuse them in the commands below. The values shown are examples: replace them with your namespace, Helm release name, database pod name, the database name and user that Flex uses (`configmap.cnSqlDbName` and `configmap.cnSqlDbUser` in your values) and your Flex host name.

```bash
export NS=gluu
export RELEASE=flex
export DB_POD=postgresql-0
export DB_NAME=gluu
export DB_USER=gluu
export FQDN=flex.example.com
```

1.  Configmap backup:

    ```bash
    kubectl get configmap cn -n $NS -o yaml > configmap-backup.yaml
    ```

2.  Secret backup:

    ```bash
    kubectl get secret cn -n $NS -o yaml > secret-backup.yaml
    ```

3.  Get the user-supplied values:

    Save the `override.yaml` that was used to install Flex with helm.

    If the file was lost, you can obtain the values with:

    ```bash
    helm get values $RELEASE -n $NS -o yaml > override.yaml
    ```

4.  Keep note of the installed chart version:

    ```bash
    helm list -n $NS
    ```

    Record only the chart version from the `CHART` column, not the chart name. For example, if the value is `gluu-replace-flex-version`, record `replace-flex-version`. You need this value for `--version` when you restore.

5.  Back up the customizations that your values mount from the cluster.

    List the ConfigMaps, Secrets and volumes that your values refer to:

    ```bash
    helm get values $RELEASE -n $NS -o yaml | grep -B1 -A3 -E "configMap|secret|Secret|persistentVolumeClaim"
    ```

    Save every ConfigMap and Secret that you created yourself and that your values name: the ones under `volumes`, and any other object the values point to, for example the Secret in `global.cnConfiguratorCustomSchema.secretName`. If such an object is missing after a restore, the Flex pods stay in `ContainerCreating`. Set `CUSTOM` to the name of the object (repeat for each one):

    ```bash
    export CUSTOM=my-login-pages
    kubectl get configmap $CUSTOM -n $NS -o yaml > custom-configmap-$CUSTOM.yaml
    kubectl get secret $CUSTOM -n $NS -o yaml > custom-secret-$CUSTOM.yaml
    ```

    Skip the command for an object type that does not exist.

    If your customizations live on a PersistentVolumeClaim instead, back it up with your storage's snapshot feature. Also keep the source files of anything you deployed to Flex, for example the `.gama` archive of a customized Agama project.

6.  Back up the database.

    **PostgreSQL in the cluster**

    ```bash
    kubectl exec $DB_POD -n $NS -- pg_dump -U postgres -Fc $DB_NAME > gluu-db-backup.dump
    ```

    **MySQL in the cluster**

    ```bash
    kubectl exec $DB_POD -n $NS -- sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump --single-transaction --routines -u root "$1"' sh $DB_NAME > gluu-db-backup.sql
    ```

    The password is read inside the pod, so it does not appear in your shell history or in the process list. The commands read the variable `MYSQL_ROOT_PASSWORD`, but the name depends on your MySQL image. List the variable names (not their values) with the command below, and if your image uses a different name, replace `MYSQL_ROOT_PASSWORD` with it in the backup and restore commands:

    ```bash
    kubectl exec $DB_POD -n $NS -- env | cut -d= -f1 | grep -i mysql
    ```

    **External database**

    Use the backup tool of your database or cloud provider (a managed snapshot, `pg_dump`, `mysqldump`). The database name and user are in `configmap.cnSqlDbName` and `configmap.cnSqlDbUser` of your values.

    `pg_dump` and `mysqldump --single-transaction` give a consistent copy while Flex is running. For an exact copy in a maintenance window, scale the Flex deployments down first with `kubectl scale deployment <name> -n $NS --replicas=0`, take the dump, then scale back up.

7.  Check the backups and store them away from the cluster.

    ```bash
    ls -lh *.yaml *.dump *.sql 2>/dev/null
    ```

    Check the database backup for your database type.

    **PostgreSQL**

    ```bash
    pg_restore -l gluu-db-backup.dump | head
    ```

    **MySQL**

    ```bash
    grep -c "CREATE TABLE" gluu-db-backup.sql
    ```

    **External database**

    Confirm in your provider's console or tool that the snapshot or dump completed.

    The Secret backup contains credentials. Keep it encrypted, and never put it in a ticket or a repository.

## Manual Restore

Use these steps to restore into a new cluster, or into the same cluster after the namespace was removed. Restore the **same chart version** that the backup was taken from. To move to a newer version, restore first, then follow the [upgrade guide](./upgrade.md).

1.  Create the namespace:

    ```bash
    kubectl create namespace $NS
    ```

2.  Restore the ConfigMap and Secret:

    Before you apply **any** saved YAML file (these two and the customization files in the next step), remove the lines `resourceVersion`, `uid`, `creationTimestamp`, `namespace` and the `managedFields` block from `metadata`. They identify the old objects and the old namespace, and the cluster rejects them on creation (the `-n $NS` option sets the namespace).

    ```bash
    kubectl create -f configmap-backup.yaml -n $NS
    kubectl create -f secret-backup.yaml -n $NS
    ```

3.  Restore your customizations (backup step 5). They must exist **before** Flex is installed, because the pods mount them at start.

    ConfigMaps and Secrets, including any object your values name such as the one in `global.cnConfiguratorCustomSchema.secretName`. First clean each saved file as described in step 2, then create only the objects that you saved in the backup, since a customization may have only a ConfigMap or only a Secret (set `CUSTOM` to each object's name, as in the backup):

    ```bash
    kubectl create -f custom-configmap-$CUSTOM.yaml -n $NS
    kubectl create -f custom-secret-$CUSTOM.yaml -n $NS
    ```

    PersistentVolumeClaims: if your customizations live on a volume, restore the volume from your storage snapshot, using the same claim name that `override.yaml` refers to. The exact steps depend on your storage provider. With a CSI driver that supports snapshots, create the claim from the snapshot:

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: custom-files
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
      dataSource:
        apiGroup: snapshot.storage.k8s.io
        kind: VolumeSnapshot
        name: custom-files-backup
    ```

    Save it as `pvc-restore.yaml`, create it, then wait until the claim is bound:

    ```bash
    kubectl create -f pvc-restore.yaml -n $NS
    kubectl get pvc -n $NS
    ```

4.  Restore the database.

    Create an empty database with the same name, user and password as before (for a database inside the cluster, install or start the database first), then load the backup:

    **PostgreSQL**

    ```bash
    kubectl exec -i $DB_POD -n $NS -- pg_restore -U postgres -d $DB_NAME --no-owner --role=$DB_USER < gluu-db-backup.dump
    ```

    `--role` makes the restored tables belong to the database user that Flex connects as (`configmap.cnSqlDbUser`). Without it they belong to `postgres`, and Flex cannot read them if its user is a different one (the chart default is `gluu`). The user must exist before you restore.

    **MySQL**

    ```bash
    kubectl exec -i $DB_POD -n $NS -- sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -u root "$1"' sh $DB_NAME < gluu-db-backup.sql
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
    curl -k --fail https://$FQDN/.well-known/openid-configuration
    ```

    Sign in to the Admin UI at `https://$FQDN/admin` (your Flex host name) as a user with an Admin UI role, and confirm that your users, clients and scopes are present and that your customized login pages appear.

## Customizations after a restore or an upgrade

| Customization | Stored in | After a restore | After an upgrade |
| --- | --- | --- | --- |
| Login page templates, CSS, logos, fonts mounted from a ConfigMap | ConfigMap named in your values | Restore the ConfigMap, keep the mounts in `override.yaml` | Still mounted. A mounted file hides the new image's version of that file, so compare it with the new image |
| Custom scripts | Database | Restored with the database | Kept. Review them against the new version, they are not updated |
| Agama projects (flows and their pages) | Database | Restored with the database | The upgrade can redeploy the stock `agama-pw` and Casa projects and overwrite your changes. Deploy your archive again |
| Admin UI roles and settings | Database | Restored with the database | Kept |

## Automatic Backup and Restore

There are tools that automate backup and restore of a whole namespace, such as [Kasten K10](https://www.kasten.io/kubernetes/use-cases/backup-restore). Follow the tool's guide to deploy it and schedule backups. Keep a separate database dump, because a volume snapshot of a running database may not be consistent.
