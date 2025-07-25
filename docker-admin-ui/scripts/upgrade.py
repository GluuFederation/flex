import json
import logging.config
from collections import namedtuple

from jans.pycloudlib import get_manager
from jans.pycloudlib.persistence import SqlClient
from jans.pycloudlib.persistence import PersistenceMapper
from jans.pycloudlib.persistence import doc_id_from_dn
from jans.pycloudlib.utils import as_boolean

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("admin-ui")

Entry = namedtuple("Entry", ["id", "attrs"])


class SQLBackend:
    def __init__(self, manager):
        self.manager = manager
        self.client = SqlClient(manager)
        self.type = "sql"

    def get_entry(self, key, filter_="", attrs=None, **kwargs):
        table_name = kwargs.get("table_name")
        entry = self.client.get(table_name, key, attrs)

        if not entry:
            return None
        return Entry(key, entry)

    def modify_entry(self, key, attrs=None, **kwargs):
        attrs = attrs or {}
        table_name = kwargs.get("table_name")
        return self.client.update(table_name, key, attrs), ""


BACKEND_CLASSES = {
    "sql": SQLBackend,
}


class Upgrade:
    def __init__(self, manager):
        self.manager = manager

        mapper = PersistenceMapper()

        backend_cls = BACKEND_CLASSES[mapper.mapping["default"]]
        self.backend = backend_cls(manager)

    def invoke(self):
        logger.info("Running upgrade process (if required)")
        self.update_web_client()
        self.update_backend_client()

    def update_web_client(self):
        kwargs = {"table_name": "jansClnt"}
        client_id = self.manager.config.get("admin_ui_client_id")
        id_ = doc_id_from_dn(f"inum={client_id},ou=clients,o=jans")

        entry = self.backend.get_entry(id_, **kwargs)

        if not entry:
            return

        should_update = False

        # jansAccessTknAsJwt is set to true since v5.9.0
        if not as_boolean(entry.attrs["jansAccessTknAsJwt"]):
            entry.attrs["jansAccessTknAsJwt"] = True
            should_update = True

        if not self.backend.client.use_simple_json:
            scopes = entry.attrs["jansScope"]["v"]
            grant_types = entry.attrs["jansGrantTyp"]["v"]
        else:
            scopes = entry.attrs.get("jansScope") or []
            grant_types = entry.attrs.get("jansGrantTyp") or []

        # update jansScope
        if not isinstance(scopes, list):
            scopes = [scopes]

        for scope in [
            "inum=F0C4,ou=scopes,o=jans",  # openid
            "inum=B9D2-D6E5,ou=scopes,o=jans",  # https://jans.io/auth/ssa.admin
            "inum=764C,ou=scopes,o=jans",  # email
            "inum=43F1,ou=scopes,o=jans",  # profile
            "inum=C4F6,ou=scopes,o=jans",  # offline_access
            "inum=C4F7,ou=scopes,o=jans",  # jans_stat
        ]:
            if scope not in scopes:
                scopes.append(scope)
                should_update = True

        # invalid scopes should be removed
        for scope in [
            "inum=6D90,ou=scopes,o=jans",
        ]:
            if scope in scopes:
                scopes.remove("inum=6D90,ou=scopes,o=jans")
                should_update = True

        # update jansGrantTyp
        if not isinstance(grant_types, list):
            grant_types = [grant_types]

        if "urn:ietf:params:oauth:grant-type:device_code" not in grant_types:
            grant_types.append("urn:ietf:params:oauth:grant-type:device_code")
            should_update = True

        if not self.backend.client.use_simple_json:
            entry.attrs["jansScope"]["v"] = scopes
            entry.attrs["jansGrantTyp"]["v"] = grant_types
        else:
            entry.attrs["jansScope"] = scopes
            entry.attrs["jansGrantTyp"] = grant_types

        # update jansAttrs
        try:
            attrs = json.loads(entry.attrs["jansAttrs"])
        except TypeError:
            attrs = entry.attrs["jansAttrs"]
        finally:
            if "updateTokenScriptDns" not in attrs:
                attrs["updateTokenScriptDns"] = []
                should_update = True
            entry.attrs["jansAttrs"] = json.dumps(attrs)

        if should_update:
            self.backend.modify_entry(entry.id, entry.attrs, **kwargs)

    def update_backend_client(self):
        kwargs = {"table_name": "jansClnt"}
        client_id = self.manager.config.get("token_server_admin_ui_client_id")
        id_ = doc_id_from_dn(f"inum={client_id},ou=clients,o=jans")

        entry = self.backend.get_entry(id_, **kwargs)

        if not entry:
            return

        should_update = False

        # set attributes to False
        for attr in ["jansAccessTknAsJwt", "jansTrustedClnt"]:
            if as_boolean(entry.attrs[attr]):
                entry.attrs[attr] = False
                should_update = True

        if not self.backend.client.use_simple_json:
            scopes = entry.attrs["jansScope"]["v"]
            grant_types = entry.attrs["jansGrantTyp"]["v"]
            resp_types = entry.attrs["jansRespTyp"]["v"]
        else:
            scopes = entry.attrs.get("jansScope") or []
            grant_types = entry.attrs.get("jansGrantTyp") or []
            resp_types = entry.attrs.get("jansRespTyp") or []

        # update jansScope
        if not isinstance(scopes, list):
            scopes = [scopes]

        for scope in [
            "inum=F0C4,ou=scopes,o=jans",  # openid
            "inum=B9D2-D6E5,ou=scopes,o=jans",  # https://jans.io/auth/ssa.admin
        ]:
            if scope not in scopes:
                scopes.append(scope)
                should_update = True

        # invalid scopes should be removed
        for scope in [
            "inum=43F1,ou=scopes,o=jans",  # profile
            "inum=6D90,ou=scopes,o=jans",
            "inum=764C,ou=scopes,o=jans",  # email
        ]:
            if scope in scopes:
                scopes.remove(scope)
                should_update = True

        # update jansGrantTyp
        if not isinstance(grant_types, list):
            grant_types = [grant_types]

        for grant_type in ["authorization_code", "refresh_token"]:
            if grant_type not in grant_types:
                continue
            grant_types.remove(grant_type)
            should_update = True

        # update jansRespTyp
        if not isinstance(resp_types, list):
            resp_types = [resp_types]

        if "code" in resp_types:
            resp_types.remove("code")
            should_update = True

        if "token" not in resp_types:
            resp_types.append("token")
            should_update = True

        # add SSA admin scope
        if "inum=B9D2-D6E5,ou=scopes,o=jans" not in scopes:
            scopes.append("inum=B9D2-D6E5,ou=scopes,o=jans")
            should_update = True

        if not self.backend.client.use_simple_json:
            entry.attrs["jansScope"]["v"] = scopes
            entry.attrs["jansGrantTyp"]["v"] = grant_types
            entry.attrs["jansRespTyp"]["v"] = resp_types
        else:
            entry.attrs["jansScope"] = scopes
            entry.attrs["jansGrantTyp"] = grant_types
            entry.attrs["jansRespTyp"] = resp_types

        # use token reference
        try:
            attrs = json.loads(entry.attrs["jansAttrs"])
        except TypeError:
            attrs = entry.attrs["jansAttrs"]
        finally:
            if attrs["runIntrospectionScriptBeforeJwtCreation"] is True:
                attrs["runIntrospectionScriptBeforeJwtCreation"] = False
                should_update = True
            if "updateTokenScriptDns" not in attrs or "inum=2D3E.5A04,ou=scripts,o=jans" not in attrs["updateTokenScriptDns"]:
                attrs["updateTokenScriptDns"] = ["inum=2D3E.5A04,ou=scripts,o=jans"]
                should_update = True
            if "inum=A44E-4F3D,ou=scripts,o=jans" in attrs["introspectionScripts"]:
                attrs["introspectionScripts"].remove("inum=A44E-4F3D,ou=scripts,o=jans")
                should_update = True
            entry.attrs["jansAttrs"] = json.dumps(attrs)

        if should_update:
            self.backend.modify_entry(entry.id, entry.attrs, **kwargs)


def main():
    manager = get_manager()

    with manager.create_lock("admin-ui-upgrade"):
        upgrade = Upgrade(manager)
        upgrade.invoke()


if __name__ == "__main__":
    main()
