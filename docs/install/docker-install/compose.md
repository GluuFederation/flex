---
tags:
- administration
- reference
- kubernetes
- docker image
- docker compose
---


!!! Warning 
    **This image is for testing and development purposes only. Use Flex [helm charts](https://github.com/GluuFederation/flex/tree/main/charts/gluu) for production setups.**

# Overview

Docker monolith image packaging for Gluu Flex. This image packs janssen services including the auth-server, config-api, fido2, casa, scim and the Gluu admin ui.

## Pre-requisites

- [Docker](https://docs.docker.com/install)
- [Docker compose](https://docs.docker.com/compose/install/)

## Versions

See [Releases](https://github.com/GluuFederation/docker-flex-monolith/releases) for stable versions. This image should never be used in production.
For bleeding-edge/unstable version, use `gluufederation/monolith:5.0.0_dev`.

## Environment Variables

The following environment variables are supported by the container:

| ENV                     | Description                                       | Default                                          |
|-------------------------|---------------------------------------------------|--------------------------------------------------|
| `CN_HOSTNAME`           | Hostname to install gluu with.                    | `demoexample.gluu.org`                           |
| `CN_ADMIN_PASS`         | Password of the admin user.                       | `1t5Fin3#security`                               |
| `CN_ORG_NAME`           | Organization name. Used for ssl cert generation.  | `Gluu`                                           |
| `CN_EMAIL`              | Email. Used for ssl cert generation.              | `team@gluu.org`                               |
| `CN_CITY`               | City. Used for ssl cert generation.               | `Austin`                                         |
| `CN_STATE`              | State. Used for ssl cert generation               | `TX`                                             |
| `CN_COUNTRY`            | Country. Used for ssl cert generation.            | `US`                                             |
| `IS_FQDN_REGISTERED`    | If a DNS record has been added for the docker vm. | `false`                                          |
| `CN_INSTALL_LDAP`       | **NOT SUPPORTED YET**                             | `false`                                          |
| `CN_INSTALL_CONFIG_API` | Installs the Config API service.                  | `true`                                           |
| `CN_INSTALL_SCIM`       | Installs the SCIM  API service.                   | `true`                                           |
| `CN_INSTALL_FIDO2`      | Installs the FIDO2 API service.                   | `true`                                           |
| `CN_INSTALL_CASA`       | Installs the Casa service.                        | `true`                                           |
| `CN_INSTALL_ADMIN_UI`   | Installs the Admin UI service.                    | `true`                                           |
| `MYSQL_DATABASE`        | MySQL gluu flex database.                         | `gluu`                                           |
| `MYSQL_USER`            | MySQL database user.                              | `gluu`                                           |
| `MYSQL_PASSWORD`        | MySQL database user password.                     | `1t5Fin3#security`                               |
| `MYSQL_HOST`            | MySQL host.                                       | `mysql` which is the docker compose service name |



## How to run

Download the compose file:

```bash
wget https://raw.githubusercontent.com/GluuFederation/flex/main/docker-flex-monolith/flex-mysql-compose.yml 
```

Download the the script files 

```bash

wget https://raw.githubusercontent.com/GluuFederation/flex/main/docker-flex-monolith/up.sh
wget https://raw.githubusercontent.com/GluuFederation/flex/main/docker-flex-monolith/down.sh
wget https://raw.githubusercontent.com/GluuFederation/flex/main/docker-flex-monolith/clean.sh
```

Give execute permission
`chmod u+x up.sh down.sh clean.sh`

This docker compose file runs two containers, the flex monolith container and mysql container.

To start the containers.

```bash
./up.sh
```

To view the containers running

```bash

docker compose -f flex-mysql-compose.yml ps
```

To stop the containers.

```bash
./down.sh
```

## Configure Gluu flex

1. Access the Docker container shell using:

    ```bash
    docker compose -f flex-mysql-compose.yml exec flex sh #This opens a bash terminal in the running container
    ```

2. Grab a pair of client_id and client_pw(secret) from `setup.properties` or `/opt/jans/jans-setup/setup.properties.last`

3. Use the CLI tools located under `/opt/jans/jans-cli/` to configure Gluu flex as needed. For example you can run the [TUI](https://docs.jans.io/head/admin/config-guide/config-tools/jans-tui/):
    ```bash
    python3 /opt/jans/jans-cli/config-cli-tui.py
    ```

## Access endpoints externally

Add to your `/etc/hosts` file the ip domain record which should be the ip of the instance docker is installed at and the domain used in the env above `CN_HOSTNAME`.

```bash
# For-example
172.22.0.3      demoexample.gluu.org
```

After adding the record you can hit endpoints such as https://demoexample.gluu.org/.well-known/openid-configuration


## Clean up

Remove setup and volumes

```bash
./clean.sh
```

