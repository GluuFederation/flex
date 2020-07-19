import os
import json
from collections import namedtuple

from ldap3 import (
    BASE,
    Connection,
    MODIFY_DELETE,
    MODIFY_REPLACE,
    Server,
)

from pygluu.containerlib.persistence.couchbase import CouchbaseClient
from pygluu.containerlib.persistence.couchbase import get_couchbase_password
from pygluu.containerlib.persistence.couchbase import get_couchbase_user
from pygluu.containerlib.utils import decode_text

from oxd import resolve_oxd_url

Entry = namedtuple("Entry", ["id", "attrs"])


class LDAPBackend:
    def __init__(self, manager):
        url = os.environ.get("GLUU_LDAP_URL", "localhost:1636")
        user = manager.config.get("ldap_binddn")
        passwd = decode_text(
            manager.secret.get("encoded_ox_ldap_pw"),
            manager.secret.get("encoded_salt"),
        )

        server = Server(url, port=1636, use_ssl=True)
        self.conn = Connection(server, user, passwd)
        self.manager = manager

    def get_entry(self, key, filter_="", attrs=None, **kwargs):
        attrs = None or ["*"]
        filter_ = filter_ or "(objectClass=*)"

        with self.conn as conn:
            conn.search(
                search_base=key,
                search_filter=filter_,
                search_scope=BASE,
                attributes=attrs,
            )

            if not conn.entries:
                return

            entry = conn.entries[0]
            id_ = entry.entry_dn
            attrs = {}

            for k, v in entry.entry_attributes_as_dict.items():
                if len(v) < 2:
                    v = v[0]
                attrs[k] = v
            return Entry(id_, attrs)

    def modify_entry(self, key, attrs=None, **kwargs):
        attrs = attrs or {}
        del_flag = kwargs.get("delete_attr", False)

        if del_flag:
            mod = MODIFY_DELETE
        else:
            mod = MODIFY_REPLACE

        for k, v in attrs.items():
            if not isinstance(v, list):
                v = [v]
            attrs[k] = [(mod, v)]

        with self.conn as conn:
            conn.modify(key, attrs)
            return bool(conn.result["description"] == "success"), conn.result["message"]

    def add_entry(self, key, attrs=None, **kwargs):
        attrs = attrs or {}

        for k, v in attrs.items():
            if not isinstance(v, list):
                v = [v]
            attrs[k] = v

        with self.conn as conn:
            conn.add(key, attributes=attrs)
            return bool(conn.result["description"] == "success"), conn.result["message"]


class CouchbaseBackend:
    def __init__(self, manager):
        hosts = os.environ.get("GLUU_COUCHBASE_URL", "localhost")
        user = get_couchbase_user(manager)
        password = get_couchbase_password(manager)
        self.client = CouchbaseClient(hosts, user, password)

    def get_entry(self, key, filter_="", attrs=None, **kwargs):
        bucket = kwargs.get("bucket")
        req = self.client.exec_query(
            "SELECT META().id, {0}.* FROM {0} USE KEYS '{1}'".format(bucket, key)
        )

        if not req.ok:
            return

        try:
            attrs = req.json()["results"][0]
            return Entry(attrs.pop("id"), attrs)
        except IndexError:
            return

    def modify_entry(self, key, attrs=None, **kwargs):
        attrs = attrs or {}
        bucket = kwargs.get("bucket")
        del_flag = kwargs.get("delete_attr", False)

        if del_flag:
            mod_kv = "UNSET {}".format(
                ",".join([k for k, _ in attrs.items()])
            )
        else:
            mod_kv = "SET {}".format(
                ",".join(["{}={}".format(k, json.dumps(v)) for k, v in attrs.items()])
            )

        query = "UPDATE {} USE KEYS '{}' {}".format(bucket, key, mod_kv)
        req = self.client.exec_query(query)
        if req.ok:
            resp = req.json()
            return bool(resp["status"] == "success"), resp["status"]
        return False, ""

    def add_entry(self, key, attrs=None, **kwargs):
        attrs = attrs or {}
        bucket = kwargs.get("bucket")

        query = 'INSERT INTO `%s` (KEY, VALUE) VALUES ("%s", %s);\n' % (bucket, key, json.dumps(attrs))
        req = self.client.exec_query(query)

        if req.ok:
            resp = req.json()
            return bool(resp["status"] == "success"), resp["status"]
        return False, ""


class CasaConfig(object):
    def __init__(self, manager):
        self.manager = manager

        persistence_type = os.environ.get("GLUU_PERSISTENCE_TYPE", "ldap")
        ldap_mapping = os.environ.get("GLUU_PERSISTENCE_LDAP_MAPPING", "default")

        if persistence_type == "ldap":
            backend_type = "ldap"
            backend_cls = LDAPBackend
        elif persistence_type == "couchbase":
            backend_type = "couchbase"
            backend_cls = CouchbaseBackend
        else:  # probably `hybrid`
            if ldap_mapping == "default":
                backend_type = "ldap"
                backend_cls = LDAPBackend
            else:
                backend_type = "couchbase"
                backend_cls = CouchbaseBackend

        self.backend_type = backend_type
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

        if self.backend_type == "ldap":
            key = "ou=casa,ou=configuration,o=gluu"
        else:
            key = "configuration_casa"

        config = self.backend.get_entry(key, **{"bucket": "gluu"})

        if not config:
            conf_app = data

            if self.backend_type == "ldap":
                attrs = {
                    "objectClass": ["top", "oxApplicationConfiguration"],
                    "ou": "casa",
                    "oxConfApplication": json.dumps(data),
                }
            else:
                attrs = {
                    "dn": "ou=casa,ou=configuration,o=gluu",
                    "objectClass": "oxApplicationConfiguration",
                    "ou": "casa",
                    "oxConfApplication": data,
                }

            self.backend.add_entry(key, attrs, **{"bucket": "gluu"})

        # if config exists, modify it if neccessary
        else:
            should_modify = False

            # compare oxd_config
            conf_app = config.attrs["oxConfApplication"]
            if self.backend_type == "ldap":
                conf_app = json.loads(conf_app)

            if data["oxd_config"]["host"] != conf_app["oxd_config"]["host"]:
                conf_app["oxd_config"]["host"] = data["oxd_config"]["host"]
                should_modify = True

            if data["oxd_config"]["port"] != conf_app["oxd_config"]["port"]:
                conf_app["oxd_config"]["port"] = data["oxd_config"]["port"]
                should_modify = True

            if not should_modify:
                return

            if self.backend_type == "ldap":
                conf_app = json.dumps(conf_app)
            attrs = {"oxConfApplication": conf_app}
            self.backend.modify_entry(config.id, attrs, **{"bucket": "gluu"})
