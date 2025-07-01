#!/usr/bin/env sh
set -eu
npm run api
exec "$@"
