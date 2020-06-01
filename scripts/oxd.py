import os
from urllib.parse import urlparse

from pygluu.containerlib.utils import get_server_certificate


def resolve_oxd_url(url):
    result = urlparse(url)
    scheme = result.scheme or "https"
    host_port = result.netloc or result.path
    host = host_port.split(":")[0]
    port = int(host_port.split(":")[-1])
    return scheme, host, port


def get_oxd_cert():
    oxd_url = os.environ.get("GLUU_OXD_SERVER_URL", "localhost:8443")
    _, host, port = resolve_oxd_url(oxd_url)

    if not os.path.isfile("/etc/certs/oxd.crt"):
        get_server_certificate(host, port, "/etc/certs/oxd.crt")
