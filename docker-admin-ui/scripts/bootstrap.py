import os


from jans.pycloudlib import get_manager


def render_env(manager):
    hostname = manager.config.get("hostname")
    ctx = {
        # "base_path": os.environ.get("CN_ADMIN_API_BASE_PATH", "/admin"),
        "config_api_base_url": f"https://{hostname}",
        "api_base_url": f"https://{hostname}/jans-config-api/admin-ui",
    }

    with open("/app/templates/env.tmpl") as fr:
        txt = fr.read() % ctx

    with open("/opt/jans/gluu-admin-ui/.env", "w") as fw:
        fw.write(txt)


def render_nginx_conf(manager):
    with open("/app/templates/nginx-default.conf.tmpl") as fr:
        ctx = {
            "hostname": manager.config.get("hostname"),
        }
        txt = fr.read() % ctx

    with open("/etc/nginx/conf.d/default.conf", "w") as fw:
        fw.write(txt)


def main():
    manager = get_manager()

    if not os.path.isfile("/etc/certs/web_https.crt"):
        manager.secret.to_file("ssl_cert", "/etc/certs/web_https.crt")

    if not os.path.isfile("/etc/certs/web_https.key"):
        manager.secret.to_file("ssl_key", "/etc/certs/web_https.key")

    render_env(manager)
    render_nginx_conf(manager)


if __name__ == "__main__":
    main()
