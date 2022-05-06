import logging.config
import os
from uuid import uuid4
from functools import cached_property

from jans.pycloudlib import get_manager
from jans.pycloudlib.utils import get_random_chars
from jans.pycloudlib.utils import encode_text
from jans.pycloudlib.persistence import CouchbaseClient
from jans.pycloudlib.persistence import LdapClient
from jans.pycloudlib.persistence import SpannerClient
from jans.pycloudlib.persistence import SqlClient

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("entrypoint")


def render_env(manager):
    hostname = manager.config.get("hostname")
    ctx = {
        # "base_path": os.environ.get("CN_ADMIN_API_BASE_PATH", "/admin"),
        "config_api_base_url": f"https://{hostname}",
        "api_base_url": f"https://{hostname}/jans-config-api/admin-ui",
    }

    with open("/app/templates/env.tmpl") as fr:
        txt = fr.read() % ctx

    with open("/opt/flex/admin-ui/.env", "w") as fw:
        fw.write(txt)


def render_nginx_conf(manager):
    with open("/app/templates/nginx-default.conf.tmpl") as fr:
        ctx = {
            "hostname": manager.config.get("hostname"),
        }
        txt = fr.read() % ctx

    with open("/etc/nginx/http.d/default.conf", "w") as fw:
        fw.write(txt)


def main():
    manager = get_manager()

    # if not os.path.isfile("/etc/certs/web_https.crt"):
    #     manager.secret.to_file("ssl_cert", "/etc/certs/web_https.crt")

    # if not os.path.isfile("/etc/certs/web_https.key"):
    #     manager.secret.to_file("ssl_key", "/etc/certs/web_https.key")

    render_env(manager)
    render_nginx_conf(manager)

    persistence_setup = PersistenceSetup(manager)
    persistence_setup.import_ldif_files()
    persistence_setup.export_plugin_properties()


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
            "ldap": LdapClient,
            "couchbase": CouchbaseClient,
            "spanner": SpannerClient,
            "sql": SqlClient,
        }

        # determine persistence type
        self.persistence_type = os.environ.get("CN_PERSISTENCE_TYPE", "ldap")
        ldap_mapping = os.environ.get("CN_PERSISTENCE_LDAP_MAPPING", "default")

        if self.persistence_type == "hybrid":
            if ldap_mapping == "default":
                client_cls = LdapClient
                self.persistence_type = "ldap"
            else:
                client_cls = CouchbaseClient
                self.persistence_type = "couchbase"

        # determine persistence client
        client_cls = client_classes.get(self.persistence_type)
        self.client = client_cls(manager)

    def get_token_server_ctx(self):
        hostname = os.environ.get("CN_TOKEN_SERVER_BASE_HOSTNAME") or self.manager.config.get("hostname")
        authz_endpoint = os.environ.get("CN_TOKEN_SERVER_AUTHZ_ENDPOINT") or "/jans-auth/restv1/authorize"
        token_endpoint = os.environ.get("CN_TOKEN_SERVER_TOKEN_ENDPOINT") or "/jans-auth/restv1/token"
        introspection_endpoint = os.environ.get("CN_TOKEN_SERVER_INTROSPECTION_ENDPOINT") or "/jans-auth/restv1/introspection"
        userinfo_endpoint = os.environ.get("CN_TOKEN_SERVER_USERINFO_ENDPOINT") or "/jans-auth/restv1/userinfo"

        pw_file = "/etc/jans/conf/token_server_client_secret"
        if not os.path.isfile(pw_file):
            self.manager.secret.to_file("token_server_admin_ui_client_pw", pw_file)

        ctx = {
            "token_server_admin_ui_client_id": os.environ.get("CN_TOKEN_SERVER_CLIENT_ID") or self.manager.config.get("token_server_admin_ui_client_id"),
            "token_server_admin_ui_client_pw": read_from_file(pw_file),
            "token_server_authz_url": f"https://{hostname}{authz_endpoint}",
            "token_server_token_url": f"https://{hostname}{token_endpoint}",
            "token_server_introspection_url": f"https://{hostname}{introspection_endpoint}",
            "token_server_userinfo_url": f"https://{hostname}{userinfo_endpoint}",
        }
        return ctx

    @cached_property
    def ctx(self):
        salt = self.manager.secret.get("encoded_salt")

        ctx = {
            "hostname": self.manager.config.get("hostname"),
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

        # finalized contexts
        return ctx

    def export_plugin_properties(self):
        with open("/app/templates/auiConfiguration.properties.tmpl") as f:
            txt = f.read() % self.ctx
            self.manager.secret.set("plugins_admin_ui_properties", txt)

    @cached_property
    def ldif_files(self):
        filenames = ["clients.ldif"]
        return [f"/app/templates/{filename}" for filename in filenames]

    def import_ldif_files(self):
        for file_ in self.ldif_files:
            logger.info(f"Importing {file_}")
            self.client.create_from_ldif(file_, self.ctx)


if __name__ == "__main__":
    main()
