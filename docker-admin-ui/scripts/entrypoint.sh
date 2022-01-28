#!/usr/bin/env sh

set -e

python3 /app/scripts/wait.py
python3 /app/scripts/bootstrap.py

cd /opt/jans/gluu-admin-ui
npm run build:prod
cp -R /opt/jans/gluu-admin-ui/dist/* /usr/share/nginx/html/
exec nginx
