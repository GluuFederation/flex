import json
import logging.config
import os
import uuid

import requests
from jwcrypto.jwt import JWT

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("entrypoint")


def register_license_client(ssa, reg_url, org_id, redirect_uri):
    data = {
        "software_statement": ssa,
        "client_name": f"Admin UI Client {org_id}",
        "response_types": ["token"],
        "redirect_uris": [redirect_uri],
    }

    logger.info(f"Registering license client at {reg_url}")

    req = requests.post(
        reg_url,
        json=data,
        # TODO: configurable verification
        verify=False,  # nosec: B501
    )

    if not req.ok:
        raise RuntimeError(
            f"Failed to register client at {req.request.url}; "
            f"reason={req.reason} status_code={req.status_code} err={req.json()}"
        )
    return req.json()


def get_license_client_creds(manager):
    # used mostly for testing on fresh deployment to re-use license client ID thus client registration will be skipped
    # in production mode, omit or set empty string to force registering license client (if required)
    client_id = os.environ.get("GLUU_LICENSE_CLIENT_ID", "")
    if client_id:
        logger.warning("Got license client ID from GLUU_LICENSE_CLIENT_ID env which is not suitable for production")
    else:
        client_id = manager.config.get("license_client_id")

    # used mostly for testing on fresh deployment to re-use license client secret
    client_secret = os.environ.get("GLUU_LICENSE_CLIENT_SECRET", "")
    if client_secret:
        logger.warning("Got license client secret from GLUU_LICENSE_CLIENT_SECRET env which is not suitable for production")
    else:
        client_secret = manager.secret.get("license_client_pw")
    return client_id, client_secret


def get_license_config(manager):
    # decode SSA from file
    ssa_file = os.environ.get("GLUU_SSA_FILE", "/etc/jans/conf/ssa")

    with open(ssa_file) as f:
        ssa = f.read().strip()

    jwt = JWT(jwt=ssa)
    payload = json.loads(jwt.token.objects["payload"].decode())

    auth_url = os.environ.get("GLUU_SCAN_AUTH_URL") or payload["iss"]
    reg_url = f"{auth_url}/jans-auth/restv1/register"
    scan_url = os.environ.get("GLUU_SCAN_API_URL") or auth_url.replace("account", "cloud")

    # get license client credentials
    client_id, client_secret = get_license_client_creds(manager)

    if not client_id:
        resp = register_license_client(ssa, reg_url, payload["org_id"], payload["iss"])
        client_id = resp["client_id"]
        client_secret = resp["client_secret"]

        # save client creds
        manager.config.set("license_client_id", client_id)
        manager.secret.set("license_client_pw", client_secret)

    # hardware key (unique per-installation)
    hw_key = manager.config.get("license_hardware_key")
    if not hw_key:
        hw_key = str(uuid.uuid4())
        manager.config.set("license_hardware_key", hw_key)

    return {
        "license_hardware_key": hw_key,
        "oidc_client_id": client_id,
        "oidc_client_secret": client_secret,
        "scan_license_api_hostname": scan_url,
        "scan_license_auth_server_hostname": auth_url,
        "ssa": ssa,
    }
