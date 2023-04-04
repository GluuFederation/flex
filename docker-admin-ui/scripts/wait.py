import logging.config
import os

from jans.pycloudlib import get_manager
from jans.pycloudlib import wait_for
from jans.pycloudlib import wait_for_persistence
from jans.pycloudlib.validators import validate_persistence_type
from jans.pycloudlib.validators import validate_persistence_hybrid_mapping
from jans.pycloudlib.validators import validate_persistence_sql_dialect

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)


def main():
    persistence_type = os.environ.get("CN_PERSISTENCE_TYPE", "ldap")
    validate_persistence_type(persistence_type)

    if persistence_type == "hybrid":
        validate_persistence_hybrid_mapping()

    if persistence_type == "sql":
        sql_dialect = os.environ.get("CN_SQL_DB_DIALECT", "mysql")
        validate_persistence_sql_dialect(sql_dialect)

    auth_method = os.environ.get("GLUU_ADMIN_UI_AUTH_METHOD", "basic")
    if auth_method not in ("basic", "casa"):
        raise ValueError(f"Unsupported authentication method {auth_method}")

    ssa_file = os.environ.get("GLUU_SSA_FILE", "/etc/jans/conf/ssa")
    if not os.path.exists(ssa_file):
        raise ValueError(
            f"The required SSA file is not found (default to {ssa_file}); "
            "please set the location via GLUU_SSA_FILE environment variable "
            "if not using the default"
        )

    manager = get_manager()
    deps = ["config", "secret"]
    wait_for(manager, deps)
    wait_for_persistence(manager)


if __name__ == "__main__":
    main()
