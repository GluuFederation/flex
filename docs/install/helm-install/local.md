---
tags:
  - administration
  - installation
  - helm
---

# Install Gluu Server Locally with minikube and MicroK8s

## System Requirements

For local deployments like `minikube` and `MicroK8s` or cloud installations in demo mode, resources may be set to the minimum as below:

- 8 GB RAM
- 4 CPU cores
- 50 GB hard-disk

Use the listing below for a detailed estimation of minimum required resources. The table contains the default resources recommendation per service. Depending on the use of each service the resources need may increase or decrease.

| Service           | CPU Unit | RAM   | Disk Space | Processor Type | Required                           |
|-------------------|----------|-------|------------|----------------|------------------------------------|
| Auth server       | 2.5      | 2.5GB | N/A        | 64 Bit         | Yes                                |
| fido2             | 0.5      | 0.5GB | N/A        | 64 Bit         | No                                 |
| scim              | 1        | 1GB   | N/A        | 64 Bit         | No                                 |
| config - job      | 0.3      | 0.3GB | N/A        | 64 Bit         | Yes on fresh installs              |
| persistence - job | 0.3      | 0.3GB | N/A        | 64 Bit         | Yes on fresh installs              |
| nginx             | 1        | 1GB   | N/A        | 64 Bit         | Yes if ALB/Istio not used          |
| auth-key-rotation | 0.3      | 0.3GB | N/A        | 64 Bit         | No [Strongly recommended]          |
| config-api        | 1        | 1GB   | N/A        | 64 Bit         | No                                 |
| casa              | 0.5      | 0.5GB | N/A        | 64 Bit         | No                                 |
| admin-ui          | 2        | 2GB   | N/A        | 64 Bit         | No                                 |
| link              | 0.5      | 1GB   | N/A        | 64 Bit         | No                                 |
| saml              | 0.5      | 1GB   | N/A        | 64 Bit         | No                                 |
| cleanup - job     | 0.3      | 0.3GB | N/A        | 64 Bit         | Yes                                |

Releases of images are in style 0.0.0-nightly or x.y-z-1

## Installation Steps

Before initiating the setup, please obtain an [SSA](https://docs.gluu.org/vreplace-flex-version/install/flex/prerequisites/#obtaining-an-ssa) for Flex trial, after which you will issued a JWT.

Start a fresh Ubuntu VM with ports `443` and `80` open. Then execute the following:

```bash
sudo su -
```
```bash
wget https://raw.githubusercontent.com/GluuFederation/flex/vreplace-flex-version/automation/startflexdemo.sh && chmod u+x startflexdemo.sh && ./startflexdemo.sh
```

This will install Docker, Microk8s, Helm and Gluu with the default settings that can be found inside [values.yaml](https://github.com/GluuFederation/flex/blob/main/charts/gluu/values.yaml).

The installer will automatically add a record to your hosts record in the VM but if you want to access the endpoints outside the VM you must map the `ip` of the instance running Ubuntu to the FQDN you provided and then access the endpoints at your browser such in the example in the table below.

| Service     | Example endpoint                                |
|-------------|-------------------------------------------------|
| Auth server | `https://FQDN/.well-known/openid-configuration` |
| fido2       | `https://FQDN/.well-known/fido2-configuration`  |
| scim        | `https://FQDN/.well-known/scim-configuration`   |
| Casa        | `https://FQDN/jans-casa`                        |
| Admin-UI    | `https://FQDN/admin`                            |

## Configure Gluu Flex

You can use the Janssen [TUI](https://docs.jans.io/head/admin/kubernetes-ops/tui-k8s/) to configure Flex components. The TUI calls the Config API to perform ad hoc configuration.
