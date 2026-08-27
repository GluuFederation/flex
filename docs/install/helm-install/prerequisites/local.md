---
tags:
  - administration
  - installation
  - helm
  - local
  - minikube
  - microk8s
---

# Local Kubernetes Setup (Minikube/MicroK8s)

This guide covers setting up Flex on a local Kubernetes cluster for development and testing.

## System Requirements

For local deployments, minimum resources are:

- 8 GB RAM
- 4 CPU cores
- 50 GB hard-disk

!!! Tip
    For a one-liner demo deployment, use the [Local Kubernetes Quick Start](../../quick-start/local-k8s.md). The steps below cover manual setup.

## Manual Setup

If you prefer manual setup:

1. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/) or [MicroK8s](https://github.com/canonical/microk8s/tree/master#quickstart)
2. Install [Helm](https://helm.sh/docs/intro/install/)
3. Create the namespace:
   ```bash
   kubectl create namespace gluu
   ```

## Next Steps

Proceed to [Ingress Setup](../ingress-setup.md) to configure traffic routing.
