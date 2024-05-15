import logging.config
import json
import os
import shutil
import sys

import sh

from jans.pycloudlib.utils import exec_cmd

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("admin-ui")

ADMIN_UI_DIR = "/opt/flex/admin-ui"


def _emit_to_log(line, stdin, process):
    line = line.strip().replace("\n", "")
    if line:
        logger.info(line)


def _discover_plugins():
    os.chdir(ADMIN_UI_DIR)

    user_plugins = [
        plugin.strip()
        for plugin in os.environ.get("GLUU_ADMIN_UI_PLUGINS", "").strip().split(",")
        if plugin.strip()
    ]

    for plugin in set(user_plugins):
        src = f"/opt/flex/admin-ui/_plugins/{plugin}.zip"

        if not os.path.isfile(src):
            continue

        logger.info(f"Adding plugin {plugin} from {src}")
        cmd = f"npm run plugin:add {src}"
        out, err, code = exec_cmd(cmd)

        if code != 0:
            sys.exit(err.decode())
        logger.info(out.decode())

    with open(os.path.join(ADMIN_UI_DIR, "plugins.config.json")) as f:
        return [plug["key"] for plug in json.loads(f.read())]


def _build_src() -> None:
    logger.info("Building admin-ui app ...")
    public_dir = os.environ.get("GLUU_ADMIN_UI_PUBLIC_DIR", "/var/lib/nginx/html")

    os.chdir(ADMIN_UI_DIR)

    try:
        proc = sh.npm("run", "build:prod", _out=_emit_to_log, _bg=True)
        proc.wait()
    except sh.SignalException_SIGKILL:
        logger.warning("Process is killed")

    if proc.exit_code != 0:
        sys.exit("Unable to build admin-ui app")
        # sys.exit(proc.exit_code)

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
