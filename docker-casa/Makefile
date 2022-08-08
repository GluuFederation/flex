GLUU_VERSION?=5.0.0
IMAGE_NAME=gluufederation/casa
UNSTABLE_VERSION?=dev

.PHONY: test clean all build-dev trivy-scan grype-scan
.DEFAULT_GOAL := build-dev

build-dev:
	@echo "[I] Building Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}"
	@docker build --rm --force-rm -t ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} .

trivy-scan:
	@echo "[I] Scanning Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} using trivy"
	@trivy image --security-checks vuln ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}

grype-scan:
	@echo "[I] Scanning Docker image ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION} using grype"
	@grype -v ${IMAGE_NAME}:${GLUU_VERSION}_${UNSTABLE_VERSION}
