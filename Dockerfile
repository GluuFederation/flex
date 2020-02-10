FROM openjdk:8-jre-alpine3.9

# ===============
# Alpine packages
# ===============

RUN apk update \
    && apk add --no-cache py-pip openssl \
    && apk add --no-cache --virtual build-deps git wget

# =====
# Jetty
# =====

ENV JETTY_VERSION=9.4.24.v20191120 \
    JETTY_HOME=/opt/jetty \
    JETTY_BASE=/opt/gluu/jetty \
    JETTY_USER_HOME_LIB=/home/jetty/lib

# Install jetty
RUN wget -q https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/${JETTY_VERSION}/jetty-distribution-${JETTY_VERSION}.tar.gz -O /tmp/jetty.tar.gz \
    && mkdir -p /opt \
    && tar -xzf /tmp/jetty.tar.gz -C /opt \
    && mv /opt/jetty-distribution-${JETTY_VERSION} ${JETTY_HOME} \
    && rm -rf /tmp/jetty.tar.gz

# Ports required by jetty
EXPOSE 8080

# ====
# Casa
# ====

ENV GLUU_VERSION=4.2.0-SNAPSHOT \
    GLUU_BUILD_DATE=2020-02-07

# Install Casa
RUN wget -q https://ox.gluu.org/maven/org/gluu/casa/${GLUU_VERSION}/casa-${GLUU_VERSION}.war -O /tmp/casa.war \
    && mkdir -p ${JETTY_BASE}/casa/webapps/casa \
    && unzip -qq /tmp/casa.war -d ${JETTY_BASE}/casa/webapps/casa \
    && java -jar ${JETTY_HOME}/start.jar jetty.home=${JETTY_HOME} jetty.base=${JETTY_BASE}/casa --add-to-start=server,deploy,resources,http,http-forwarded,jsp \
    && rm -f /tmp/casa.war

# ===========
# Custom libs
# ===========

ENV TWILIO_VERSION 7.17.0
RUN wget -q https://repo1.maven.org/maven2/com/twilio/sdk/twilio/${TWILIO_VERSION}/twilio-${TWILIO_VERSION}.jar -O /tmp/twilio.jar

ENV JSMPP_VERSION 2.3.7
RUN wget -q https://repo1.maven.org/maven2/org/jsmpp/jsmpp/${JSMPP_VERSION}/jsmpp-${JSMPP_VERSION}.jar -O /tmp/jsmpp.jar

# ====
# Tini
# ====

RUN wget -q https://github.com/krallin/tini/releases/download/v0.18.0/tini-static -O /usr/bin/tini \
    && chmod +x /usr/bin/tini

# ======
# Python
# ======

COPY requirements.txt /tmp/requirements.txt
RUN pip install -U pip \
    && pip install --no-cache-dir -r /tmp/requirements.txt

# =======
# License
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

ENV GLUU_CONFIG_ADAPTER=consul \
    GLUU_CONFIG_CONSUL_HOST=localhost \
    GLUU_CONFIG_CONSUL_PORT=8500 \
    GLUU_CONFIG_CONSUL_CONSISTENCY=stale \
    GLUU_CONFIG_CONSUL_SCHEME=http \
    GLUU_CONFIG_CONSUL_VERIFY=false \
    GLUU_CONFIG_CONSUL_CACERT_FILE=/etc/certs/consul_ca.crt \
    GLUU_CONFIG_CONSUL_CERT_FILE=/etc/certs/consul_client.crt \
    GLUU_CONFIG_CONSUL_KEY_FILE=/etc/certs/consul_client.key \
    GLUU_CONFIG_CONSUL_TOKEN_FILE=/etc/certs/consul_token \
    GLUU_CONFIG_KUBERNETES_NAMESPACE=default \
    GLUU_CONFIG_KUBERNETES_CONFIGMAP=gluu \
    GLUU_CONFIG_KUBERNETES_USE_KUBE_CONFIG=false

# ==========
# Secret ENV
# ==========

ENV GLUU_SECRET_ADAPTER=vault \
    GLUU_SECRET_VAULT_SCHEME=http \
    GLUU_SECRET_VAULT_HOST=localhost \
    GLUU_SECRET_VAULT_PORT=8200 \
    GLUU_SECRET_VAULT_VERIFY=false \
    GLUU_SECRET_VAULT_ROLE_ID_FILE=/etc/certs/vault_role_id \
    GLUU_SECRET_VAULT_SECRET_ID_FILE=/etc/certs/vault_secret_id \
    GLUU_SECRET_VAULT_CERT_FILE=/etc/certs/vault_client.crt \
    GLUU_SECRET_VAULT_KEY_FILE=/etc/certs/vault_client.key \
    GLUU_SECRET_VAULT_CACERT_FILE=/etc/certs/vault_ca.crt \
    GLUU_SECRET_KUBERNETES_NAMESPACE=default \
    GLUU_SECRET_KUBERNETES_SECRET=gluu \
    GLUU_SECRET_KUBERNETES_USE_KUBE_CONFIG=false

# ===============
# Persistence ENV
# ===============

ENV GLUU_PERSISTENCE_TYPE=ldap \
    GLUU_PERSISTENCE_LDAP_MAPPING=default \
    GLUU_COUCHBASE_URL=localhost \
    GLUU_COUCHBASE_USER=admin \
    GLUU_COUCHBASE_CERT_FILE=/etc/certs/couchbase.crt \
    GLUU_COUCHBASE_PASSWORD_FILE=/etc/gluu/conf/couchbase_password \
    GLUU_LDAP_URL=localhost:1636

# ===========
# Generic ENV
# ===========

ENV GLUU_MAX_RAM_PERCENTAGE=75.0 \
    GLUU_WAIT_MAX_TIME=300 \
    GLUU_WAIT_SLEEP_DURATION=10 \
    GLUU_OXD_SERVER_URL=https://localhost:8443

# ==========
# misc stuff
# ==========

LABEL name="Casa" \
    maintainer="Gluu Inc. <support@gluu.org>" \
    vendor="Gluu Federation" \
    version="4.2.0" \
    release="dev" \
    summary="Gluu Casa" \
    description="Self-service portal for people to manage their account security preferences in the Gluu Server, like 2FA"

RUN mkdir -p /etc/certs \
    /etc/gluu/conf/casa \
    /opt/gluu/python/libs \
    /opt/gluu/jetty/casa/static \
    /opt/gluu/jetty/casa/plugins \
    /deploy \
    /app/templates \
    /app/tmp

COPY certs/casa.pub /etc/certs/
COPY templates /app/templates/
COPY scripts /app/scripts
RUN chmod +x /app/scripts/entrypoint.sh \
    && cp /app/templates/casa_web_resources.xml /opt/gluu/jetty/casa/webapps/

# create non-root user
# RUN useradd -ms /bin/sh --uid 1000 jetty \
#     && usermod -a -G root jetty

# adjust ownership
# RUN chown -R 1000:1000 /opt/gluu/jetty \
#     && chown -R 1000:1000 /deploy \
#     && chmod -R g+w /usr/lib/jvm/default-jvm/jre/lib/security/cacerts \
#     && chgrp -R 0 /opt/gluu/jetty && chmod -R g=u /opt/gluu/jetty \
#     && chgrp -R 0 /deploy && chmod -R g=u /deploy \
#     && chgrp -R 0 /etc/certs && chmod -R g=u /etc/certs \
#     && chgrp -R 0 /etc/gluu && chmod -R g=u /etc/gluu

# run as non-root user
# USER 1000

ENTRYPOINT ["tini", "-g", "--"]
CMD ["/app/scripts/entrypoint.sh"]
