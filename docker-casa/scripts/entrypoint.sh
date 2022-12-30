#!/bin/sh
set -e

# =========
# FUNCTIONS
# =========

get_casa_plugins(){
    # ===============
    # PREPARE PLUGINS
    # ===============
    CASA_PLUGIN_DIRECTORY=/opt/jans/jetty/casa/plugins
    CASA_PLUGIN_REPO=https://maven.gluu.org/maven/org/gluu/casa/plugins
    wget -q ${CASA_PLUGIN_REPO}/strong-authn-settings/${GLUU_VERSION}/strong-authn-settings-${GLUU_VERSION}-jar-with-dependencies.jar -O ${CASA_PLUGIN_DIRECTORY}/strong-authn-settings-${GLUU_VERSION}.jar \
    && wget -q ${CASA_PLUGIN_REPO}/authorized-clients/${GLUU_VERSION}/authorized-clients-${GLUU_VERSION}-jar-with-dependencies.jar -O ${CASA_PLUGIN_DIRECTORY}/authorized-clients-${GLUU_VERSION}.jar \
    && wget -q ${CASA_PLUGIN_REPO}/custom-branding/${GLUU_VERSION}/custom-branding-${GLUU_VERSION}-jar-with-dependencies.jar -O ${CASA_PLUGIN_DIRECTORY}/custom-branding-${GLUU_VERSION}.jar
    #&& wget -q ${CASA_PLUGIN_REPO}/account-linking/${GLUU_VERSION}/account-linking-${GLUU_VERSION}.jar -O ${CASA_PLUGIN_DIRECTORY}/account-linking-${GLUU_VERSION}.jar \
    #&& wget -q ${CASA_PLUGIN_REPO}/bioid-plugin/${GLUU_VERSION}/bioid-plugin-${GLUU_VERSION}.jar -O ${CASA_PLUGIN_DIRECTORY}/bioid-plugin-${GLUU_VERSION}.jar \
    #&& wget -q ${CASA_PLUGIN_REPO}/cert-authn/${GLUU_VERSION}/cert-authn-${GLUU_VERSION}.jar -O ${CASA_PLUGIN_DIRECTORY}/cert-authn-${GLUU_VERSION}.jar \
    #&& wget -q ${CASA_PLUGIN_REPO}/duo-plugin/${GLUU_VERSION}/duo-plugin-${GLUU_VERSION}.jar -O ${CASA_PLUGIN_DIRECTORY}/duo-plugin-${GLUU_VERSION}.jar
}

get_prometheus_opt() {
    prom_opt=""

    if [ -n "${CN_PROMETHEUS_PORT}" ]; then
        prom_opt="
            -javaagent:/opt/prometheus/jmx_prometheus_javaagent.jar=${CN_PROMETHEUS_PORT}:/opt/prometheus/prometheus-config.yaml
        "
    fi
    echo "${prom_opt}"
}

# ==========
# ENTRYPOINT
# ==========

python3 /app/scripts/wait.py
python3 /app/scripts/bootstrap.py
# python3 /app/scripts/jca_sync.py &
python3 /app/scripts/auth_conf.py
python3 /app/scripts/mod_context.py casa

get_casa_plugins

# run Casa server
cd /opt/jans/jetty/casa
exec java \
    -server \
    -XX:+DisableExplicitGC \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=$CN_MAX_RAM_PERCENTAGE \
    -Djans.base=/etc/jans \
    -Dserver.base=/opt/jans/jetty/casa \
    -Dlog.base=/opt/jans/jetty/casa \
    -Dpython.home=/opt/jython \
    -Djava.io.tmpdir=/tmp \
    -Dlog4j2.configurationFile=resources/log4j2.xml \
    -Dadmin.lock=${GLUU_CASA_ADMIN_LOCK_FILE} \
    $(get_prometheus_opt) \
    ${CN_JAVA_OPTIONS} \
    -jar /opt/jetty/start.jar jetty.httpConfig.sendServerVersion=false jetty.deploy.scanInterval=0
