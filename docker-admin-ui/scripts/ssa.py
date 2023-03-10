import json
import logging.config
import os
import tempfile
import uuid

import requests
from jwcrypto.jwt import JWT

from jans.pycloudlib.utils import exec_cmd
from jans.pycloudlib.utils import generate_base64_contents

from settings import LOGGING_CONFIG

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("entrypoint")


def register_license_client(ssa, reg_url):
    data = {
        "software_statement": ssa,
        "client_name": "Gluu Flex License Client",
        "response_types": ["token"],
        "redirect_uris": ["http://localhost"],
    }

    logger.info(f"Registering license client at {reg_url}")

    req = requests.post(
        reg_url,
        json=data,
        # TODO: configurable verification
        verify=False,  # nosec: B501
    )

    if not req.ok:
        # FIXME: remote URL is throwing 422 Unprocessable entity
        raise RuntimeError(f"Failed to register client at {req.request.url}; reason={req.reason} status_code={req.status_code}")
    return req.json()


def get_enc_keys():
    logger.info("Generating public and private keys for license")

    with tempfile.TemporaryDirectory() as tmpdir:
        priv_fn = os.path.join(tmpdir, "private.pem")
        privkey_fn = os.path.join(tmpdir, "private_key.pem")
        pubkey_fn = os.path.join(tmpdir, "public_key.pem")

        cmds = [
            f"openssl genrsa -out {priv_fn} 2048",
            f"openssl rsa -in {priv_fn} -pubout -outform PEM -out {pubkey_fn}",
            f"openssl pkcs8 -topk8 -inform PEM -in {priv_fn} -out {privkey_fn} -nocrypt",
        ]

        for cmd in cmds:
            out, err, code = exec_cmd(cmd)

            if code != 0:
                err = err or out
                raise RuntimeError("Unable to generate encode/decode keys for license; reason={err.decode()}")

        with open(pubkey_fn) as f:
            enc_pub_key = generate_base64_contents(f.read(), 0)

        with open(privkey_fn) as f:
            enc_priv_key = generate_base64_contents(f.read(), 0)
        return enc_pub_key, enc_priv_key


def get_license_client_creds(manager):
    client_id = os.environ.get("GLUU_LICENSE_CLIENT_ID", "")
    if client_id:
        logger.warning("Got license client ID from GLUU_LICENSE_CLIENT_ID env which is not suitable for production")
    else:
        client_id = manager.config.get("license_client_id")

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
        resp = register_license_client(ssa, reg_url)
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

    enc_pub_key = manager.secret.get("license_enc_pub_key")
    enc_priv_key = manager.secret.get("license_enc_priv_key")

    if not (enc_pub_key or enc_priv_key):
        enc_pub_key, enc_priv_key = get_enc_keys()
        manager.secret.set("license_enc_pub_key", enc_pub_key)
        manager.secret.set("license_enc_priv_key", enc_priv_key)

    return {
        "cred_enc_public_key": enc_pub_key,
        "cred_enc_private_key": enc_priv_key,
        "license_hardware_key": hw_key,
        "oidc_client_id": client_id,
        "oidc_client_secret": client_secret,
        "scan_license_api_hostname": scan_url,
        "scan_license_auth_server_hostname": auth_url,
    }
