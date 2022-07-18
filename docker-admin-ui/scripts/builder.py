import logging.config
import json
import os
import shutil
import sys

from jans.pycloudlib.utils import exec_cmd

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("entrypoint")

ADMIN_UI_DIR = "/opt/flex/admin-ui"


def _discover_plugins():
    os.chdir(ADMIN_UI_DIR)

    user_plugins = [
        plugin.strip()
        for plugin in os.environ.get("GLUU_ADMIN_UI_PLUGINS", "").strip().split(",")
        if plugin.strip()
    ]

    for plugin in set(user_plugins):
        src = f"/app/plugins/{plugin}.zip"

        if not os.path.isfile(src):
            continue

        logger.info(f"Adding plugin {plugin} from {src}")
        cmd = f"npm run plugin:add {src}"
        out, err, code = exec_cmd(cmd)

        if code != 0:
            sys.exit(err.decode())
        logger.info(out.decode())

    with open(os.path.join(ADMIN_UI_DIR, "plugins.config.json")) as f:
        loaded_plugins = [plug["key"] for plug in json.loads(f.read())]
    return loaded_plugins


def _build_src() -> None:
    logger.info("Building admin-ui app ...")
    public_dir = "/var/lib/nginx/html"

    os.chdir(ADMIN_UI_DIR)

    cmd = "npm run build:prod"
    out, err, code = exec_cmd(cmd)

    if code != 0:
        sys.exit(err.decode())

    logger.info(out.decode())
    shutil.copytree(
        os.path.join(ADMIN_UI_DIR, "dist"),
        public_dir,
        dirs_exist_ok=True,
    )
    logger.info("Finished building admin-ui app")


def main() -> None:
    loaded_plugins = _discover_plugins()
    _build_src()
    logger.info(f"Loaded plugins: {', '.join(loaded_plugins)}")


if __name__ == "__main__":
    main()
