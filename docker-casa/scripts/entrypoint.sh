#!/bin/sh
set -e

# =========
# FUNCTIONS
# =========

get_prometheus_opt() {
    prom_opt=""

    if [ -n "${CN_PROMETHEUS_PORT}" ]; then
        prom_opt="
            -javaagent:/opt/prometheus/jmx_prometheus_javaagent.jar=${CN_PROMETHEUS_PORT}:/opt/prometheus/prometheus-config.yaml
        "
    fi
    echo "${prom_opt}"
}

get_prometheus_lib() {
    if [ -n "${CN_PROMETHEUS_PORT}" ]; then
        prom_agent_version="0.17.2"

        if [ ! -f /opt/prometheus/jmx_prometheus_javaagent.jar ]; then
            wget -q https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/${prom_agent_version}/jmx_prometheus_javaagent-${prom_agent_version}.jar -O /opt/prometheus/jmx_prometheus_javaagent.jar
        fi
    fi
}

# ==========
# ENTRYPOINT
# ==========

get_prometheus_lib
python3 /app/scripts/wait.py
python3 /app/scripts/bootstrap.py
python3 /app/scripts/upgrade.py
# python3 /app/scripts/jca_sync.py &
python3 /app/scripts/auth_conf.py
python3 /app/scripts/mod_context.py casa

# create administrable file ootb
touch "$GLUU_CASA_ADMIN_LOCK_FILE"

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
    -Dcom.nimbusds.jose.jwk.source.RemoteJWKSet.defaultHttpSizeLimit=${GLUU_CASA_JWKS_SIZE_LIMIT} \
    $(get_prometheus_opt) \
    ${CN_JAVA_OPTIONS} \
    -jar /opt/jetty/start.jar jetty.httpConfig.sendServerVersion=false jetty.deploy.scanInterval=0
