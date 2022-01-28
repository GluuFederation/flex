FROM nginx:1.20.1-alpine

# ======
# alpine
# ======

RUN apk update \
    && apk add --no-cache tini openssl py3-pip py3-cryptography py3-grpcio py3-psycopg2 npm \
    && apk add --no-cache --virtual build-deps git openjdk11-jre-headless

# =====
# nginx
# =====

RUN mkdir -p /etc/certs
RUN openssl dhparam -out /etc/certs/dhparams.pem 2048
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Ports for nginx
# EXPOSE 80
# EXPOSE 443

# ========
# Admin UI
# ========

# TODO:
# - use NODE_ENV=production
# - download build package (not git clone)
ENV ADMIN_UI_VERSION=9bd58087ddda650f009b6e38a33858051ebe5ac9
RUN mkdir -p /opt/jans \
    && cd /opt/jans \
    && git clone https://github.com/GluuFederation/gluu-admin-ui \
    && cd gluu-admin-ui \
    && git checkout ${ADMIN_UI_VERSION} \
    && npm install @openapitools/openapi-generator-cli \
    && npm run api \
    && npm install \
    && rm -rf $HOME/.npm

# ======
# Python
# ======

COPY requirements.txt /app/requirements.txt
RUN pip3 install -U pip wheel \
    && pip3 install --no-cache-dir -r /app/requirements.txt

# =======
# Cleanup
# =======

RUN apk del build-deps \
    && rm -rf /var/cache/apk/*

# =======
# License
# =======

RUN mkdir -p /licenses
COPY LICENSE /licenses/

# ==========
# Config ENV
# ==========

ENV CN_CONFIG_ADAPTER=consul \
    CN_CONFIG_CONSUL_HOST=localhost \
    CN_CONFIG_CONSUL_PORT=8500 \
    CN_CONFIG_CONSUL_CONSISTENCY=stale \
    CN_CONFIG_CONSUL_SCHEME=http \
    CN_CONFIG_CONSUL_VERIFY=false \
    CN_CONFIG_CONSUL_CACERT_FILE=/etc/certs/consul_ca.crt \
    CN_CONFIG_CONSUL_CERT_FILE=/etc/certs/consul_client.crt \
    CN_CONFIG_CONSUL_KEY_FILE=/etc/certs/consul_client.key \
    CN_CONFIG_CONSUL_TOKEN_FILE=/etc/certs/consul_token \
    CN_CONFIG_CONSUL_NAMESPACE=jans \
    CN_CONFIG_KUBERNETES_NAMESPACE=default \
    CN_CONFIG_KUBERNETES_CONFIGMAP=jans \
    CN_CONFIG_KUBERNETES_USE_KUBE_CONFIG=false \
    CN_CONFIG_GOOGLE_SECRET_VERSION_ID=latest \
    CN_CONFIG_GOOGLE_SECRET_NAME_PREFIX=jans

# ==========
# Secret ENV
# ==========

ENV CN_SECRET_ADAPTER=vault \
    CN_SECRET_VAULT_SCHEME=http \
    CN_SECRET_VAULT_HOST=localhost \
    CN_SECRET_VAULT_PORT=8200 \
    CN_SECRET_VAULT_VERIFY=false \
    CN_SECRET_VAULT_ROLE_ID_FILE=/etc/certs/vault_role_id \
    CN_SECRET_VAULT_SECRET_ID_FILE=/etc/certs/vault_secret_id \
    CN_SECRET_VAULT_CERT_FILE=/etc/certs/vault_client.crt \
    CN_SECRET_VAULT_KEY_FILE=/etc/certs/vault_client.key \
    CN_SECRET_VAULT_CACERT_FILE=/etc/certs/vault_ca.crt \
    CN_SECRET_VAULT_NAMESPACE=jans \
    CN_SECRET_KUBERNETES_NAMESPACE=default \
    CN_SECRET_KUBERNETES_SECRET=jans \
    CN_SECRET_KUBERNETES_USE_KUBE_CONFIG=false \
    CN_SECRET_GOOGLE_SECRET_MANAGER_PASSPHRASE=secret \
    CN_SECRET_GOOGLE_SECRET_VERSION_ID=latest \
    CN_SECRET_GOOGLE_SECRET_NAME_PREFIX=jans

# ===========
# Generic ENV
# ===========

ENV CN_WAIT_MAX_TIME=300 \
    CN_WAIT_SLEEP_DURATION=10



# ==========
# misc stuff
# ==========
EXPOSE 8080
LABEL name="Gluu Admin UI" \
    maintainer="Gluu Inc. <support@gluu.org>" \
    vendor="Gluu Federation" \
    version="1.0.0" \
    release="dev" \
    summary="Gluu Admin UI" \
    description=""

COPY templates /app/templates/
COPY scripts /app/scripts/
RUN chmod +x /app/scripts/entrypoint.sh
# # create non-root user
RUN adduser -s /bin/sh -D -G root -u 1000 web

# make empty folders
RUN mkdir -p /opt/jans/gluu-admin-ui/dist \
    && touch /var/run/nginx.pid

# adjust ownership
RUN chgrp -R 0 /etc/certs && chmod -R g=u /etc/certs \
    && chgrp -R 0 /opt/jans/gluu-admin-ui/.env && chmod -R g=u /opt/jans/gluu-admin-ui/.env \
    && chgrp -R 0 /opt/jans/gluu-admin-ui/dist && chmod -R g=u /opt/jans/gluu-admin-ui/dist \
    && chgrp -R 0 /etc/nginx/conf.d/default.conf && chmod -R g=u /etc/nginx/conf.d/default.conf \
    && chgrp -R 0 /usr/share/nginx/html && chmod -R g=u /usr/share/nginx/html \
    && chgrp -R 0 /var/cache/nginx && chmod -R g=u /var/cache/nginx \
    && chgrp -R 0 /var/run/nginx.pid && chmod -R g=u /var/run/nginx.pid

USER 1000
ENTRYPOINT ["tini", "-g", "--", "sh", "/app/scripts/entrypoint.sh"]
