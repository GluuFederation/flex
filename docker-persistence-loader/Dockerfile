FROM ghcr.io/janssenproject/jans/persistence-loader:0.0.0-nightly

# ===========
# Assets sync
# ===========

ENV FLEX_SOURCE_VERSION=47eabba59972b236ac3bc6dda1b738186b467585

USER 0

RUN wget -q https://github.com/GluuFederation/flex/raw/$FLEX_SOURCE_VERSION/flex-linux-setup/flex_linux_setup/flex_schema.json -P /app/schema

# ====
# misc
# ====

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/persistence-loader" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="0.0.0-nightly" \
    org.opencontainers.image.title="Gluu Flex Persistence loader"

USER 1000
