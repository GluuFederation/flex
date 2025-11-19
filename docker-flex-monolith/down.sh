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

if [ -z "$FLEX_SERVICE_NAME" ]; then
    FLEX_SERVICE_NAME="flex"
fi

cd $SCRIPT_DIR

FLEX_IMAGE="${DOCKER_PROJECT}_${INSTALLED_FLEX_NAME}:${FLEX_VERSION}"
FLEX_CONTAINER="${DOCKER_PROJECT}-${FLEX_SERVICE_NAME}-1"

if ! docker image inspect ${FLEX_IMAGE} &> /dev/null; then
	if docker exec "${FLEX_CONTAINER}" sh -c '[ -e /flex/deployed ]'; then
		echo "installation of flex was sucessfull - an after install image will be created (this can take a while)"
		docker stop ${FLEX_CONTAINER} &> /dev/null;
		docker commit ${FLEX_CONTAINER} ${FLEX_IMAGE}
		#ensure the down will be the same as on up
		FLEX_IMAGE="ghcr.io/gluufederation/flex/monolith:${FLEX_VERSION}";
	fi
fi
export FLEX_IMAGE
docker compose -f ${yaml} down
