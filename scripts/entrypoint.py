# import json
import os
import re

import six.moves

from pygluu.containerlib import get_manager
from pygluu.containerlib.persistence import render_couchbase_properties
from pygluu.containerlib.persistence import render_gluu_properties
from pygluu.containerlib.persistence import render_hybrid_properties
from pygluu.containerlib.persistence import render_ldap_properties
from pygluu.containerlib.persistence import render_salt
from pygluu.containerlib.persistence import sync_couchbase_cert
from pygluu.containerlib.persistence import sync_couchbase_truststore
from pygluu.containerlib.persistence import sync_ldap_truststore
from pygluu.containerlib.utils import cert_to_truststore
from pygluu.containerlib.utils import get_server_certificate

manager = get_manager()


def resolve_oxd_url(url):
    result = six.moves.urllib_parse.urlparse(url)
    scheme = result.scheme or "https"
    host = result.hostname or result.path.split(":")[0]
    port = result.port or int(result.path.split(":")[-1])
    return scheme, host, port


# def render_casa_json():
#     oxd_url = os.environ.get("GLUU_OXD_SERVER_URL", "localhost:8443")

#     src = "/app/templates/casa.json"
#     dst = "/etc/gluu/conf/casa.json"
#     ctx = {
#         "hostname": manager.config.get("hostname"),
#         "configFolder": "/etc/gluu/conf"
#     }

#     with open(src) as fr:
#         data = json.loads(fr.read() % ctx)
#         _, oxd_host, oxd_port = resolve_oxd_url(oxd_url)

#         data["oxd_config"]["host"] = oxd_host
#         data["oxd_config"]["port"] = int(oxd_port)

#         with open(dst, "w") as fw:
#             fw.write(json.dumps(data))


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

    # disable Jetty version info
    updates = re.sub(
        r'(<Set name="sendServerVersion"><Property name="jetty.httpConfig.sendServerVersion" deprecated="jetty.send.server.version" default=")true(" /></Set>)',
        r'\1false\2',
        updates,
        flags=re.DOTALL | re.M,
    )

    with open(fn, "w") as f:
        f.write(updates)


def get_oxd_cert():
    oxd_url = os.environ.get("GLUU_OXD_SERVER_URL", "localhost:8443")
    _, host, port = resolve_oxd_url(oxd_url)

    if not os.path.isfile("/etc/certs/oxd.crt"):
        get_server_certificate(host, port, "/etc/certs/oxd.crt")


def main():
    persistence_type = os.environ.get("GLUU_PERSISTENCE_TYPE", "ldap")

    render_salt(manager, "/app/templates/salt.tmpl", "/etc/gluu/conf/salt")
    render_gluu_properties("/app/templates/gluu.properties.tmpl", "/etc/gluu/conf/gluu.properties")

    if persistence_type in ("ldap", "hybrid"):
        render_ldap_properties(
            manager,
            "/app/templates/gluu-ldap.properties.tmpl",
            "/etc/gluu/conf/gluu-ldap.properties",
        )
        sync_ldap_truststore(manager)

    if persistence_type in ("couchbase", "hybrid"):
        render_couchbase_properties(
            manager,
            "/app/templates/gluu-couchbase.properties.tmpl",
            "/etc/gluu/conf/gluu-couchbase.properties",
        )
        # need to resolve whether we're using default or user-defined couchbase cert
        sync_couchbase_cert(manager)
        sync_couchbase_truststore(manager)

    if persistence_type == "hybrid":
        render_hybrid_properties("/etc/gluu/conf/gluu-hybrid.properties")

    if not os.path.isfile("/etc/certs/gluu_https.crt"):
        get_server_certificate(manager.config.get("hostname"), 443, "/etc/certs/gluu_https.crt")

    cert_to_truststore(
        "gluu_https",
        "/etc/certs/gluu_https.crt",
        "/usr/lib/jvm/default-jvm/jre/lib/security/cacerts",
        "changeit",
    )

    get_oxd_cert()
    cert_to_truststore(
        "gluu_oxd",
        "/etc/certs/oxd.crt",
        "/usr/lib/jvm/default-jvm/jre/lib/security/cacerts",
        "changeit",
    )
    # if not (os.path.isfile('/etc/gluu/conf/casa.json') and os.path.getsize('/etc/gluu/conf/casa.json')) > 0:
    #     render_casa_json()
    modify_jetty_xml()
    modify_webdefault_xml()


if __name__ == "__main__":
    main()
