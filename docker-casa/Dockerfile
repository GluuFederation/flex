FROM bellsoft/liberica-openjre-alpine:11

# ===============
# Alpine packages
# ===============

RUN apk update \
    && apk add --no-cache py3-pip openssl tini py3-cryptography py3-lxml py3-psycopg2 py3-grpcio \
    && apk add --no-cache --virtual build-deps git wget \
    && mkdir -p /usr/java/latest \
    && ln -sf /usr/lib/jvm/jre /usr/java/latest/jre

# =====
# Jetty
# =====

ARG JETTY_VERSION=10.0.6
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
ENV GLUU_BUILD_DATE="2022-01-08 18:32"
ENV GLUU_SOURCE_URL=https://jenkins.gluu.org/maven/org/gluu/casa/${GLUU_VERSION}/casa-${GLUU_VERSION}.war

# Install Casa
RUN wget -q ${GLUU_SOURCE_URL} -O /tmp/casa.war \
    && mkdir -p ${JETTY_BASE}/casa/webapps/casa \
    && unzip -qq /tmp/casa.war -d ${JETTY_BASE}/casa/webapps/casa \
    && java -jar ${JETTY_HOME}/start.jar jetty.home=${JETTY_HOME} jetty.base=${JETTY_BASE}/casa --add-module=server,deploy,resources,http,jsp,cdi-decorate \
    && rm -f /tmp/casa.war \
    && rm -f ${JETTY_BASE}/casa/webapps/casa/WEB-INF/jetty-web.xml

# ======
# Python
# ======

COPY requirements.txt /app/requirements.txt
RUN pip3 install -U pip wheel \
    && pip3 install -r /app/requirements.txt --no-cache-dir

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

# ===============
# Persistence ENV
# ===============

ENV CN_PERSISTENCE_TYPE=ldap \
    CN_PERSISTENCE_LDAP_MAPPING=default \
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
    GOOGLE_APPLICATION_CREDENTIALS=/etc/jans/conf/google-credentials.json

# ==========
# misc stuff
# ==========

LABEL name="Casa" \
    maintainer="Gluu Inc. <support@gluu.org>" \
    vendor="Gluu Federation" \
    version="5.0.0" \
    release="dev" \
    summary="Gluu Casa" \
    description="Self-service portal for people to manage their account security preferences in the Gluu Server, like 2FA"

RUN mkdir -p /etc/certs \
    /etc/jans/conf/casa \
    /opt/jans/python/libs \
    /opt/jans/jetty/casa/static \
    /opt/jans/jetty/casa/plugins \
    /app/templates \
    /app/tmp

COPY jetty/jetty-env.xml ${JETTY_BASE}/casa/webapps/casa/WEB-INF/
COPY jetty/log4j2.xml ${JETTY_BASE}/casa/resources/
COPY jetty/casa_web_resources.xml ${JETTY_BASE}/casa/webapps/
COPY templates /app/templates/
COPY scripts /app/scripts
RUN chmod +x /app/scripts/entrypoint.sh

# create non-root user
RUN adduser -s /bin/sh -D -G root -u 1000 jetty

# adjust ownership
RUN chown -R 1000:1000 /opt/jans/jetty \
    && chown -R 1000:1000 /opt/jetty \
    && chown -R 1000:1000 /tmp \
    && chgrp -R 0 /opt/jans/jetty && chmod -R g=u /opt/jans/jetty \
    && chgrp -R 0 /opt/jetty && chmod -R g=u /opt/jetty \
    && chgrp -R 0 /tmp && chmod -R g=u /tmp \
    && chgrp -R 0 /etc/certs && chmod -R g=u /etc/certs \
    && chgrp -R 0 /etc/jans && chmod -R g=u /etc/jans \
    && chmod -R +w /usr/java/latest/jre/lib/security/cacerts && chgrp -R 0 /usr/java/latest/jre/lib/security/cacerts && chmod -R g=u /usr/java/latest/jre/lib/security/cacerts \
    && chmod 664 /opt/jetty/etc/jetty.xml \
    && chmod 664 /opt/jetty/etc/webdefault.xml

USER 1000

ENTRYPOINT ["tini", "-e", "143", "-g", "--"]
CMD ["sh", "/app/scripts/entrypoint.sh"]
