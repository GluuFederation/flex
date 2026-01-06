---
tags:
- administration
- installation
- quick-start
- docker
---

!!! Warning
    **This image is for testing and development purposes only. Use Flex [helm charts](https://github.com/GluuFederation/flex/tree/main/charts/gluu) for production setups.**

## Overview

The quickest way to get Gluu flex up and running is to have a Docker container-based deployment.

## System Requirements

System should meet [minimum VM system requirements](../vm-install/vm-requirements.md)

## Install

Installation depends on a [set of environment variables](https://github.com/GluuFederation/flex/tree/main/docker-flex-monolith#environment-variables).
These environment variables can be set to customize installation as per the need. If not set, the installer uses default values.

Run this command to start the installation:

```bash
wget https://raw.githubusercontent.com/GluuFederation/flex/vreplace-flex-version/automation/startflexmonolithdemo.sh && chmod u+x startflexmonolithdemo.sh && sudo bash startflexmonolithdemo.sh demoexample.gluu.org MYSQL
```

Console messages like below confirms the successful installation:

```
[+] Running 3/3
 ⠿ Network docker-flex-monolith_cloud_bridge  Created                      0.0s    
 ⠿ Container docker-flex-monolith-mysql-1     Started                      0.6s
 ⠿ Container docker-flex-monolith-flex-1      Started                      0.9s
 
Waiting for auth-server to come up. Depending on the resources it may take 3-5 mins for the services to be up.
Testing openid-configuration endpoint.. 
```

As can be seen, the install script also accesses the well-known endpoints to verify that Gluu Flex is responsive.

## Verify Installation By Accessing Standard Endpoints


To access Gluu flex standard endpoints from outside of the Docker container, systems `/etc/hosts` file needs to be updated. Open the file and add the IP domain record which should be the IP of the instance docker is installed. And the domain used in the env above `CN_HOSTNAME`.

```bash
# For-example
172.22.0.3      demoexample.gluu.org
```

After adding the record, hit the standard endpoints such as

```
https://demoexample.gluu.org/.well-known/openid-configuration
```

## Configure Gluu flex

1. Access the Docker container shell using:

    ```bash
    docker exec -ti docker-flex-monolith-flex-1 bash
    ```

2. Grab a pair of client_id and client_pw(secret) from `setup.properties` or `/opt/jans/jans-setup/setup.properties.last`

3. Use the CLI tools located under `/opt/jans/jans-cli/` to configure Gluu flex as needed. For example you can run the [TUI](https://docs.jans.io/head/admin/config-guide/config-tools/jans-tui/):
    ```bash
    python3 /opt/jans/jans-cli/config-cli-tui.py
    ```


## Uninstall/Remove Gluu flex

This docker based installation uses `docker compose` under the hood to create containers. Hence uninstalling Gluu flex involves invoking `docker compose` with appropriate yml file. Run command below to stop and remove containers.

```
docker compose -f /tmp/flex/docker-flex-monolith/flex-mysql-compose.yml down && rm -rf flex-*
```

Console messages like below confirms the successful removal:

```
[+] Running 3/3
 ⠿ Container docker-flex-monolith-flex-1      Removed                   10.5s
 ⠿ Container docker-flex-monolith-mysql-1     Removed                    0.9s
 ⠿ Network docker-flex-monolith_cloud_bridge  Removed                    0.1s
```
