---
tags:
  - administration
  - installation
  - helm
---

# Install Flex with Helm

After configuring your cluster, ingress, and database, you're ready to install Flex.

## Complete override.yaml Example

Here's a complete `override.yaml` combining Gateway API and MySQL:

```yaml
global:
  lbIp: ""  # Add your LoadBalancer IP
  fqdn: demoexample.gluu.org  # Your domain
  isFqdnRegistered: true
  gateway-api:
    enabled: true
  nginx-ingress:
    enabled: false
gateway-api:
  gateway:
    className: nginx # Match your controller (nginx, istio, etc.)
    name: gluu-gateway
    httpPort: 80
    httpsPort: 443
    attachLbIp: false # Set the value to true if loadbalancer didn't assign IP address to the gateway automatically
config:
  configmap:
    cnSqlDbName: gluu
    cnSqlDbPort: 3306
    cnSqlDbDialect: mysql
    cnSqlDbHost: mysql.gluu.svc
    cnSqlDbUser: root # Use a dedicated user in production
    cnSqlDbTimezone: UTC
    cnSqldbUserPassword: Test1234# # Change for production!
```

!!! warning "Security"
    Replace example credentials with secure values for production deployments.

Adjust values based on your choices from the previous steps.

## Install Flex

Charts are published to an OCI registry, so no repository has to be added first.

```bash
helm install gluu oci://ghcr.io/gluufederation/charts/gluu \
  --version replace-flex-version -n gluu --create-namespace -f override.yaml
```

!!! Note
    The classic repository at `https://docs.gluu.org/charts` still resolves, and every version it
    has served remains available, so an existing `helm repo add gluu-flex` keeps working. New
    charts are published to the registry above.

    ```bash
    helm repo add gluu-flex https://docs.gluu.org/charts
    helm repo update
    helm install gluu gluu-flex/gluu -n gluu --create-namespace -f override.yaml
    ```

## Verify Installation

Check pod status:

```bash
kubectl get pods -n gluu
```

Wait for all pods to reach `Running` or `Completed` status.

## Upgrade an Existing Installation

To apply configuration changes:

```bash
helm upgrade gluu gluu-flex/gluu -n gluu --create-namespace -f override.yaml
```

## Uninstall

To remove Flex:

```bash
helm uninstall gluu -n gluu
```

## Chart Reference

For all available Helm values, see the [Helm values reference](../../reference/helm-values.md), or browse them on [Artifact Hub](https://artifacthub.io/packages/helm/gluu/gluu).

## Next Steps

Proceed to [Post-Installation](post-install.md) to configure and verify your deployment.
