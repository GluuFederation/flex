#!/usr/bin/env sh

set -e

# get script directory
basedir=$(dirname "$(readlink -f -- "$0")")

python3 "$basedir/wait.py"
python3 "$basedir/bootstrap.py"
python3 "$basedir/upgrade.py"
python3 "$basedir/builder.py"

if [ "$GLUU_ADMIN_UI_ENABLE_NGINX" = "true" ]; then
    exec nginx -g 'daemon off;'
fi
