import os

import six.moves

from pygluu.containerlib.utils import get_server_certificate


def resolve_oxd_url(url):
    result = six.moves.urllib_parse.urlparse(url)
    scheme = result.scheme or "https"
    host = result.hostname or result.path.split(":")[0]
    port = result.port or int(result.path.split(":")[-1])
    return scheme, host, port


def get_oxd_cert():
    oxd_url = os.environ.get("GLUU_OXD_SERVER_URL", "localhost:8443")
    _, host, port = resolve_oxd_url(oxd_url)

    if not os.path.isfile("/etc/certs/oxd.crt"):
        get_server_certificate(host, port, "/etc/certs/oxd.crt")
