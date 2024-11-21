---
tags:
- administration
- reference
- kubernetes
- docker image
---

# docker-admin-ui

A containerized application for Gluu Admin UI frontend.

## Versions

See [Releases](https://github.com/GluuFederation/docker-admin-ui/releases) for stable versions.
For bleeding-edge/unstable version, use `gluufederation/admin-ui:1.0.0_dev`.

## Environment Variables

The following environment variables are supported by the container:

- `CN_CONFIG_ADAPTER`: The config backend adapter, can be `consul` (default), `kubernetes`, or `google`.
- `CN_CONFIG_CONSUL_HOST`: hostname or IP of Consul (default to `localhost`).
- `CN_CONFIG_CONSUL_PORT`: port of Consul (default to `8500`).
- `CN_CONFIG_CONSUL_CONSISTENCY`: Consul consistency mode (choose one of `default`, `consistent`, or `stale`). Default to `stale` mode.
- `CN_CONFIG_CONSUL_SCHEME`: supported Consul scheme (`http` or `https`).
- `CN_CONFIG_CONSUL_VERIFY`: whether to verify cert or not (default to `false`).
- `CN_CONFIG_CONSUL_CACERT_FILE`: path to Consul CA cert file (default to `/etc/certs/consul_ca.crt`). This file will be used if it exists and `CN_CONFIG_CONSUL_VERIFY` set to `true`.
- `CN_CONFIG_CONSUL_CERT_FILE`: path to Consul cert file (default to `/etc/certs/consul_client.crt`).
- `CN_CONFIG_CONSUL_KEY_FILE`: path to Consul key file (default to `/etc/certs/consul_client.key`).
- `CN_CONFIG_CONSUL_TOKEN_FILE`: path to file contains ACL token (default to `/etc/certs/consul_token`).
- `CN_CONFIG_KUBERNETES_NAMESPACE`: Kubernetes namespace (default to `default`).
- `CN_CONFIG_KUBERNETES_CONFIGMAP`: Kubernetes configmaps name (default to `jans`).
- `CN_CONFIG_KUBERNETES_USE_KUBE_CONFIG`: Load credentials from `$HOME/.kube/config`, only useful for non-container environment (default to `false`).
- `CN_SECRET_ADAPTER`: The secrets' adapter, can be `vault` (default), `kubernetes`, or `google`.
- `CN_SECRET_VAULT_VERIFY`: whether to verify cert or not (default to `false`).
- `CN_SECRET_VAULT_ROLE_ID_FILE`: path to file contains Vault AppRole role ID (default to `/etc/certs/vault_role_id`).
- `CN_SECRET_VAULT_SECRET_ID_FILE`: path to file contains Vault AppRole secret ID (default to `/etc/certs/vault_secret_id`).
- `CN_SECRET_VAULT_CERT_FILE`: path to Vault cert file (default to `/etc/certs/vault_client.crt`).
- `CN_SECRET_VAULT_KEY_FILE`: path to Vault key file (default to `/etc/certs/vault_client.key`).
- `CN_SECRET_VAULT_CACERT_FILE`: path to Vault CA cert file (default to `/etc/certs/vault_ca.crt`). This file will be used if it exists and `CN_SECRET_VAULT_VERIFY` set to `true`.
- `CN_SECRET_VAULT_ADDR`: URL of Vault (default to `http://localhost:8200`).
- `CN_SECRET_VAULT_NAMESPACE`: Namespace used to access secrets (default to empty string).
- `CN_SECRET_VAULT_KV_PATH`: Path to KV secrets engine (default to `secret`).
- `CN_SECRET_VAULT_PREFIX`: Base prefix name used to build secret path (default to `jans`).
- `CN_SECRET_VAULT_APPROLE_PATH`: Path to AppRole (default to `approle`).
- `CN_SECRET_KUBERNETES_NAMESPACE`: Kubernetes namespace (default to `default`).
- `CN_SECRET_KUBERNETES_CONFIGMAP`: Kubernetes secrets name (default to `jans`).
- `CN_SECRET_KUBERNETES_USE_KUBE_CONFIG`: Load credentials from `$HOME/.kube/config`, only useful for non-container environment (default to `false`).
- `CN_WAIT_MAX_TIME`: How long the startup "health checks" should run (default to `300` seconds).
- `CN_WAIT_SLEEP_DURATION`: Delay between startup "health checks" (default to `10` seconds).
- `GOOGLE_PROJECT_ID`: Google Project ID (default to empty string). Used when `CN_CONFIG_ADAPTER` or `CN_SECRET_ADAPTER` set to `google`.
- `GOOGLE_APPLICATION_CREDENTIALS`: Optional JSON file (contains Google credentials) that can be injected into container for authentication. Refer to https://cloud.google.com/docs/authentication/provide-credentials-adc#how-to for supported credentials.
- `CN_GOOGLE_SECRET_VERSION_ID`: Janssen secret version ID in Google Secret Manager. Defaults to `latest`, which is recommended.
- `CN_GOOGLE_SECRET_NAME_PREFIX`: Prefix for Janssen secret in Google Secret Manager. Defaults to `jans`. If left `jans-secret` secret will be created.
- `CN_GOOGLE_SECRET_MANAGER_PASSPHRASE`: Passphrase for Janssen secret in Google Secret Manager. This is recommended to be changed and defaults to `secret`.
- `CN_AUTH_BASE_URL`: Base URL of auth server (default to empty).
- `CN_CONFIG_API_BASE_URL`: Base URL of config-api server (default to empty).
- `CN_TOKEN_SERVER_BASE_URL`: Base URL of token server (default to empty).
- `CN_TOKEN_SERVER_AUTHZ_ENDPOINT`: Authorization endpoint at token server (default to `/jans-auth/authorize.htm`).
- `CN_TOKEN_SERVER_TOKEN_ENDPOINT`: Token endpoint at token server (default to `/jans-auth/restv1/token`).
- `CN_TOKEN_SERVER_INTROSPECTION_ENDPOINT`: Introspection endpoint at token server (default to `/jans-auth/restv1/introspection`).
- `CN_TOKEN_SERVER_USERINFO_ENDPOINT`: User info endpoint at token server (default to `/jans-auth/restv1/userinfo`).
- `CN_TOKEN_SERVER_CLIENT_ID`: Client ID registered at token server.
- `CN_TOKEN_SERVER_CERT_FILE`: Path to token server certificate (default to `/etc/certs/token_server.crt`).
- `CN_PERSISTENCE_TYPE`: Persistence backend being used (one of `sql` or `hybrid`; default to `sql`).
- `CN_HYBRID_MAPPING`: Specify data mapping for each persistence (default to `"{}"`). Note this environment only takes effect when `CN_PERSISTENCE_TYPE` is set to `hybrid`. See [hybrid mapping](#hybrid-mapping) section for details.
- `CN_SQL_DB_DIALECT`: Dialect name of SQL backend (one of `mysql`, `pgsql`; default to `mysql`).
- `CN_SQL_DB_HOST`: Host of SQL backend (default to `localhost`).
- `CN_SQL_DB_PORT`: Port of SQL backend (default to `3306`).
- `CN_SQL_DB_NAME`: Database name (default to `jans`)
- `CN_SQL_DB_USER`: Username to interact with SQL backend (default to `jans`).
- `GOOGLE_PROJECT_ID`: Google Project ID (default to empty string).
- `GOOGLE_PROJECT_ID`: Google Project ID (default to empty string). Used when `CN_CONFIG_ADAPTER` or `CN_SECRET_ADAPTER` set to `google`.
- `GLUU_ADMIN_UI_AUTH_METHOD`: Authentication method for admin-ui (default to `basic`). Note, changing the value require restart to jans-config-api.

### Hybrid mapping

Hybrid persistence supports all available persistence types. To configure hybrid persistence and its data mapping, follow steps below:

1. Set `CN_PERSISTENCE_TYPE` environment variable to `hybrid`

2. Set `CN_HYBRID_MAPPING` with the following format:

    ```
    {
        "default": "<sql>",
        "user": "<sql>",
        "site": "<sql>",
        "cache": "<sql>",
        "token": "<sql>",
        "session": "<sql>",
    }
    ```

    Example:

    ```
    {
        "default": "sql",
        "user": "sql",
        "site": "sql",
        "cache": "sql",
        "token": "sql",
        "session": "sql",
    }
    ```
