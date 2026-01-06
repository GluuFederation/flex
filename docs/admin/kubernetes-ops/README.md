---
tags:
  - administration
  - kubernetes
  - operations
---

# Operation Guide

This Operation guide helps you learn about the common operations for Gluu Flex on Kubernetes.


!!! Note
    Since Flex = Janssen + Admin-UI. The Kubernetes Operations in Gluu Flex are identitical to [Janssen](https://docs.jans.io/head/admin/kubernetes-ops/). You will mostly only need to change the helm chart reference from `janssen/janssen` to `gluu-flex/gluu`, along with the helm release name and namespace.
    Here's an example how would the [upgrade](upgrade.md) of Flex looks like.

## Common Operations

- [Upgrade](upgrade.md)
- [Admin-UI Private](admin-ui-private.md)
- [Scaling](https://docs.jans.io/head/janssen-server/kubernetes-ops/scaling/)
- [Backup and Restore](https://docs.jans.io/head/janssen-server/kubernetes-ops/backup-restore/)  
- [Certificate Management](https://docs.jans.io/head/janssen-server/kubernetes-ops/cert-management/)  
- [Customization](https://docs.jans.io/head/janssen-server/kubernetes-ops/customization/)  
- [Start Order](https://docs.jans.io/head/janssen-server/kubernetes-ops/start-order/)  
- [Logs](https://docs.jans.io/head/janssen-server/kubernetes-ops/logs/)
- [External Secrets and Configmaps](https://docs.jans.io/head/janssen-server/kubernetes-ops/external-secrets-configmaps/)
- [Health Check](https://docs.jans.io/head/janssen-server/kubernetes-ops/health-check/)
- [TUI K8s](https://docs.jans.io/head/janssen-server/kubernetes-ops/tui-k8s/)
- [Custom Attributes](https://docs.jans.io/head/janssen-server/kubernetes-ops/custom-attributes/)
- [Jans SAML/Keycloak](https://docs.jans.io/head/janssen-server/kubernetes-ops/jans-saml/)
- [Memory Dump](https://docs.jans.io/head/janssen-server/kubernetes-ops/memory-dump/)
