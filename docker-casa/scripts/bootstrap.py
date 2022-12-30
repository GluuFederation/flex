import contextlib
import json
import logging.config
import os
import re
from uuid import uuid4
from string import Template
from functools import cached_property

from jans.pycloudlib import get_manager
from jans.pycloudlib.persistence import render_couchbase_properties
from jans.pycloudlib.persistence import render_base_properties
from jans.pycloudlib.persistence import render_hybrid_properties
from jans.pycloudlib.persistence import render_ldap_properties
from jans.pycloudlib.persistence import render_salt
from jans.pycloudlib.persistence import sync_couchbase_truststore
from jans.pycloudlib.persistence import sync_ldap_truststore
from jans.pycloudlib.persistence import render_sql_properties
from jans.pycloudlib.persistence import render_spanner_properties
from jans.pycloudlib.persistence import CouchbaseClient
from jans.pycloudlib.persistence import LdapClient
from jans.pycloudlib.persistence import SpannerClient
from jans.pycloudlib.persistence import SqlClient
from jans.pycloudlib.persistence import doc_id_from_dn
from jans.pycloudlib.persistence import id_from_dn
from jans.pycloudlib.persistence.utils import PersistenceMapper
from jans.pycloudlib.utils import cert_to_truststore
from jans.pycloudlib.utils import get_random_chars
from jans.pycloudlib.utils import encode_text
from jans.pycloudlib.utils import generate_base64_contents

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("entrypoint")

manager = get_manager()


def modify_webdefault_xml():
    fn = "/opt/jetty/etc/webdefault.xml"
    with open(fn) as f:
        txt = f.read()

    # disable dirAllowed
    updates = re.sub(
        r'(<param-name>dirAllowed</param-name>)(\s*)(<param-value>)true(</param-value>)',
        r'\1\2\3false\4',
        txt,
        flags=re.DOTALL | re.M,
    )

    with open(fn, "w") as f:
        f.write(updates)


def modify_jetty_xml():
    fn = "/opt/jetty/etc/jetty.xml"
    with open(fn) as f:
        txt = f.read()

    # disable contexts
    updates = re.sub(
        r'<New id="DefaultHandler" class="org.eclipse.jetty.server.handler.DefaultHandler"/>',
        r'<New id="DefaultHandler" class="org.eclipse.jetty.server.handler.DefaultHandler">\n\t\t\t\t <Set name="showContexts">false</Set>\n\t\t\t </New>',
        txt,
        flags=re.DOTALL | re.M,
    )

    with open(fn, "w") as f:
        f.write(updates)


def configure_logging():
    # default config
    config = {
        "casa_log_target": "STDOUT",
        "casa_log_level": "INFO",
        "timer_log_target": "FILE",
        "timer_log_level": "INFO",
    }

    # pre-populate custom config; format is JSON string of ``dict``
    try:
        custom_config = json.loads(os.environ.get("GLUU_CASA_APP_LOGGERS", "{}"))
    except json.decoder.JSONDecodeError as exc:
        logger.warning(f"Unable to load logging configuration from environment variable; reason={exc}; fallback to defaults")
        custom_config = {}

    # ensure custom config is ``dict`` type
    if not isinstance(custom_config, dict):
        logger.warning("Invalid data type for GLUU_CASA_APP_LOGGERS; fallback to defaults")
        custom_config = {}

    # list of supported levels
    log_levels = ("OFF", "FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE",)

    # list of supported outputs
    log_targets = ("STDOUT", "FILE",)

    for k, v in custom_config.items():
        if k not in config:
            continue

        if k.endswith("_log_level") and v not in log_levels:
            logger.warning(f"Invalid {v} log level for {k}; fallback to defaults")
            v = config[k]

        if k.endswith("_log_target") and v not in log_targets:
            logger.warning(f"Invalid {v} log output for {k}; fallback to defaults")
            v = config[k]

        # update the config
        config[k] = v

    # mapping between the ``log_target`` value and their appenders
    file_aliases = {
        "casa_log_target": "LOG_FILE",
        "timer_log_target": "TIMERS_FILE",
    }
    for key, value in config.items():
        if not key.endswith("_target"):
            continue

        if value == "STDOUT":
            config[key] = "Console"
        else:
            config[key] = file_aliases[key]

    logfile = "/opt/jans/jetty/casa/resources/log4j2.xml"
    with open(logfile) as f:
        txt = f.read()

    tmpl = Template(txt)
    with open(logfile, "w") as f:
        f.write(tmpl.safe_substitute(config))


def main():
    persistence_type = os.environ.get("CN_PERSISTENCE_TYPE", "ldap")

    render_salt(manager, "/app/templates/salt.tmpl", "/etc/jans/conf/salt")
    render_base_properties("/app/templates/jans.properties.tmpl", "/etc/jans/conf/jans.properties")

    mapper = PersistenceMapper()
    persistence_groups = mapper.groups()

    if persistence_type == "hybrid":
        render_hybrid_properties("/etc/jans/conf/jans-hybrid.properties")

    if "ldap" in persistence_groups:
        render_ldap_properties(
            manager,
            "/app/templates/jans-ldap.properties.tmpl",
            "/etc/jans/conf/jans-ldap.properties",
        )
        sync_ldap_truststore(manager)

    if "couchbase" in persistence_groups:
        render_couchbase_properties(
            manager,
            "/app/templates/jans-couchbase.properties.tmpl",
            "/etc/jans/conf/jans-couchbase.properties",
        )
        sync_couchbase_truststore(manager)

    if "sql" in persistence_groups:
        db_dialect = os.environ.get("CN_SQL_DB_DIALECT", "mysql")

        render_sql_properties(
            manager,
            f"/app/templates/jans-{db_dialect}.properties.tmpl",
            "/etc/jans/conf/jans-sql.properties",
        )

    if "spanner" in persistence_groups:
        render_spanner_properties(
            manager,
            "/app/templates/jans-spanner.properties.tmpl",
            "/etc/jans/conf/jans-spanner.properties",
        )

    if not os.path.isfile("/etc/certs/web_https.crt"):
        manager.secret.to_file("ssl_cert", "/etc/certs/web_https.crt")

    cert_to_truststore(
        "web_https",
        "/etc/certs/web_https.crt",
        "/usr/java/latest/jre/lib/security/cacerts",
        "changeit",
    )

    modify_jetty_xml()
    modify_webdefault_xml()
    configure_logging()

    persistence_setup = PersistenceSetup(manager)
    persistence_setup.import_ldif_files()


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
        mapper = PersistenceMapper()
        self.persistence_type = mapper.mapping["default"]

        # determine persistence client
        client_cls = client_classes.get(self.persistence_type)
        self.client = client_cls(manager)

    @cached_property
    def ctx(self):
        hostname = self.manager.config.get("hostname")

        ctx = {
            "hostname": hostname,
            "casa_redirect_uri": f"https://{hostname}/casa",
            "casa_redirect_logout_uri": f"https://{hostname}/casa/bye.zul",
            "casa_frontchannel_logout_uri": f"https://{hostname}/casa/autologout",
        }

        with open("/app/static/extension/person_authentication/Casa.py") as f:
            ctx["casa_person_authentication_script"] = generate_base64_contents(f.read())

        # Casa client
        ctx["casa_client_id"] = self.manager.config.get("casa_client_id")
        if not ctx["casa_client_id"]:
            ctx["casa_client_id"] = f"1902.{uuid4()}"
            self.manager.config.set("casa_client_id", ctx["casa_client_id"])

        ctx["casa_client_pw"] = self.manager.secret.get("casa_client_pw")
        if not ctx["casa_client_pw"]:
            ctx["casa_client_pw"] = get_random_chars()
            self.manager.secret.set("casa_client_pw", ctx["casa_client_pw"])

        ctx["casa_client_encoded_pw"] = self.manager.secret.get("casa_client_encoded_pw")
        if not ctx["casa_client_encoded_pw"]:
            ctx["casa_client_encoded_pw"] = encode_text(
                ctx["casa_client_pw"], self.manager.secret.get("encoded_salt"),
            ).decode()
            self.manager.secret.set("casa_client_encoded_pw", ctx["casa_client_encoded_pw"])

        # finalized contexts
        return ctx

    @cached_property
    def ldif_files(self):
        filenames = ["casa_config.ldif", "casa_client.ldif"]
        # add casa_person_authentication_script.ldif if there's no existing casa script in persistence to avoid error
        # java.lang.IllegalStateException: Duplicate key casa (attempted merging values 1 and 1)
        if not self._deprecated_script_exists():
            filenames.append("casa_person_authentication_script.ldif")
        return [f"/app/templates/{filename}" for filename in filenames]

    def _deprecated_script_exists(self):
        script_exists = False

        # deprecated Casa script DN
        id_ = "inum=BABA-CACA,ou=scripts,o=jans"

        # sql and spanner
        if self.persistence_type in ("sql", "spanner"):
            script_exists = bool(self.client.get("jansCustomScr", doc_id_from_dn(id_)))

        # couchbase
        elif self.persistence_type == "couchbase":
            bucket = os.environ.get("CN_COUCHBASE_BUCKET_PREFIX", "jans")
            key = id_from_dn(id_)
            req = self.client.exec_query(
                f"SELECT META().id, {bucket}.* FROM {bucket} USE KEYS '{key}'"
            )
            with contextlib.suppress(IndexError):
                entry = req.json()["results"][0]
                script_exists = bool(entry["id"])

        # ldap
        else:
            script_exists = bool(self.client.get(id_))

        return script_exists

    def import_ldif_files(self):
        for file_ in self.ldif_files:
            logger.info(f"Importing {file_}")
            self.client.create_from_ldif(file_, self.ctx)


if __name__ == "__main__":
    main()
