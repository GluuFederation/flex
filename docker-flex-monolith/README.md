# Overview

**This image is for testing and development purposes only! Use Flex [helm charts](../flex-cn-setup/pygluu/kubernetes/templates/helm/gluu) for production setups**

Docker monolith image packaging for Gluu Flex.This image packs janssen services including, the auth-server, config-api, fido2, and scim and the Gluu admin ui and Casa.

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
| `CN_EMAIL`              | Email. Used for ssl cert generation.              | `support@gluu.org`                               |
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
| `RDBMS_DATABASE`        | MySQL gluu flex database.                         | `gluu`                                           |
| `RDBMS_USER`            | MySQL database user.                              | `gluu`                                           |
| `RDBMS_PASSWORD`        | MySQL database user password.                     | `1t5Fin3#security`                               |
| `RDBMS_HOST`            | MySQL host.                                       | `mysql` which is the docker compose service name |


## Pre-requisites
- Clone this repository and `cd` into the `docker-flex-monolith` folder
- [Docker](https://docs.docker.com/install). Docker compose should be installed by default with Docker.

## How to run

```bash
docker compose -f flex-mysql-compose.yml up -d
```

## Clean up

Remove setup and volumes

```
docker compose -f mysql-docker-compose.yml down && rm -rf jans-*
```

## Test

```bash
docker exec -ti docker-flex-monolith-flex-1 bash
```

Run 
```bash
/opt/jans/jans-cli/config-cli.py
#or
/opt/jans/jans-cli/scim-cli.py
```

## Access endpoints externally

Add to your `/etc/hosts` file the ip domain record which should be the ip of the instance docker is installed at and the domain used in the env above `CN_HOSTNAME`.

```bash
# For-example
172.22.0.3      demoexample.gluu.org
```

After adding the record you can hit endpoints such as https://demoexample.gluu.org/.well-known/openid-configuration

## Quick start 

Grab a fresh ubuntu 22.04 lts VM and run:

```bash
wget https://raw.githubusercontent.com/GluuFederation/flex/main/automation/startflexmonolithdemo.sh && chmod u+x startflexmonolithdemo.sh && sudo bash startflexmonolithdemo.sh demoexample.gluu.org MYSQL
```

