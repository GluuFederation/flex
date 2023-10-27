#!/usr/env/bin bash

set -e

check_agama_scripts_dir() {
    host=$(hostname -f)
    while true; do
        echo "[I] Checking contents of ${host}:/opt/jans/jetty/jans-auth/agama/scripts directory"
        ls -l /opt/jans/jetty/jans-auth/agama/scripts;
        sleep 10
    done
}

check_agama_scripts_dir &

sh /app/bin/entrypoint.sh
