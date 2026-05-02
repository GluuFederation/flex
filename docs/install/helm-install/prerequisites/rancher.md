---
tags:
  - administration
  - installation
  - helm
  - rancher
---

This guide covers installing Flex through the Rancher Marketplace.


## Install Rancher

For a stable, production-ready environment that natively supports Persistent Volumes (PVs), install Rancher on a dedicated Kubernetes cluster using Helm. Follow the official [Rancher Helm Installation Guide](https://ranchermanager.docs.rancher.com/pages-for-subheaders/install-upgrade-on-a-kubernetes-cluster).

> 💡 **Testing/Dev Alternative:** If you are only testing and do not need PVs, you can use a single-node Docker installation. The Linux single-node are **4 CPU cores**, **16 GB RAM**, **50 GB SSD**, and ports **80** and **443** open

> ```bash
> docker run -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:v2.14.1
> ```

> *Retrieve the bootstrap password with:* `docker logs <container-id> 2>&1 | grep "Bootstrap Password:"`

> Open: `https://<RANCHER-SERVER-IP>`

> Log in with the default `admin` credentials or your bootstrap password.

> Set a new password when prompted.

---


## Install Flex

### 1. Install Database

You have two options for setting up your backend database depending on your infrastructure's capabilities. 

#### Option A: Install via Kubernetes (Requires PV Support)

!!! Note
    For this setup to work, a PV provisioner must be present and configured in your underlying Kubernetes infrastructure.

Open a kubectl shell from the top right navigation menu `>_` and run:

=== "MySQL"

    ```bash
    wget https://raw.githubusercontent.com/GluuFederation/flex/nightly/automation/mysql.yaml
    kubectl apply -f mysql.yaml # adjust values as preferred
    ```

=== "PostgreSQL"

    ```bash 
    wget https://raw.githubusercontent.com/GluuFederation/flex/nightly/automation/pgsql.yaml
    kubectl apply -f pgsql.yaml # adjust values as preferred
    ```

#### Option B: Install on VM (Docker/No PV Support)


Use this option if you are running a single-node Docker test environment or lack PV support. You can install the database package(MySQL/PostgreSQL) directly on your Linux VM.


### 2. Install [Nginx-Ingress](https://github.com/kubernetes/ingress-nginx)
    
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add stable https://charts.helm.sh/stable
helm repo update
helm install nginx ingress-nginx/ingress-nginx
```

To get the Loadbalancer IP: 
```bash
kubectl get svc nginx-ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### 3. Install Gluu Flex

- Head to `Apps` --> `Charts` and search for `Gluu`
- Click on `Install` on the right side of the window.
- Change the namespace from `default` to `gluu`, then click on `Next`.
- Scroll through the sections to get familiar with the options. For minimal setup follow with the next instructions.
- Add `License SSA`. Before initiating the setup, please obtain an [SSA](https://docs.gluu.org/vreplace-flex-version/install/flex/prerequisites/#obtaining-an-ssa) for Flex trial, after which you will issued a JWT.
- Click on the `Persistence` section. Set `SQL database host uri`, `SQL database username`,`SQL password`, and `SQL database name` to the values you used during the database installation.
- To enable Casa and the Admin UI, navigate to the `Optional Services` section and check the `Enable casa` and `boolean flag to enable admin UI` boxes.
- Click on the  section named `Ingress` and enable all the endpoints. You might add LB IP or address if you don't have `FQDN` for `Gluu`.
- To pass your `FQDN` that is intended to serve the Gluu Flex IDP, head to the `Configuration` section:
    1.  Add your `FQDN` and check the box `Is the FQDN globally resolvable` if it's DNS registered. 
    2.  Click on the `Edit YAML` tab and add your `FQDN` to `nginx-ingress.ingress.hosts` and `nginx-ingress.ingress.tls.hosts`.
- Click on `Install` on the bottom right of the window.

!!! NOTE
    You can upgrade your installation after the deployment. To do that, go to the SUSE Rancher Dashboard -> Apps -> Installed Apps -> gluu -> Click on the 3 dots on the right -> Upgrade -> Make your changes -> Click Update.

The running deployment and services of different Gluu Flex components like `casa`, `admin-ui`, `scim`, `auth-server`, etc can be viewed by navigating through the SUSE Rancher. Go to `Workloads` and see the running pods. Go under `Service Discovery` and checkout the `Ingresses` and `Services`. All deployed components should be in a healthy and running state like in the screenshot shown below.

<img width="1488" alt="Screenshot 2022-07-05 at 11 53 06" src="https://user-images.githubusercontent.com/17182751/177325882-e2819b8d-b2cb-4be2-8c4c-d90815d02093.png">

---

## Next Steps

When installing via Rancher Marketplace, the Ingress, Database, and Helm install steps are handled through the Rancher UI during chart installation. Skip directly to the [post-install](../post-install.md) section.

