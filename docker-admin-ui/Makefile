GLUU_VERSION=1.0.0
IMAGE_NAME=gluufederation/admin-ui
UNSTABLE_VERSION=dev

build-ui:
	@echo "[I] Building Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}"
	@docker build --rm --force-rm -t ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} .
