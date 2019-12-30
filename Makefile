GLUU_VERSION=4.1.0
IMAGE_NAME=gluufederation/casa
UNSTABLE_VERSION=dev

build-dev:
	@echo "[I] Building Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}"
	@docker build --rm --force-rm -t ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} .
