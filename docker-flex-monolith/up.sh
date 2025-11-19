#!/bin/bash

if [ -z "$1" ]; then
    echo "The used db was not specified as argument, will use mysql as default"
    yaml="flex-mysql-compose.yml"
else
	case "$1" in
		mysql|postgres)
			yaml="flex-${1}-compose.yml"
			;;
		*)
			yaml="${1}"
			;;
	esac
fi

# Get the directory of the script
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
DOCKER_PROJECT=$(basename "$SCRIPT_DIR")

if [ -z "$INSTALLED_FLEX_NAME" ]; then
    INSTALLED_FLEX_NAME="after-install-flex"
fi

if [ -z "$FLEX_VERSION" ]; then
    FLEX_VERSION="5.14.0-1"
fi

if [ -z "$DATABASE_VOLUME_NAME" ]; then
    DATABASE_VOLUME_NAME="db-data"
fi

cd $SCRIPT_DIR

FLEX_IMAGE=${DOCKER_PROJECT}_${INSTALLED_FLEX_NAME}:${FLEX_VERSION}
if docker image inspect ${FLEX_IMAGE} &> /dev/null; then
	echo "after install flex image found - it will be used"
else
	echo "no after install flex image found - fresh installation with empty database will be executed"
	if docker volume inspect ${DOCKER_PROJECT}_${DATABASE_VOLUME_NAME} &> /dev/null; then
		docker volume rm ${DOCKER_PROJECT}_${DATABASE_VOLUME_NAME} &> /dev/null
	fi
	FLEX_IMAGE="ghcr.io/gluufederation/flex/monolith:${FLEX_VERSION}"
fi

export FLEX_IMAGE
docker compose -f ${yaml} up -d
