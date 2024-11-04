FROM alpine:3.20@sha256:beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d

# ======
# alpine
# ======

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache tini openssl python3 py3-cryptography py3-psycopg2 nginx py3-grpcio curl \
    && apk add --no-cache --virtual .build-deps git

# =====
# nginx
# =====

# Ports for nginx
EXPOSE 8080

# ===========
# Assets sync
# ===========

ENV JANS_SOURCE_VERSION=4f155cfe9e197b15d65be6aa938276862fe36a06
ARG JANS_SETUP_DIR=jans-linux-setup/jans_setup

# note that as we're pulling from a monorepo (with multiple project in it)
# we are using partial-clone and sparse-checkout to get the assets
RUN git clone --depth 500 --filter blob:none --no-checkout https://github.com/janssenproject/jans /tmp/jans \
    && cd /tmp/jans \
    && git sparse-checkout init --cone \
    && git checkout ${JANS_SOURCE_VERSION} \
    && git sparse-checkout add ${JANS_SETUP_DIR} \
    && git sparse-checkout add jans-pycloudlib

RUN mkdir -p /app/static/rdbm /app/schema

# sync static files from linux-setup
RUN cd /tmp/jans \
    && cp -R ${JANS_SETUP_DIR}/static/rdbm/sql_data_types.json /app/static/rdbm/ \
    && cp -R ${JANS_SETUP_DIR}/static/rdbm/ldap_sql_data_type_mapping.json /app/static/rdbm/ \
    && cp -R ${JANS_SETUP_DIR}/static/rdbm/opendj_attributes_syntax.json /app/static/rdbm/ \
    && cp -R ${JANS_SETUP_DIR}/static/rdbm/sub_tables.json /app/static/rdbm/ \
    && cp ${JANS_SETUP_DIR}/schema/jans_schema.json /app/schema/ \
    && cp ${JANS_SETUP_DIR}/schema/custom_schema.json /app/schema/ \
    && cp ${JANS_SETUP_DIR}/schema/opendj_types.json /app/schema/

ENV FLEX_SOURCE_VERSION=b9628dc3e63e093e0ac0a5dd7e9295251587ac3d

RUN mkdir -p /app/templates/admin-ui

 RUN git clone --depth 500 --filter blob:none --no-checkout https://github.com/GluuFederation/flex /tmp/flex \
     && cd /tmp/flex \
     && git sparse-checkout init --cone \
     && git checkout ${FLEX_SOURCE_VERSION} \
     && git sparse-checkout add admin-ui \
     && git sparse-checkout add flex-linux-setup/flex_linux_setup/templates \
     && cp flex-linux-setup/flex_linux_setup/templates/aui_webhook.ldif /app/templates/admin-ui

# ========
# Admin UI
# ========

ENV ADMIN_UI_VERSION=main
ENV GLUU_BUILD_DATE='2024-07-10 06:40'

RUN wget -q https://jenkins.gluu.org/npm/admin_ui/${ADMIN_UI_VERSION}/built/admin-ui-${ADMIN_UI_VERSION}-built.tar.gz -O /tmp/admin-ui.tar.gz \
    && mkdir -p /opt/flex/admin-ui \
    && tar xvf /tmp/admin-ui.tar.gz -C /opt/flex/admin-ui \
    && rm -rf /tmp/admin-ui.tar.gz

# ======
# Python
# ======

COPY requirements.txt /app/requirements.txt
RUN mv /usr/lib/python3.12/EXTERNALLY-MANAGED /usr/lib/python3.12/EXTERNALLY-MANAGED.disabled \
    && python3 -m ensurepip \
    && pip3 install --no-cache-dir -U pip wheel setuptools \
    && pip3 install --no-cache-dir -r /app/requirements.txt \
    && pip3 uninstall -y pip wheel

# =======
# Cleanup
# =======

RUN apk del .build-deps \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/jans \
    && rm -rf /tmp/flex

# =======
# License
# =======

COPY LICENSE /licenses/LICENSE

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
    CN_CONFIG_KUBERNETES_USE_KUBE_CONFIG=false

# ==========
# Secret ENV
# ==========

ENV CN_SECRET_ADAPTER=vault \
    CN_SECRET_VAULT_VERIFY=false \
    CN_SECRET_VAULT_ROLE_ID_FILE=/etc/certs/vault_role_id \
    CN_SECRET_VAULT_SECRET_ID_FILE=/etc/certs/vault_secret_id \
    CN_SECRET_VAULT_CERT_FILE=/etc/certs/vault_client.crt \
    CN_SECRET_VAULT_KEY_FILE=/etc/certs/vault_client.key \
    CN_SECRET_VAULT_CACERT_FILE=/etc/certs/vault_ca.crt \
    CN_SECRET_VAULT_NAMESPACE="" \
    CN_SECRET_VAULT_ADDR=http://localhost:8200 \
    CN_SECRET_VAULT_KV_PATH=secret \
    CN_SECRET_VAULT_PREFIX=jans \
    CN_SECRET_VAULT_APPROLE_PATH=approle \
    CN_SECRET_KUBERNETES_NAMESPACE=default \
    CN_SECRET_KUBERNETES_SECRET=jans \
    CN_SECRET_KUBERNETES_USE_KUBE_CONFIG=false

# ===============
# Persistence ENV
# ===============

ENV CN_PERSISTENCE_TYPE=sql \
    CN_HYBRID_MAPPING="{}" \
    CN_COUCHBASE_URL=localhost \
    CN_COUCHBASE_USER=admin \
    CN_COUCHBASE_CERT_FILE=/etc/certs/couchbase.crt \
    CN_COUCHBASE_CONN_TIMEOUT=10000 \
    CN_COUCHBASE_CONN_MAX_WAIT=20000 \
    CN_COUCHBASE_SCAN_CONSISTENCY=not_bounded \
    CN_COUCHBASE_BUCKET_PREFIX=jans \
    CN_COUCHBASE_TRUSTSTORE_ENABLE=true \
    CN_COUCHBASE_KEEPALIVE_INTERVAL=30000 \
    CN_COUCHBASE_KEEPALIVE_TIMEOUT=2500 \
    CN_GOOGLE_SPANNER_INSTANCE_ID="" \
    CN_GOOGLE_SPANNER_DATABASE_ID=""

# ===========
# Generic ENV
# ===========

ENV CN_WAIT_MAX_TIME=300 \
    CN_WAIT_SLEEP_DURATION=10 \
    GOOGLE_PROJECT_ID="" \
    CN_GOOGLE_SECRET_MANAGER_PASSPHRASE=secret \
    CN_GOOGLE_SECRET_VERSION_ID=latest \
    CN_GOOGLE_SECRET_NAME_PREFIX=jans \
    GLUU_ADMIN_UI_PUBLIC_DIR=/var/lib/nginx/html/admin \
    GLUU_ADMIN_UI_ENABLE_NGINX=true

# ==========
# misc stuff
# ==========

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/admin-ui" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="5.1.6" \
    org.opencontainers.image.title="Gluu Flex Admin UI" \
    org.opencontainers.image.description=""

RUN mkdir -p /etc/jans/conf /etc/certs /var/lib/nginx/html/admin
COPY templates /app/templates/
COPY scripts /app/scripts/
RUN chmod +x /app/scripts/entrypoint.sh

# forward logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

RUN cp /app/templates/admin-ui/nginx-default.conf /etc/nginx/http.d/default.conf \
    && touch /run/nginx/nginx.pid


# create non-root user
RUN adduser -s /bin/sh -h /home/1000 -D -G root -u 1000 1000

# @TODO: re-enable plugins once upstream admin-ui supports modular plugin
# && chown 1000:0 /opt/flex/admin-ui/.env \
# && chown -R 1000:0 /opt/flex/admin-ui/_plugins \
# && chown 1000:0 /opt/flex/admin-ui/plugins.config.json \
# && chown -R 1000:0 /opt/flex/admin-ui/plugins

# adjust ownership
RUN chown -R 1000:0 /var/lib/nginx \
    && chown 1000:0 /run/nginx/nginx.pid \
    && chown 1000:0 /etc/nginx/http.d/default.conf \
    && chown -R 1000:0 /var/lib/nginx \
    && chown -R 1000:0 /var/log/nginx \
    && chown -R 1000:0 /etc/jans \
    && chown -R 1000:0 /etc/certs \
    && chown 1000:0 /run/nginx/nginx.pid \
    && chown -R 1000:0 /opt/flex/admin-ui

USER 1000

RUN mkdir -p $HOME/.config/gcloud

ENTRYPOINT ["tini", "-g", "--"]
CMD ["sh", "/app/scripts/entrypoint.sh"]
