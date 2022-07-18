#!/usr/bin/env sh

set -e

python3 /app/scripts/wait.py
python3 /app/scripts/bootstrap.py
python3 /app/scripts/builder.py

exec nginx
