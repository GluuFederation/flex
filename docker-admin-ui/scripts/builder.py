import logging.config
import os
import shutil

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("admin-ui")

ADMIN_UI_DIR = "/opt/flex/admin-ui"


def copy_admin_ui_dist():
    src = os.path.join(ADMIN_UI_DIR, "dist")
    dest = os.environ.get("GLUU_ADMIN_UI_PUBLIC_DIR", "/var/lib/nginx/html/admin")
    logger.info(f"Copying admin-ui app from {src} to {dest}")
    shutil.copytree(src, dest, dirs_exist_ok=True)
    logger.info("Finished copying admin-ui app")


def main() -> None:
    copy_admin_ui_dist()


if __name__ == "__main__":
    main()
