import logging
import logging.config
import os
import sys

from pygluu.containerlib import get_manager
from pygluu.containerlib import wait_for
from pygluu.containerlib import PERSISTENCE_LDAP_MAPPINGS
from pygluu.containerlib import PERSISTENCE_TYPES

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("wait")


def main():
    persistence_type = os.environ.get("GLUU_PERSISTENCE_TYPE", "ldap")
    ldap_mapping = os.environ.get("GLUU_PERSISTENCE_LDAP_MAPPING", "default")

    if persistence_type not in PERSISTENCE_TYPES:
        logger.error(
            "Unsupported GLUU_PERSISTENCE_TYPE value; "
            "please choose one of {}".format(", ".join(PERSISTENCE_TYPES))
        )
        sys.exit(1)

    if persistence_type == "hybrid" and ldap_mapping not in PERSISTENCE_LDAP_MAPPINGS:
        logger.error(
            "Unsupported GLUU_PERSISTENCE_LDAP_MAPPING value; "
            "please choose one of {}".format(", ".join(PERSISTENCE_LDAP_MAPPINGS))
        )
        sys.exit(1)

    manager = get_manager()
    deps = ["config", "secret"]

    if persistence_type == "hybrid":
        deps += ["ldap", "couchbase"]
    else:
        deps.append(persistence_type)

    deps.append("oxauth")
    wait_for(manager, deps)


if __name__ == "__main__":
    main()
