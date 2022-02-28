#!/usr/bin/env sh

set -e

python3 /app/scripts/wait.py
python3 /app/scripts/bootstrap.py

cd /opt/flex/admin-ui
npm run build:prod
cp -R /opt/flex/admin-ui/dist/* /var/lib/nginx/html/
exec nginx
