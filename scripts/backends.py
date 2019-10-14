import os

from pygluu.containerlib.utils import decode_text
from pygluu.containerlib.utils import safe_render
from pygluu.containerlib.utils import generate_base64_contents
from pygluu.containerlib.persistence.couchbase import get_couchbase_user
from pygluu.containerlib.persistence.couchbase import get_couchbase_password

import requests
from ldap3 import Connection
from ldap3 import Server
from ldif3 import LDIFParser


def render_ldif(src, dst, ctx):
    with open(src) as f:
        txt = f.read()

    with open(dst, "w") as f:
        f.write(safe_render(txt, ctx))


def get_key_from(dn):
    # for example: `"inum=29DA,ou=attributes,o=gluu"`
    # becomes `["29DA", "attributes"]`
    dns = [i.split("=")[-1] for i in dn.split(",") if i != "o=gluu"]
    dns.reverse()

    # the actual key
    return '_'.join(dns) or "_"


def prepare_template_ctx():
    ctx = {}
    basedir = "/app/static/extension"

    for ext_type in os.listdir(basedir):
        ext_type_dir = os.path.join(basedir, ext_type)

        for fname in os.listdir(ext_type_dir):
            filepath = os.path.join(ext_type_dir, fname)
            ext_name = "{}_{}".format(
                ext_type, os.path.splitext(fname)[0].lower()
            )
            with open(filepath) as fd:
                ctx[ext_name] = generate_base64_contents(fd.read())
    return ctx


class LDAPBackend(object):
    def __init__(self, manager):
        host = os.environ.get("GLUU_LDAP_URL", "localhost:1636")
        user = manager.config.get("ldap_binddn")
        password = decode_text(
            manager.secret.get("encoded_ox_ldap_pw"),
            manager.secret.get("encoded_salt"),
        )

        server = Server(host, port=1636, use_ssl=True)
        self.conn = Connection(server, user, password)
        self.manager = manager

    def import_ldif(self, ctx):
        file_ = "scripts_casa.ldif"
        src = "/app/templates/ldif/{}".format(file_)
        dst = "/app/tmp/{}".format(file_)

        render_ldif(src, dst, ctx)
        parser = LDIFParser(open(dst))

        for dn, entry in parser.parse():
            with self.conn as conn:
                conn.add(dn, attributes=entry)

    def initialize(self):
        ctx = prepare_template_ctx()
        self.import_ldif(ctx)


class CouchbaseBackend(object):
    def __init__(self, manager):
        user = get_couchbase_user(manager)
        password = get_couchbase_password(manager)

        self.client = requests.Session()
        self.client.auth = (user, password)
        self.client.verify = False
        self.manager = manager

    def import_ldif(self, ctx):
        file_ = "scripts_casa.ldif"
        src = "/app/templates/ldif/{}".format(file_)
        dst = "/app/tmp/{}".format(file_)

        render_ldif(src, dst, ctx)
        parser = LDIFParser(open(dst))

        for dn, entry in parser.parse():
            self.add_entry(dn, entry)

    def initialize(self):
        ctx = prepare_template_ctx()
        self.import_ldif(ctx)
