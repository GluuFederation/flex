## Overview

Docker assets for Casa

## Versions

- Stable: `gluufederation/casa:4.2.0_02`
- Unstable: `gluufederation/casa:4.2.0_dev`

Refer to [Changelog](./CHANGES.md) for details on new features, bug fixes, or older releases.

## Environment Variables

The following environment variables are supported by the container:

- `GLUU_CONFIG_ADAPTER`: The config backend adapter, can be `consul` (default) or `kubernetes`.
- `GLUU_CONFIG_CONSUL_HOST`: hostname or IP of Consul (default to `localhost`).
- `GLUU_CONFIG_CONSUL_PORT`: port of Consul (default to `8500`).
- `GLUU_CONFIG_CONSUL_CONSISTENCY`: Consul consistency mode (choose one of `default`, `consistent`, or `stale`). Default to `stale` mode.
- `GLUU_CONFIG_CONSUL_SCHEME`: supported Consul scheme (`http` or `https`).
- `GLUU_CONFIG_CONSUL_VERIFY`: whether to verify cert or not (default to `false`).
- `GLUU_CONFIG_CONSUL_CACERT_FILE`: path to Consul CA cert file (default to `/etc/certs/consul_ca.crt`). This file will be used if it exists and `GLUU_CONFIG_CONSUL_VERIFY` set to `true`.
- `GLUU_CONFIG_CONSUL_CERT_FILE`: path to Consul cert file (default to `/etc/certs/consul_client.crt`).
- `GLUU_CONFIG_CONSUL_KEY_FILE`: path to Consul key file (default to `/etc/certs/consul_client.key`).
- `GLUU_CONFIG_CONSUL_TOKEN_FILE`: path to file contains ACL token (default to `/etc/certs/consul_token`).
- `GLUU_CONFIG_KUBERNETES_NAMESPACE`: Kubernetes namespace (default to `default`).
- `GLUU_CONFIG_KUBERNETES_CONFIGMAP`: Kubernetes configmaps name (default to `gluu`).
- `GLUU_CONFIG_KUBERNETES_USE_KUBE_CONFIG`: Load credentials from `$HOME/.kube/config`, only useful for non-container environment (default to `false`).
- `GLUU_SECRET_ADAPTER`: The secrets adapter, can be `vault` or `kubernetes`.
- `GLUU_SECRET_VAULT_SCHEME`: supported Vault scheme (`http` or `https`).
- `GLUU_SECRET_VAULT_HOST`: hostname or IP of Vault (default to `localhost`).
- `GLUU_SECRET_VAULT_PORT`: port of Vault (default to `8200`).
- `GLUU_SECRET_VAULT_VERIFY`: whether to verify cert or not (default to `false`).
- `GLUU_SECRET_VAULT_ROLE_ID_FILE`: path to file contains Vault AppRole role ID (default to `/etc/certs/vault_role_id`).
- `GLUU_SECRET_VAULT_SECRET_ID_FILE`: path to file contains Vault AppRole secret ID (default to `/etc/certs/vault_secret_id`).
- `GLUU_SECRET_VAULT_CERT_FILE`: path to Vault cert file (default to `/etc/certs/vault_client.crt`).
- `GLUU_SECRET_VAULT_KEY_FILE`: path to Vault key file (default to `/etc/certs/vault_client.key`).
- `GLUU_SECRET_VAULT_CACERT_FILE`: path to Vault CA cert file (default to `/etc/certs/vault_ca.crt`). This file will be used if it exists and `GLUU_SECRET_VAULT_VERIFY` set to `true`.
- `GLUU_SECRET_KUBERNETES_NAMESPACE`: Kubernetes namespace (default to `default`).
- `GLUU_SECRET_KUBERNETES_CONFIGMAP`: Kubernetes secrets name (default to `gluu`).
- `GLUU_SECRET_KUBERNETES_USE_KUBE_CONFIG`: Load credentials from `$HOME/.kube/config`, only useful for non-container environment (default to `false`).
- `GLUU_WAIT_MAX_TIME`: How long the startup "health checks" should run (default to `300` seconds).
- `GLUU_WAIT_SLEEP_DURATION`: Delay between startup "health checks" (default to `10` seconds).
- `GLUU_MAX_RAM_PERCENTAGE`: Used in conjunction with Docker memory limitations (`docker run -m <mem>`) to identify the percentage of the maximum amount of heap memory.
- `GLUU_DEBUG_PORT`: port of remote debugging (if omitted, remote debugging will be disabled).
- `GLUU_PERSISTENCE_TYPE`: Persistence backend being used (one of `ldap`, `couchbase`, or `hybrid`; default to `ldap`).
- `GLUU_PERSISTENCE_LDAP_MAPPING`: Specify data that should be saved in LDAP (one of `default`, `user`, `cache`, `site`, or `token`; default to `default`). Note this environment only takes effect when `GLUU_PERSISTENCE_TYPE` is set to `hybrid`.
- `GLUU_LDAP_URL`: Address and port of LDAP server (default to `localhost:1636`); required if `GLUU_PERSISTENCE_TYPE` is set to `ldap` or `hybrid`.
- `GLUU_COUCHBASE_URL`: Address of Couchbase server (default to `localhost`); required if `GLUU_PERSISTENCE_TYPE` is set to `couchbase` or `hybrid`.
- `GLUU_COUCHBASE_USER`: Username of Couchbase server (default to `admin`); required if `GLUU_PERSISTENCE_TYPE` is set to `couchbase` or `hybrid`.
- `GLUU_COUCHBASE_CERT_FILE`: Couchbase root certificate location (default to `/etc/certs/couchbase.crt`); required if `GLUU_PERSISTENCE_TYPE` is set to `couchbase` or `hybrid`.
- `GLUU_COUCHBASE_PASSWORD_FILE`: Path to file contains Couchbase password (default to `/etc/gluu/conf/couchbase_password`); required if `GLUU_PERSISTENCE_TYPE` is set to `couchbase` or `hybrid`.
- `GLUU_COUCHBASE_CONN_TIMEOUT`: Connect timeout used when a bucket is opened (default to `10000` milliseconds).
- `GLUU_COUCHBASE_CONN_MAX_WAIT`: Maximum time to wait before retrying connection (default to `20000` milliseconds).
- `GLUU_COUCHBASE_SCAN_CONSISTENCY`: Default scan consistency; one of `not_bounded`, `request_plus`, or `statement_plus` (default to `not_bounded`).
- `GLUU_OXAUTH_BACKEND`: The oxAuth backend address, default is localhost:8081 (used in `wait_for.py` script)
- `GLUU_OXD_SERVER_URL`: URL to oxd server (default to `https://localhost:8443`).
