#!/bin/sh
set -e

# =========
# FUNCTIONS
# =========

run_entrypoint() {
    # move twilio lib
    if [ ! -f /opt/gluu/jetty/oxauth/custom/libs/twilio.jar ]; then
        mkdir -p /opt/gluu/jetty/oxauth/custom/libs
        mv /tmp/twilio.jar /opt/gluu/jetty/oxauth/custom/libs/twilio.jar
    fi

    # move jsmpp lib
    if [ ! -f /opt/gluu/jetty/oxauth/custom/libs/jsmpp.jar ]; then
        mkdir -p /opt/gluu/jetty/oxauth/custom/libs
        mv /tmp/jsmpp.jar /opt/gluu/jetty/oxauth/custom/libs/jsmpp.jar
    fi

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
