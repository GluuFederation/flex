FROM node:fermium-alpine AS builder

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache git openjdk11-jre-headless

# TODO:
# - use NODE_ENV=production
# - download build package (not git clone)
ENV ADMIN_UI_VERSION=5743f86c2802354db396be97b1dc5465d22851c4

# note that as we're pulling from a monorepo (with multiple project in it)
# we are using partial-clone and sparse-checkout to get the admin-ui code
RUN git clone --filter blob:none --no-checkout https://github.com/GluuFederation/flex /tmp/flex \
    && cd /tmp/flex \
    && git sparse-checkout init --cone \
    && git checkout ${ADMIN_UI_VERSION} \
    && git sparse-checkout set admin-ui \
    && mkdir -p /opt/flex \
    && mv /tmp/flex/admin-ui /opt/flex/admin-ui \
    && cd /opt/flex/admin-ui \
    && npm install @openapitools/openapi-generator-cli \
    && npm install openapi-merge-cli \
    && npm run api \
    && npm install \
    && npm uninstall @openapitools/openapi-generator-cli \
    && rm -rf $HOME/.npm

# ===========
# Application
# ===========

FROM node:fermium-alpine

# ======
# alpine
# ======

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache tini openssl python3 py3-cryptography py3-psycopg2 nginx py3-grpcio \
    && apk add --no-cache --virtual .build-deps git

# =====
# nginx
# =====

RUN mkdir -p /etc/certs
# RUN openssl dhparam -out /etc/certs/dhparams.pem 2048
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Ports for nginx
# EXPOSE 80
# EXPOSE 443

# ======
# Python
# ======

COPY requirements.txt /app/requirements.txt
RUN python3 -m ensurepip \
    && pip3 install --no-cache-dir -U pip wheel \
    && pip3 install --no-cache-dir -r /app/requirements.txt \
    && pip3 uninstall -y pip wheel

# =====================
# jans-linux-setup sync
# =====================

ENV JANS_SOURCE_VERSION=d1890e76c13c8c2c3dcdcc0625edd04cf552bbf9
ARG JANS_SETUP_DIR=jans-linux-setup/jans_setup

# note that as we're pulling from a monorepo (with multiple project in it)
# we are using partial-clone and sparse-checkout to get the jans-linux-setup code
RUN git clone --filter blob:none --no-checkout https://github.com/janssenproject/jans /tmp/jans \
    && cd /tmp/jans \
    && git sparse-checkout init --cone \
    && git checkout ${JANS_SOURCE_VERSION} \
    && git sparse-checkout set ${JANS_SETUP_DIR}

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

# ========
# Admin UI
# ========

COPY --from=builder /opt/flex/admin-ui /opt/flex/admin-ui

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

# ===============
# Persistence ENV
# ===============

ENV CN_PERSISTENCE_TYPE=ldap \
    CN_HYBRID_MAPPING="{}" \
    CN_LDAP_URL=localhost:1636 \
    CN_LDAP_USE_SSL=true \
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
    CN_WAIT_SLEEP_DURATION=10

# ==========
# misc stuff
# ==========
EXPOSE 8080
LABEL name="gluufederation/admin-ui" \
    maintainer="Gluu Inc. <support@gluu.org>" \
    vendor="Gluu Federation" \
    version="1.0.1" \
    release="dev" \
    summary="Gluu Admin UI" \
    description=""

COPY templates /app/templates/
COPY scripts /app/scripts/
RUN chmod +x /app/scripts/entrypoint.sh
RUN mkdir -p /etc/jans/conf

# forward logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# add existing node user to root group
RUN addgroup node root

# make empty folders
RUN mkdir -p /opt/flex/admin-ui/dist /app/plugins \
    && touch /run/nginx/nginx.pid

# && chown -R 1000:1000 /etc/certs \
# && chgrp -R 0 /etc/certs && chmod -R g=u /etc/certs \

# adjust ownership
RUN chown -R 1000:1000 /var/lib/nginx \
    && chown 1000:1000 /run/nginx/nginx.pid \
    && chown -R 1000:1000 /opt/flex/admin-ui/.env \
    && chown -R 1000:1000 /opt/flex/admin-ui/dist \
    && chown -R 1000:1000 /etc/nginx/http.d/default.conf \
    && chown -R 1000:1000 /var/lib/nginx \
    && chown -R 1000:1000 /var/log/nginx \
    && chown -R 1000:1000 /etc/jans \
    && chown -R 1000:1000 /run/nginx/nginx.pid \
    && chgrp -R 0 /opt/flex/admin-ui/.env && chmod -R g=u /opt/flex/admin-ui/.env \
    && chgrp -R 0 /opt/flex/admin-ui/dist && chmod -R g=u /opt/flex/admin-ui/dist \
    && chgrp -R 0 /etc/nginx/http.d/default.conf && chmod -R g=u /etc/nginx/http.d/default.conf \
    && chgrp -R 0 /var/lib/nginx && chmod -R g=u /var/lib/nginx \
    && chgrp -R 0 /var/log/nginx && chmod -R g=u /var/log/nginx \
    && chgrp -R 0 /run/nginx/nginx.pid && chmod -R g=u /run/nginx/nginx.pid \
    && chgrp -R 0 /etc/jans && chmod -R g=u /etc/jans \
    && chown 1000:0 /opt/flex/admin-ui/plugins.config.json \
    && chown -R 1000:0 /opt/flex/admin-ui/plugins \
    && chown -R 1000:0 /app/plugins

USER 1000

ENTRYPOINT ["tini", "-g", "--"]
CMD ["sh", "/app/scripts/entrypoint.sh"]
