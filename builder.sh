#!/bin/sh

set -e

GLUU_VERSION=4.0.0
IMAGE_NAME="gluufederation/casa"
UNSTABLE_VERSION="dev"
STABLE_VERSION=${STABLE_VERSION:-""}

echo "[I] Building Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}"
docker build --rm --force-rm -t ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} .

if [ ! -z $STABLE_VERSION ]; then
    echo "[I] Building Docker image ${IMAGE_NAME}_${STABLE_VERSION}"
    docker tag ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} ${IMAGE_NAME}:${GLUU_VERSION}_${STABLE_VERSION} && echo "Succesfully tagged ${IMAGE_NAME}:${GLUU_VERSION}_${STABLE_VERSION}"
fi
