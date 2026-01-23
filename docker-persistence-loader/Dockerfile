FROM ghcr.io/janssenproject/jans/persistence-loader:1.16.0-1

# ===========
# Assets sync
# ===========

ENV FLEX_SOURCE_VERSION=377359e8ce6ea5b650c7eb8e36a6faf739b2f282

USER 0

RUN wget -q https://github.com/GluuFederation/flex/raw/$FLEX_SOURCE_VERSION/flex-linux-setup/flex_linux_setup/flex_schema.json -P /app/schema

# ====
# misc
# ====

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/persistence-loader" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="5.16.0-1" \
    org.opencontainers.image.title="Gluu Flex Persistence loader"

USER 1000
