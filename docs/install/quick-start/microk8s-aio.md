---
tags:
- administration
- installation
- quick-start
- kubernetes
- microk8s
- aio
- all-in-one
---

# MicroK8s Quick Start (All-In-One)

!!! Warning
    **This deployment is for testing and development purposes only. Use Flex [helm deployments](https://docs.gluu.org/stable/install/helm-install/) for production setups.**

The fastest way to try Flex All-In-One (AIO) on Kubernetes is the demo script. It installs MicroK8s, ingress-nginx, Helm, and the Flex AIO image with default settings.

## System Requirements

System should meet the following requirements:

- 8 GB RAM
- 4 CPU
- 30 GB Disk

## Install

Start a fresh Ubuntu VM with ports `443` and `80` open, then download the installation script and make it executable:

```bash
wget https://raw.githubusercontent.com/GluuFederation/flex/vreplace-flex-version/automation/start_flex_aio_microk8s_demo.sh
chmod u+x start_flex_aio_microk8s_demo.sh
```

Next, execute the script. You will need to provide the following details:

- Fully qualified domain name (FQDN)
- Persistence type (`MYSQL` or `PGSQL`)
- Flex version (leave empty `""` for the default)
- Virtual Machine's Public IP address in place of `<VM_IP>`

=== "MySQL"

    ```bash
    sudo bash start_flex_aio_microk8s_demo.sh demoexample.gluu.org MYSQL "" <VM_IP>
    ```

=== "PostgreSQL"

    ```bash
    sudo bash start_flex_aio_microk8s_demo.sh demoexample.gluu.org PGSQL "" <VM_IP>
    ```

Console messages like below will confirm the successful startup and readiness of the services:

```text
Waiting for Gluu Flex all-in-one to come up. Please do not cancel out. This can take up to 10 minutes.
deployment.apps/flex-gluu-all-in-one condition met
Testing openid-configuration endpoint..
```

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
| Admin UI    | `https://FQDN/admin`                            |

## Configure Flex

Flex can be configured using the [Text-based User Interface (TUI)](https://docs.jans.io/stable/janssen-server/config-guide/config-tools/jans-tui/). The default `admin` password is `Test1234#`.

!!! Warning
    The default `Test1234#` credential is for local testing only. Never expose this deployment publicly, and rotate the `admin` password before reusing the cluster for anything beyond a throwaway demo.

## Uninstall / Remove Flex

This installation uses MicroK8s and Helm under the hood. Run the commands below to remove the Flex release, the ingress-nginx controller, and MicroK8s itself:

```bash
sudo helm uninstall flex -n gluu --kubeconfig ~/.kube/config
sudo helm uninstall ingress-nginx -n ingress-nginx --kubeconfig ~/.kube/config
sudo snap remove microk8s --purge
```

## Next Steps

For a manual local cluster setup (or to move toward production), see the [Helm local setup](../helm-install/prerequisites/local.md).
