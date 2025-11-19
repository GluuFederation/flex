# ==============
# Assets sources
# ==============

# original Janssen base version (without suffix)
ARG BASE_VERSION=1.14.0-1
ARG FLEX_BASE_VERSION=5.14.0-1

# the following ARGs set default base images
# they can be overriden in build process via --build-arg option
ARG JANS_AIO_IMAGE=ghcr.io/janssenproject/jans/all-in-one:${BASE_VERSION}
ARG FLEX_ADMIN_UI_IMAGE=ghcr.io/gluufederation/flex/admin-ui:${FLEX_BASE_VERSION}

# -----------
# base images
# -----------

FROM ${JANS_AIO_IMAGE} AS jans-aio-src

FROM ${FLEX_ADMIN_UI_IMAGE} AS flex-admin-ui-src

# ===
# app
# ===

FROM bellsoft/liberica-openjdk-alpine:17.0.12@sha256:877a6ffc273212bd3f695db2a7973a05aa1bfb88ad550ba9ffe7deb7d1e50eee

# hadolint ignore=DL3018
RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache tini bash curl openssl python3 py3-cryptography py3-psycopg2 py3-grpcio nodejs npm nginx \
    && apk add --no-cache --virtual .build-deps git wget

# -------
# License
# -------

COPY LICENSE /licenses/LICENSE

# -----------
# assets sync
# -----------

COPY --from=jans-aio-src /app /app
COPY --from=jans-aio-src /opt/jetty /opt/jetty
COPY --from=jans-aio-src /opt/jython /opt/jython
COPY --from=jans-aio-src /etc/certs /etc/certs
COPY --from=jans-aio-src /etc/jans /etc/jans
COPY --from=jans-aio-src /opt/jans /opt/jans
COPY --from=jans-aio-src /opt/prometheus /opt/prometheus
COPY --from=jans-aio-src /usr/local/bin/facter /usr/local/bin/facter
COPY --from=jans-aio-src /etc/nginx/jans-aio /etc/nginx/jans-aio
COPY --from=jans-aio-src /opt/keycloak /opt/keycloak
COPY --from=jans-aio-src /opt/idp /opt/idp
COPY --from=jans-aio-src /var/log/adminui /var/log/adminui
COPY --from=jans-aio-src /usr/share/java /usr/share/java

COPY --from=flex-admin-ui-src /opt/flex/admin-ui /opt/flex/admin-ui
COPY --from=flex-admin-ui-src /app/templates/admin-ui /app/templates/admin-ui
COPY --from=flex-admin-ui-src /run/nginx/nginx.pid /run/nginx/nginx.pid
COPY --from=flex-admin-ui-src /app/scripts /app/flex_aio/admin_ui
RUN ln -sf /app/flex_aio/admin_ui/entrypoint.sh /app/bin/admin-ui-entrypoint.sh

# ===========
# Assets sync
# ===========

ENV JANS_SOURCE_VERSION=88d8e89acc598b9ddf68659b0a51c3c9e3b712f0

# note that as we're pulling from a monorepo (with multiple project in it)
# we are using partial-clone and sparse-checkout to get the assets
ARG GIT_CLONE_DEPTH=100
WORKDIR /tmp/jans

RUN git clone --depth ${GIT_CLONE_DEPTH} --filter blob:none --no-checkout https://github.com/janssenproject/jans . \
    && git sparse-checkout init --cone \
    && git sparse-checkout add jans-pycloudlib \
    && git checkout ${JANS_SOURCE_VERSION}

WORKDIR /

# ------
# Python
# ------

ARG PIP_TIMEOUT=15
COPY app/requirements.flex.txt /app/
RUN mv /usr/lib/python3.12/EXTERNALLY-MANAGED /usr/lib/python3.12/EXTERNALLY-MANAGED.disabled \
    && python3 -m ensurepip \
    && pip3 install --no-cache-dir -U pip wheel setuptools --timeout ${PIP_TIMEOUT} \
    && pip3 install --no-cache-dir -r /app/requirements.flex.txt --timeout ${PIP_TIMEOUT} \
    && pip3 uninstall -y pip wheel

# -------
# Cleanup
# -------

RUN apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/jans

# ----
# misc
# ----

RUN ln -sf /usr/lib/jvm/jdk /opt/java

RUN mkdir -p /usr/share/java /var/lib/nginx/html/admin

COPY app /app

# CN version as env var (with suffix if any, i.e. SNAPSHOT)
ENV CN_VERSION=

# set directory contains installer code that will be added to Python sys.path
ENV PYTHONPATH=/app

ENV JETTY_BASE=/opt/jans/jetty \
    JETTY_HOME=/opt/jetty \
    CN_AIO_COMPONENTS="configurator,persistence-loader,jans-auth,jans-config-api,jans-fido2,jans-scim,jans-casa" \
    CN_AIO_ENABLE_MONITOR=false \
    CN_AIO_PLUGINS="flex_aio.plugins.FlexPlugin" \
    CN_ENABLE_STDOUT_LOG_PREFIX=true \
    CN_DUO_ENABLED=false \
    CN_AUTH_JAVA_OPTIONS="" \
    CN_CONFIG_API_JAVA_OPTIONS="" \
    CN_FIDO2_JAVA_OPTIONS="" \
    CN_SCIM_JAVA_OPTIONS=""  \
    CN_JETTY_REQUEST_HEADER_SIZE=8192 \
    CN_CONFIG_API_CREATE_SCOPES=true \
    CN_AUTH_JETTY_HOST=127.0.0.1 \
    CN_AUTH_JETTY_PORT=8081 \
    CN_CONFIG_API_JETTY_HOST=127.0.0.1 \
    CN_CONFIG_API_JETTY_PORT=8074 \
    CN_FIDO2_JETTY_HOST=127.0.0.1 \
    CN_FIDO2_JETTY_PORT=8073 \
    CN_SCIM_JETTY_HOST=127.0.0.1 \
    CN_SCIM_JETTY_PORT=8087 \
    CN_CASA_JETTY_HOST=127.0.0.1 \
    CN_CASA_JETTY_PORT=8082 \
    CN_CASA_ADMIN_LOCK_FILE=/opt/jans/jetty/jans-casa/resources/.administrable \
    CN_CASA_JWKS_SIZE_LIMIT=100000 \
    CN_CASA_JAVA_OPTIONS="" \
    CN_SHARE_AUTH_CONF=false \
    CN_SQL_PASSWORD_FILE=/etc/jans/conf/sql_password \
    CN_SAML_HTTP_HOST=127.0.0.1 \
    CN_SAML_HTTP_PORT=8083 \
    CN_SAML_JAVA_OPTIONS="" \
    CN_SAML_KC_ADMIN_CREDENTIALS_FILE=/etc/jans/conf/kc_admin_creds \
    CN_SAML_KC_DB_PASSWORD_FILE=/etc/jans/conf/kc_db_password \
    KC_LOG_LEVEL=INFO \
    KC_DB=mysql \
    KC_DB_USERNAME=keycloak \
    KC_DB_SCHEMA=keycloak \
    KC_DB_URL_HOST=localhost \
    KC_DB_URL_PORT=3306 \
    KC_DB_URL_DATABASE=keycloak \
    KC_DB_URL_PROPERTIES=?useUnicode=true&characterEncoding=UTF-8&character_set_server=utf8mb4 \
    QUARKUS_TRANSACTION_MANAGER_ENABLE_RECOVERY=false \
    GLUU_ADMIN_UI_ENABLE_NGINX=false \
    GLUU_ADMIN_UI_PUBLIC_DIR=/var/lib/nginx/html/admin

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/flex-all-in-one" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="5.14.0-1" \
    org.opencontainers.image.title="Gluu Flex All-in-One" \
    org.opencontainers.image.description=""

# forward logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

RUN cp /app/templates/nginx/*-upstream.conf /etc/nginx/jans-aio/ \
    && cp /app/templates/nginx/*-location.conf /etc/nginx/jans-aio \
    && cp /app/templates/nginx/admin-index.html /var/lib/nginx/html/admin/index.html

RUN touch /run/nginx/nginx.pid

# create non-root user
RUN adduser -s /bin/sh -h /home/1000 -D -u 1000 flex \
    && addgroup flex root

RUN chmod +x /app/bin/entrypoint.sh

# adjust ownership and permission
RUN chown -R 1000:1000 ${JETTY_HOME}/temp \
    ${JETTY_BASE}/common/libs \
    ${JETTY_BASE}/jans-auth/custom \
    ${JETTY_BASE}/jans-auth/resources \
    ${JETTY_BASE}/jans-auth/logs \
    ${JETTY_BASE}/jans-auth/agama \
    ${JETTY_BASE}/jans-config-api/custom \
    ${JETTY_BASE}/jans-config-api/resources \
    ${JETTY_BASE}/jans-config-api/logs \
    ${JETTY_BASE}/jans-config-api/_plugins \
    ${JETTY_BASE}/jans-fido2/custom \
    ${JETTY_BASE}/jans-fido2/resources \
    ${JETTY_BASE}/jans-fido2/logs \
    ${JETTY_BASE}/jans-scim/custom \
    ${JETTY_BASE}/jans-scim/resources \
    ${JETTY_BASE}/jans-scim/logs \
    ${JETTY_BASE}/jans-casa/static \
    ${JETTY_BASE}/jans-casa/plugins \
    ${JETTY_BASE}/jans-casa/resources \
    ${JETTY_BASE}/jans-casa/logs \
    /etc/certs \
    /etc/jans \
    /opt/jans/python/libs \
    /opt/jans/configurator \
    /opt/prometheus \
    /app \
    /var/lib/nginx \
    /var/log/nginx \
    /var/log/adminui \
    /etc/nginx/jans-aio \
    /usr/share/java \
    /opt/idp \
    /opt/keycloak/logs \
    /opt/keycloak/conf

RUN chmod -R g=u ${JETTY_HOME}/temp \
    ${JETTY_BASE}/common/libs \
    ${JETTY_BASE}/jans-auth/agama \
    ${JETTY_BASE}/jans-auth/custom \
    ${JETTY_BASE}/jans-auth/resources \
    ${JETTY_BASE}/jans-auth/logs \
    ${JETTY_BASE}/jans-config-api/custom \
    ${JETTY_BASE}/jans-config-api/resources \
    ${JETTY_BASE}/jans-config-api/logs \
    ${JETTY_BASE}/jans-config-api/_plugins \
    ${JETTY_BASE}/jans-fido2/custom \
    ${JETTY_BASE}/jans-fido2/resources \
    ${JETTY_BASE}/jans-fido2/logs \
    ${JETTY_BASE}/jans-scim/custom \
    ${JETTY_BASE}/jans-scim/resources \
    ${JETTY_BASE}/jans-scim/logs \
    ${JETTY_BASE}/jans-casa/static \
    ${JETTY_BASE}/jans-casa/plugins \
    ${JETTY_BASE}/jans-casa/resources \
    ${JETTY_BASE}/jans-casa/logs \
    /etc/certs \
    /etc/jans \
    /opt/jans/python/libs \
    /opt/jans/configurator \
    /opt/prometheus \
    /app \
    /var/lib/nginx \
    /var/log/nginx \
    /var/log/adminui \
    /etc/nginx/jans-aio \
    /usr/share/java \
    /opt/idp \
    /opt/keycloak/logs \
    /opt/keycloak/conf

RUN chown 1000:1000 /opt/java/lib/security/cacerts \
    /run/nginx/nginx.pid \
    /etc/nginx/http.d/default.conf \
    /opt/flex/admin-ui

# run as non-root user
USER 1000

RUN mkdir -p $HOME/.config/gcloud

WORKDIR /app

EXPOSE 8080

CMD ["sh", "/app/bin/flex-entrypoint.sh"]
