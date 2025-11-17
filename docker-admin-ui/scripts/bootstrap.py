import json
import logging.config
import os
from uuid import uuid4
from functools import cached_property

from jans.pycloudlib import get_manager
from jans.pycloudlib import wait_for_persistence
from jans.pycloudlib.persistence.sql import doc_id_from_dn
from jans.pycloudlib.persistence.sql import SqlClient
from jans.pycloudlib.persistence.utils import PersistenceMapper
from jans.pycloudlib.utils import encode_text
from jans.pycloudlib.utils import get_random_chars

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("admin-ui")


def main():
    manager = get_manager()

    wait_for_persistence(manager)
    render_env_config(manager)

    with manager.create_lock("admin-ui-setup"):
        persistence_setup = PersistenceSetup(manager)
        persistence_setup.import_ldif_files()
        persistence_setup.save_config()


def read_from_file(path):
    txt = ""
    try:
        with open(path) as f:
            txt = f.read()
    except FileNotFoundError:
        logger.warning(f"Unable to read {path} file; fallback to empty string")
    return txt.strip()


class PersistenceSetup:
    def __init__(self, manager):
        self.manager = manager

        client_classes = {
            "sql": SqlClient,
        }

        # determine persistence type
        mapper = PersistenceMapper()
        self.persistence_type = mapper.mapping["default"]

        # determine persistence client
        client_cls = client_classes.get(self.persistence_type)
        self.client = client_cls(manager)

    def get_token_server_ctx(self):
        hostname = self.manager.config.get("hostname")
        base_url = os.environ.get("CN_TOKEN_SERVER_BASE_URL") or f"https://{hostname}"
        authz_endpoint = os.environ.get("CN_TOKEN_SERVER_AUTHZ_ENDPOINT") or "/jans-auth/restv1/authorize"
        token_endpoint = os.environ.get("CN_TOKEN_SERVER_TOKEN_ENDPOINT") or "/jans-auth/restv1/token"
        introspection_endpoint = os.environ.get("CN_TOKEN_SERVER_INTROSPECTION_ENDPOINT") or "/jans-auth/restv1/introspection"
        userinfo_endpoint = os.environ.get("CN_TOKEN_SERVER_USERINFO_ENDPOINT") or "/jans-auth/restv1/userinfo"

        pw_file = "/etc/jans/conf/token_server_client_secret"
        if not os.path.isfile(pw_file):
            self.manager.secret.to_file("token_server_admin_ui_client_pw", pw_file)

        return {
            "token_server_admin_ui_client_id": os.environ.get("CN_TOKEN_SERVER_CLIENT_ID") or self.manager.config.get("token_server_admin_ui_client_id"),
            "token_server_admin_ui_client_pw": read_from_file(pw_file),
            "token_server_base_url": base_url,
            "token_server_authz_url": f"{base_url}{authz_endpoint}",
            "token_server_token_url": f"{base_url}{token_endpoint}",
            "token_server_introspection_url": f"{base_url}{introspection_endpoint}",
            "token_server_userinfo_url": f"{base_url}{userinfo_endpoint}",
        }

    @cached_property
    def ctx(self):
        salt = self.manager.secret.get("encoded_salt")
        hostname = self.manager.config.get("hostname")

        ctx = {
            "hostname": hostname,
            "adminui_authentication_mode": os.environ.get("GLUU_ADMIN_UI_AUTH_METHOD", "basic"),
            "jans_auth_base_url": os.environ.get("CN_AUTH_BASE_URL", f"https://{hostname}"),
        }

        # admin-ui client for auth server
        ctx["admin_ui_client_id"] = self.manager.config.get("admin_ui_client_id")
        if not ctx["admin_ui_client_id"]:
            ctx["admin_ui_client_id"] = f"1901.{uuid4()}"
            self.manager.config.set("admin_ui_client_id", ctx["admin_ui_client_id"])

        ctx["admin_ui_client_pw"] = self.manager.secret.get("admin_ui_client_pw")
        if not ctx["admin_ui_client_pw"]:
            ctx["admin_ui_client_pw"] = get_random_chars()
            self.manager.secret.set("admin_ui_client_pw", ctx["admin_ui_client_pw"])

        ctx["admin_ui_client_encoded_pw"] = self.manager.secret.get("admin_ui_client_encoded_pw")
        if not ctx["admin_ui_client_encoded_pw"]:
            ctx["admin_ui_client_encoded_pw"] = encode_text(ctx["admin_ui_client_pw"], salt).decode()
            self.manager.secret.set("admin_ui_client_encoded_pw", ctx["admin_ui_client_encoded_pw"])

        # admin-ui client for token server
        ctx["token_server_admin_ui_client_id"] = self.manager.config.get("token_server_admin_ui_client_id")
        if not ctx["token_server_admin_ui_client_id"]:
            ctx["token_server_admin_ui_client_id"] = f"1901.{uuid4()}"
            self.manager.config.set("token_server_admin_ui_client_id", ctx["token_server_admin_ui_client_id"])

        ctx["token_server_admin_ui_client_pw"] = self.manager.secret.get("token_server_admin_ui_client_pw")
        if not ctx["token_server_admin_ui_client_pw"]:
            ctx["token_server_admin_ui_client_pw"] = get_random_chars()
            self.manager.secret.set("token_server_admin_ui_client_pw", ctx["token_server_admin_ui_client_pw"])

        ctx["token_server_admin_ui_client_encoded_pw"] = self.manager.secret.get("token_server_admin_ui_client_encoded_pw")
        if not ctx["token_server_admin_ui_client_encoded_pw"]:
            ctx["token_server_admin_ui_client_encoded_pw"] = encode_text(ctx["token_server_admin_ui_client_pw"], salt).decode()
            self.manager.secret.set("token_server_admin_ui_client_encoded_pw", ctx["token_server_admin_ui_client_encoded_pw"])

        ctx.update(self.get_token_server_ctx())

        ctx.update({
            "license_hardware_key": "",
            "oidc_client_id": "",
            "oidc_client_secret": "",
            "scan_license_api_hostname": "",
            "op_host": "",
            "ssa": "",
            "org_id": "",
        })

        # finalized contexts
        return ctx

    @cached_property
    def ldif_files(self):
        filenames = ["clients.ldif", "aui_webhook.ldif", "adminUIResourceScopesMapping.ldif"]
        return [f"/app/templates/admin-ui/{filename}" for filename in filenames]

    def import_ldif_files(self):
        for file_ in self.ldif_files:
            logger.info(f"Importing {file_}")
            self.client.create_from_ldif(file_, self.ctx)

    def save_config(self):
        logger.info("Updating admin-ui config in persistence (if required).")

        with open("/app/templates/admin-ui/auiConfiguration.json") as f:
            conf_from_file = f.read() % self.ctx

        dn = doc_id_from_dn("ou=admin-ui,ou=configuration,o=jans")
        table_name = "jansAppConf"

        entry = self.client.get(table_name, dn)
        conf = entry.get("jansConfApp") or "{}"

        should_update, merged_conf = resolve_conf_app(
            json.loads(conf),
            json.loads(conf_from_file),
        )

        if should_update:
            logger.info("Updating admin-ui config app")
            entry["jansConfApp"] = json.dumps(merged_conf)
            entry["jansRevision"] = entry.get("jansRevision", 0) + 1
            self.client.update(table_name, dn, entry)


def resolve_conf_app(old_conf, new_conf):
    should_update = False

    # old_conf may still empty; replace with new_conf
    if not old_conf:
        return True, new_conf

    # licenseConfig is new property added after v1.0.9 release
    if "licenseConfig" not in old_conf:
        old_conf["licenseConfig"] = new_conf["licenseConfig"]
        should_update = True

    # there are various attributes need to be updated in the config (beware licenseConfig modification)
    else:
        # licenseConfig.ssa is added as per v1.0.11
        if "ssa" not in old_conf["licenseConfig"]:
            old_conf["licenseConfig"]["ssa"] = new_conf["licenseConfig"]["ssa"]
            should_update = True

        if "opHost" not in old_conf["licenseConfig"]["oidcClient"]:
            old_conf["licenseConfig"]["oidcClient"]["opHost"] = old_conf["licenseConfig"].pop(
                "scanLicenseAuthServerHostname",
                new_conf["licenseConfig"]["oidcClient"]["opHost"],
            )
            should_update = True

        # credentialsEncryptionKey is removed post 1.0.12
        if "credentialsEncryptionKey" in old_conf["licenseConfig"]:
            old_conf["licenseConfig"].pop("credentialsEncryptionKey", None)
            should_update = True

        # add missing intervalForSyncLicenseDetailsInDays under licenseConfig
        if "intervalForSyncLicenseDetailsInDays" not in old_conf["licenseConfig"]:
            old_conf["licenseConfig"]["intervalForSyncLicenseDetailsInDays"] = 30
            should_update = True

        # changes for admin-ui clients
        client_changes = [
            ("auiWebClient", "authServerClient"),  # authServerClient is renamed to auiWebClient
            ("auiBackendApiClient", "tokenServerClient"),  # tokenServerClient is renamed to auiBackendApiClient
        ]
        for new_client, old_client in client_changes:
            if new_client not in old_conf["oidcConfig"]:
                old_conf["oidcConfig"][new_client] = old_conf["oidcConfig"].pop(
                    old_client, new_conf["oidcConfig"][new_client],
                )
                should_update = True

        for client in ("auiWebClient", "auiBackendApiClient"):
            # sync opHost and scopes
            for attr in ["opHost", "scopes"]:
                if old_conf["oidcConfig"][client][attr] != new_conf["oidcConfig"][client][attr]:
                    old_conf["oidcConfig"][client][attr] = new_conf["oidcConfig"][client][attr]
                    should_update = True

        # add missing introspectionEndpoint
        if "introspectionEndpoint" not in old_conf["oidcConfig"]["auiBackendApiClient"]:
            old_conf["oidcConfig"]["auiBackendApiClient"]["introspectionEndpoint"] = new_conf["oidcConfig"]["auiBackendApiClient"]["introspectionEndpoint"]
            should_update = True

        # add missing additionalParameters
        if "additionalParameters" not in old_conf["oidcConfig"]["auiWebClient"]:
            old_conf["oidcConfig"]["auiWebClient"]["additionalParameters"] = []
            should_update = True

        # changes to auiBackendApiClient endpoints
        for endpoint in ["tokenEndpoint", "introspectionEndpoint"]:
            if old_conf["oidcConfig"]["auiBackendApiClient"][endpoint] != new_conf["oidcConfig"]["auiBackendApiClient"][endpoint]:
                old_conf["oidcConfig"]["auiBackendApiClient"][endpoint] = new_conf["oidcConfig"]["auiBackendApiClient"][endpoint]
                should_update = True

        # add missing uiConfig
        ui_conf = old_conf.get("uiConfig", {})

        # add top-level config under uiConfig (if missing)
        ui_conf_attrs = {
            "sessionTimeoutInMins": 30,
            "allowSmtpKeystoreEdit": True,
            "cedarlingLogType": "off",
            "auiPolicyStoreUrl": "",
            "auiDefaultPolicyStorePath": "./custom/config/adminUI/policy-store.json",
            "cedarlingPolicyStoreRetrievalPoint": "default"
        }
        for k, v in ui_conf_attrs.items():
            if k not in ui_conf:
                ui_conf[k] = v
                should_update = True

        # update/add uiConfig
        old_conf["uiConfig"] = ui_conf

    # finalized status and conf
    return should_update, old_conf


def render_env_config(manager):
    hostname = manager.config.get("hostname")
    ctx = {
        "hostname": hostname,
        "config_api_base_url": os.environ.get("CN_CONFIG_API_BASE_URL", f"https://{hostname}"),
    }

    with open("/app/templates/admin-ui/env-config.js") as fr:
        txt = fr.read() % ctx

    with open("/opt/flex/admin-ui/dist/env-config.js", "w") as fw:
        fw.write(txt)


if __name__ == "__main__":
    main()
