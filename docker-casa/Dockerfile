FROM bellsoft/liberica-openjre-alpine:11.0.16

# ===============
# Alpine packages
# ===============

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache python3 openssl tini py3-cryptography py3-psycopg2 py3-grpcio \
    && apk add --no-cache --virtual .build-deps git wget zip \
    && mkdir -p /usr/java/latest \
    && ln -sf /usr/lib/jvm/jre /usr/java/latest/jre

# =====
# Jetty
# =====

ARG JETTY_VERSION=11.0.13
ARG JETTY_HOME=/opt/jetty
ARG JETTY_BASE=/opt/jans/jetty
ARG JETTY_USER_HOME_LIB=/home/jetty/lib

# Install jetty
RUN wget -q https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-home/${JETTY_VERSION}/jetty-home-${JETTY_VERSION}.tar.gz -O /tmp/jetty.tar.gz \
    && mkdir -p /opt \
    && tar -xzf /tmp/jetty.tar.gz -C /opt \
    && mv /opt/jetty-home-${JETTY_VERSION} ${JETTY_HOME} \
    && rm -rf /tmp/jetty.tar.gz

# Ports required by jetty
EXPOSE 8080

# ====
# Casa
# ====

ENV GLUU_VERSION=5.0.0-SNAPSHOT
ENV GLUU_BUILD_DATE='2023-03-16 13:28'
ENV GLUU_SOURCE_URL=https://jenkins.gluu.org/maven/org/gluu/casa/${GLUU_VERSION}/casa-${GLUU_VERSION}.war

# Install Casa
COPY jetty/jetty-env.xml /tmp/WEB-INF/jetty-env.xml
RUN mkdir -p ${JETTY_BASE}/casa/webapps \
    && wget -q ${GLUU_SOURCE_URL} -O /tmp/casa.war \
    && cd /tmp \
    && zip -d casa.war WEB-INF/jetty-web.xml \
    && zip -r casa.war WEB-INF/jetty-env.xml \
    && cp casa.war ${JETTY_BASE}/casa/webapps/casa.war \
    && java -jar ${JETTY_HOME}/start.jar jetty.home=${JETTY_HOME} jetty.base=${JETTY_BASE}/casa --add-module=server,deploy,resources,http,jsp,cdi-decorate,jmx,stats,logging-log4j2 --approve-all-licenses \
    && rm -rf /tmp/casa.war /tmp/WEB-INF

# ======
# Python
# ======

COPY requirements.txt /app/requirements.txt
RUN python3 -m ensurepip \
    && pip3 install --no-cache-dir -U pip wheel setuptools \
    && pip3 install --no-cache-dir -r /app/requirements.txt \
    && pip3 uninstall -y pip wheel

# ==========
# Prometheus
# ==========

COPY conf/prometheus-config.yaml /opt/prometheus/

# =====================
# jans-linux-setup sync
# =====================

ENV JANS_SOURCE_VERSION=6ee87dd9647333a17ab51bdd44ed9a4825eefea2
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

# ===============
# flex setup sync
# ===============

ENV FLEX_VERSION=3f0281bbf381a63b28229388d6b0ae536902b455
ARG FLEX_SETUP_DIR=flex-linux-setup/flex_linux_setup
ARG CASA_EXTRAS_DIR=casa/extras

RUN mkdir -p /app/templates /app/static/extension/person_authentication

RUN git clone --filter blob:none --no-checkout https://github.com/GluuFederation/flex.git /tmp/flex \
    && cd /tmp/flex \
    && git sparse-checkout init --cone \
    && git checkout ${FLEX_VERSION} \
    && git sparse-checkout add ${FLEX_SETUP_DIR} \
    && cp ${FLEX_SETUP_DIR}/templates/casa_*.ldif /app/templates \
    && git sparse-checkout add ${CASA_EXTRAS_DIR} \
    && cp ${CASA_EXTRAS_DIR}/Casa.py /app/static/extension/person_authentication/

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
    CN_SECRET_KUBERNETES_USE_KUBE_CONFIG=false

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

ENV CN_MAX_RAM_PERCENTAGE=75.0 \
    CN_WAIT_MAX_TIME=300 \
    CN_WAIT_SLEEP_DURATION=10 \
    PYTHON_HOME=/opt/jython \
    CN_DOCUMENT_STORE_TYPE=LOCAL \
    CN_JACKRABBIT_URL=http://localhost:8080 \
    CN_JACKRABBIT_ADMIN_ID=admin \
    CN_JACKRABBIT_ADMIN_PASSWORD_FILE=/etc/jans/conf/jackrabbit_admin_password \
    CN_JAVA_OPTIONS="" \
    CN_SSL_CERT_FROM_SECRETS=false \
    GOOGLE_PROJECT_ID="" \
    GOOGLE_APPLICATION_CREDENTIALS=/etc/jans/conf/google-credentials.json \
    CN_GOOGLE_SECRET_MANAGER_PASSPHRASE=secret \
    CN_GOOGLE_SECRET_VERSION_ID=latest \
    CN_GOOGLE_SECRET_NAME_PREFIX=jans \
    GLUU_CASA_ADMIN_LOCK_FILE=/opt/jans/jetty/casa/resources/.administrable \
    CN_PROMETHEUS_PORT="" \
    CN_VERSION=1.0.11-SNAPSHOT

# ==========
# misc stuff
# ==========

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/casa" \
    org.opencontainers.image.authors="Gluu Inc. <support@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="5.0.0" \
    org.opencontainers.image.title="Gluu Flex Casa" \
    org.opencontainers.image.description="Self-service portal for people to manage their account security preferences in the Gluu Server, like 2FA"

RUN mkdir -p /etc/certs \
    /etc/jans/conf/casa \
    /opt/jans/python/libs \
    /opt/jans/jetty/casa/static \
    /opt/jans/jetty/casa/plugins \
    /opt/jans/jetty/casa/logs \
    /opt/jans/jetty/common/libs/spanner \
    /opt/jans/jetty/common/libs/couchbase \
    /usr/share/java

COPY jetty/log4j2.xml /app/templates/
COPY jetty/casa_web_resources.xml ${JETTY_BASE}/casa/webapps/
COPY conf/*.tmpl /app/templates/
COPY scripts /app/scripts
RUN chmod +x /app/scripts/entrypoint.sh

# create non-root user
RUN adduser -s /bin/sh -D -G root -u 1000 jetty

COPY --chown=1000:0 jetty/casa.xml ${JETTY_BASE}/casa/webapps/

# adjust ownership
RUN chmod -R g=u ${JETTY_BASE}/casa/static \
    && chmod -R g=u ${JETTY_BASE}/casa/plugins \
    && chown -R 1000:0 ${JETTY_BASE}/casa/resources \
    && chmod 664 ${JETTY_BASE}/casa/resources/log4j2.xml \
    && chmod -R g=u ${JETTY_BASE}/casa/logs \
    && chmod -R g=u /etc/certs \
    && chmod -R g=u /etc/jans \
    && chmod 664 /usr/java/latest/jre/lib/security/cacerts \
    && chmod 664 /opt/jetty/etc/jetty.xml \
    && chmod 664 /opt/jetty/etc/webdefault.xml \
    && chown -R 1000:0 ${JETTY_BASE}/common/libs \
    && chown -R 1000:0 /usr/share/java \
    && chown -R 1000:0 /opt/prometheus

USER 1000

ENTRYPOINT ["tini", "-e", "143", "-g", "--"]
CMD ["sh", "/app/scripts/entrypoint.sh"]
