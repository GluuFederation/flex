FROM ghcr.io/janssenproject/jans/persistence-loader:0.0.0-nightly

# ===========
# Assets sync
# ===========

ENV FLEX_SOURCE_VERSION=bf613b218d35a722e2dc4c3c6250f60c4077ba05

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
