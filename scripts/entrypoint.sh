#!/bin/sh
set -e

# =========
# FUNCTIONS
# =========

# ==========
# ENTRYPOINT
# ==========

python3 /app/scripts/wait.py

python3 /app/scripts/bootstrap.py

# python3 /app/scripts/jca_sync.py &

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
    -Dlog4j2.configurationFile=resources/log4j2.xml \
    ${CN_JAVA_OPTIONS} \
    -jar /opt/jetty/start.jar
