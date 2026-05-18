FROM ghcr.io/janssenproject/jans/persistence-loader:2.1.0-1

# ===========
# Assets sync
# ===========

ENV FLEX_SOURCE_VERSION=fb97e1d4b6e0bd272fc99996e413bee52c1edc72

USER 0

RUN wget -q https://github.com/GluuFederation/flex/raw/$FLEX_SOURCE_VERSION/flex-linux-setup/flex_linux_setup/flex_schema.json -P /app/schema

# ====
# misc
# ====

LABEL org.opencontainers.image.url="ghcr.io/gluufederation/flex/persistence-loader" \
    org.opencontainers.image.authors="Gluu Inc. <team@gluu.org>" \
    org.opencontainers.image.vendor="Gluu Federation" \
    org.opencontainers.image.version="6.1.0-1" \
    org.opencontainers.image.title="Gluu Flex Persistence loader"

USER 1000
