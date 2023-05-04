from kubernetes import config, client
import logging

log_format = '%(asctime)s - %(name)8s - %(levelname)5s - %(message)s'
logging.basicConfig(format=log_format, level=logging.INFO)
logger = logging.getLogger("tls-generator")
# use the serviceAccount k8s gives to pods
config.load_incluster_config()
core_cli = client.CoreV1Api()


def patch_or_create_namespaced_secret(name, literal, value_of_literal, namespace="default",
                                      secret_type="Opaque", second_literal=None, value_of_second_literal=None,
                                      data=None):
    """Patch secret and if not exist create
    :param name:
    :param literal:
    :param value_of_literal:
    :param namespace:
    :param secret_type:
    :param second_literal:
    :param value_of_second_literal:
    :param data:
    :return:
    """
    # Instantiate the Secret object
    body = client.V1Secret()
    metadata = client.V1ObjectMeta(name=name)
    body.data = data
    if not data:
        body.data = {literal: value_of_literal}
    body.metadata = metadata
    body.type = secret_type
    if second_literal:
        body.data = {literal: value_of_literal, second_literal: value_of_second_literal}
    try:
        core_cli.patch_namespaced_secret(name, namespace, body)
        logger.info('Secret  {} in namespace {} has been patched'.format(name, namespace))
        return
    except client.rest.ApiException as e:
        if e.status == 404 or not e.status:
            try:
                core_cli.create_namespaced_secret(namespace=namespace, body=body)
                logger.info('Created secret {} of type {} in namespace {}'.format(name, secret_type, namespace))
                return True
            except client.rest.ApiException as e:
                logger.exception(e)
                return False
        logger.exception(e)
        return False


# check if gluu secret exists
def get_certs(secret_name, namespace):
    """
    :param namespace:
    :return:  ssl cert and key from gluu secrets
    """
    ssl_cert = None
    ssl_key = None
    if core_cli.read_namespaced_secret(secret_name, namespace):
        ssl_cert = core_cli.read_namespaced_secret(secret_name, namespace).data['ssl_cert']
        ssl_key = core_cli.read_namespaced_secret(secret_name, namespace).data['ssl_key']
    return ssl_cert, ssl_key


def main():
    namespace = "${namespace}"
    secret_name = "${secret_name}"
    cert, key = get_certs(secret_name, namespace)
    # global vars
    name = "tls-certificate"
    # if istio is enabled
    # {{- if.Values.global.istio.ingress}}
    # namespace = {{.Values.global.istio.namespace | quote}}
    # {{- end}}
    if cert and key:
        patch_or_create_namespaced_secret(name=name,
                                          namespace=namespace,
                                          literal="tls.crt",
                                          value_of_literal=cert,
                                          secret_type="kubernetes.io/tls",
                                          second_literal="tls.key",
                                          value_of_second_literal=key)
    else:
        logger.error("No certificate or key was found in secrets.")


if __name__ == "__main__":
    main()
