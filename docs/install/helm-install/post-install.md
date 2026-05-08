---
tags:
  - administration
  - installation
  - helm
  - configuration
---

# Post-Installation

After installing Flex, use this guide to configure and verify your deployment.

## Verify Pod Status

Ensure all pods are running:

```bash
kubectl get pods -n gluu
```

Expected output shows pods in `Running` or `Completed` state.

## Configure Flex with TUI

The Terminal User Interface (TUI) provides an interactive way to configure Flex components. The TUI calls the Config API to perform configuration.

See the [TUI for Kubernetes](https://docs.jans.io/head/janssen-server/kubernetes-ops/tui-k8s/) guide for detailed instructions.

## Verify Endpoints

Test that your Flex endpoints are accessible:

| Service     | Endpoint                                        |
|-------------|-------------------------------------------------|
| Auth Server | `https://<FQDN>/.well-known/openid-configuration` |
| FIDO2       | `https://<FQDN>/.well-known/fido2-configuration`  |
| SCIM        | `https://<FQDN>/.well-known/scim-configuration`   |

## View Logs

Check logs for troubleshooting:

```bash
kubectl logs -n gluu -l app=auth-server
kubectl logs -n gluu -l app=config-api
```

## Common Issues

### Pods not starting

Check events for the namespace:
```bash
kubectl get events -n gluu --sort-by='.lastTimestamp'
```

### Database connection errors

Verify database connectivity:
```bash
kubectl exec -it -n gluu <config-pod> -- nc -zv <db-host> <db-port>
```

### Certificate issues

Ensure TLS certificates are properly configured:
```bash
kubectl get secrets -n gluu | grep tls
```

## Next Steps

- [Kubernetes Operations](../../admin/kubernetes-ops/README.md) - Day-2 operations
- [Config API](https://docs.jans.io/stable/janssen-server/config-guide/config-tools/config-api/) - REST API configuration
- [Monitoring](https://docs.jans.io/stable/janssen-server/config-guide/config-tools/config-api/monitoring/) - Set up monitoring
