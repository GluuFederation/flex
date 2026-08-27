---
tags:
- administration
- installation
- quick-start
- kubernetes
- minikube
- microk8s
---

# Local Kubernetes Quick Start (Minikube/MicroK8s)

!!! Warning
    **This deployment is for testing and development purposes only. Use Flex [helm deployments](https://docs.gluu.org/stable/install/helm-install/) for production setups.**

The fastest way to try Flex on a local Kubernetes cluster is the demo script. It installs Docker, MicroK8s, Helm, and Flex with default settings.

## System Requirements

System should meet the following requirements:

- 8 GB RAM
- 4 CPU
- 50 GB Disk

## Install

Start a fresh Ubuntu VM with ports `443` and `80` open, then run:

```bash
sudo su -
wget https://raw.githubusercontent.com/GluuFederation/flex/vreplace-flex-version/automation/startflexdemo.sh
chmod u+x startflexdemo.sh
./startflexdemo.sh
```

The script prompts for:

- Fully qualified domain name (FQDN)
- Persistence type (`MYSQL` or `PGSQL`)

## Verify Installation

The installer adds a hosts record inside the VM. To access endpoints from outside the VM, map the VM IP to your FQDN in your local `/etc/hosts`:

```bash
# For example
VM_IP      demoexample.gluu.org
```

Then test the standard endpoints:

| Service     | Endpoint                                        |
|-------------|-------------------------------------------------|
| Auth server | `https://FQDN/.well-known/openid-configuration` |
| FIDO2       | `https://FQDN/.well-known/fido2-configuration`  |
| SCIM        | `https://FQDN/.well-known/scim-configuration`   |

## Configure Flex

Flex can be configured using the [Text-based User Interface (TUI)](https://docs.jans.io/stable/janssen-server/config-guide/config-tools/jans-tui/). The default `admin` password is `Test1234#`.

## Next Steps

For a manual local cluster setup (or to move toward production), see the [Helm local setup](../helm-install/prerequisites/local.md).
