import os
import json

import ldap3

from pygluu.containerlib.persistence.couchbase import CouchbaseClient
from pygluu.containerlib.persistence.couchbase import get_couchbase_password
from pygluu.containerlib.persistence.couchbase import get_couchbase_user
from pygluu.containerlib.utils import decode_text

from oxd import resolve_oxd_url


class LDAPBackend(object):
    key = "ou=casa,ou=configuration,o=gluu"

    def __init__(self, manager):
        host = os.environ.get("GLUU_LDAP_URL", "localhost:1636")
        user = manager.config.get("ldap_binddn")
        password = decode_text(
            manager.secret.get("encoded_ox_ldap_pw"),
            manager.secret.get("encoded_salt"),
        )

        server = ldap3.Server(host, port=1636, use_ssl=True)
        self.conn = ldap3.Connection(server, user, password)
        # self.manager = manager

    def add_config(self, data):
        with self.conn as conn:
            conn.add(
                self.key,
                attributes={
                    "objectClass": ["top", "oxApplicationConfiguration"],
                    "ou": "casa",
                    "oxConfApplication": json.dumps(data),
                },
            )
            return bool(conn.result["result"] == 0)

    # def config_exists(self):
    #     with self.conn as conn:
    #         conn.search(
    #             search_base=self.key,
    #             search_filter="(objectClass=oxApplicationConfiguration)",
    #             search_scope=ldap3.BASE,
    #             attributes=['objectClass'],
    #             size_limit=1,
    #         )
    #         return conn.entries

    def get_config(self):
        with self.conn as conn:
            conn.search(
                search_base=self.key,
                search_filter="(objectClass=oxApplicationConfiguration)",
                search_scope=ldap3.BASE,
                attributes=['objectClass'],
                size_limit=1,
            )
            if not conn.entries:
                return
            return conn.entries[0]

    def modify_config(self):
        pass


class CouchbaseBackend(object):
    key = "configuration_casa"

    def __init__(self, manager):
        host = os.environ.get("GLUU_COUCHBASE_URL", "localhost")
        user = get_couchbase_user(manager)
        password = get_couchbase_password(manager)
        self.client = CouchbaseClient(host, user, password)

    def add_config(self, data):
        attributes = json.dumps({
            "dn": "ou=casa,ou=configuration,o=gluu",
            "objectClass": "oxApplicationConfiguration",
            "ou": "casa",
            "oxConfApplication": data,
        })

        query = 'INSERT INTO `%s` (KEY, VALUE) VALUES ("%s", %s);\n' % ("gluu", self.key, attributes)
        req = self.client.exec_query(query)

        if req.ok:
            return req.json()["status"] == "success"
        return False

    # def config_exists(self):
    #     query = "SELECT objectClass FROM {0} USE KEYS '{1}'".format("gluu", self.key)
    #     req = self.client.exec_query(query)
    #     if req.ok:
    #         return bool(req.json()["results"])
    #     return False

    def get_config(self):
        query = "SELECT objectClass FROM {0} USE KEYS '{1}'".format("gluu", self.key)
        req = self.client.exec_query(query)
        if not req.ok:
            return
        return req.json()["results"][0]

    def modify_config(self):
        pass


class CasaConfig(object):
    def __init__(self, manager):
        self.manager = manager

        persistence_type = os.environ.get("GLUU_PERSISTENCE_TYPE", "ldap")
        ldap_mapping = os.environ.get("GLUU_PERSISTENCE_LDAP_MAPPING", "default")

        if persistence_type == "ldap":
            backend_cls = LDAPBackend
        elif persistence_type == "couchbase":
            backend_cls = CouchbaseBackend
        else:  # probably `hybrid`
            if ldap_mapping == "default":
                backend_cls = LDAPBackend
            else:
                backend_cls = CouchbaseBackend
        self.backend = backend_cls(self.manager)

    def json_from_template(self):
        oxd_url = os.environ.get("GLUU_OXD_SERVER_URL", "localhost:8443")

        src = "/app/templates/casa.json"

        _, oxd_host, oxd_port = resolve_oxd_url(oxd_url)
        ctx = {
            "hostname": self.manager.config.get("hostname"),
            "oxd_hostname": oxd_host,
            "oxd_port": oxd_port,
        }

        with open(src) as fr:
            return json.loads(fr.read() % ctx)

    def setup(self):
        data = self.json_from_template()
        config = self.backend.get_config()

        if not config:
            self.backend.add_config(data)
