FROM ghcr.io/janssenproject/jans/persistence-loader:2.6.1-1

# ===========
# Assets sync
# ===========

ENV FLEX_SOURCE_VERSION=18e242bcfd6cce8777e4d39e6e84b95739a76159

USER 0

RUN wget -q https://github.com/GluuFederation/flex/raw/$FLEX_SOURCE_VERSION/flex-linux-setup/flex_linux_setup/flex_schema.json -P /app/schema

# ====
# misc
# ====

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/persistence-loader" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="6.6.1-1" \
    org.opencontainers.image.title="Gluu Flex Persistence loader"

USER 1000
