#!/bin/sh
set -e

# =========
# FUNCTIONS
# =========

run_entrypoint() {
    if [ ! -f /deploy/touched ]; then
        python /app/scripts/entrypoint.py
        touch /deploy/touched
    fi
}

# ==========
# ENTRYPOINT
# ==========

if [ -f /etc/redhat-release ]; then
    source scl_source enable python27 && python /app/scripts/wait.py
    source scl_source enable python27 && run_entrypoint
else
    python /app/scripts/wait.py
    run_entrypoint
fi

# run Casa server
cd /opt/gluu/jetty/casa
exec java \
    -server \
    -XX:+DisableExplicitGC \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=$GLUU_MAX_RAM_PERCENTAGE \
    -Dgluu.base=/etc/gluu \
    -Dserver.base=/opt/gluu/jetty/casa \
    -Dlog.base=/opt/gluu/jetty/casa \
    -Dpython.home=/opt/jython \
    -jar /opt/jetty/start.jar
