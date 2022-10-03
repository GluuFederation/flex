FROM ubuntu:22.04

# Don't start any optional services except for the few we need.
RUN find /etc/systemd/system \
    /lib/systemd/system \
    -path '*.wants/*' \
    -not -name '*journald*' \
    -not -name '*systemd-tmpfiles*' \
    -not -name '*systemd-user-sessions*' \
    -exec rm \{} \;

# Disable list of suggested/ recommended dependencies
RUN echo 'APT::Install-Suggests "0";' >> /etc/apt/apt.conf.d/00-docker \
    && echo 'APT::Install-Recommends "0";' >> /etc/apt/apt.conf.d/00-docker

# Prevent prompt errors during package installation
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update \
    && apt-get install -y python3 tini curl ca-certificates dbus systemd iproute2 gpg python3-pip python3-dev libpq-dev gcc \
    && apt-get clean \
    # Cleaning up package lists
    && rm -rf /var/lib/apt/lists/*


RUN systemctl set-default multi-user.target \
    && systemctl mask dev-hugepages.mount sys-fs-fuse-connections.mount

# Workaround agetty high CPU. https://bugzilla.redhat.com/show_bug.cgi?id=1046469
RUN rm -f /lib/systemd/system/systemd*udev* \
    && rm -f /lib/systemd/system/getty.target

HEALTHCHECK --interval=35s --timeout=4s CMD /opt/dist/scripts/jans-auth check | grep "Jetty running pid" || exit 1

# Ports required by jetty
EXPOSE 443 8080 1636

# =====================
# flex-linux-setup
# =====================

ENV FLEX_SOURCE_VERSION=a07c08d31ce74de706914cfbb967881a0846a61d

# cleanup
RUN rm -rf /tmp/jans

# ======
# Python
# ======
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -U pip wheel \
    && pip3 install --no-cache-dir -r /app/requirements.txt \
    && pip3 uninstall -y pip wheel

# =======
# License
# =======

COPY LICENSE /licenses/LICENSE

# ==========
# SETUP ENVS
# ==========

ENV CN_HOSTNAME="demoexample.gluu.org" \
    CN_ADMIN_PASS="" \
    CN_ORG_NAME="Janssen" \
    CN_EMAIL="support.gluu.org" \
    CN_CITY="Austin" \
    CN_STATE="TX" \
    CN_COUNTRY="US" \
    # Install with local mysql by default
    INSTALL_LDAP="false" \
    CN_INSTALL_CONFIG_API="true" \
    CN_INSTALL_SCIM="true" \
    CN_INSTALL_FIDO2="true" \
    CN_INSTALL_CLIENT_API="true" \
    CN_INSTALL_CASA="true" \
    CN_INSTALL_ADMIN_UI="true" \
    MYSQL_DATABASE="gluu" \
    MYSQL_USER="gluu" \
    MYSQL_PASSWORD=""

# ==========
# misc stuff
# ==========

LABEL name="gluufederation/flex-monolith" \
    maintainer="GluuFederation <support@gluu.org>" \
    vendor="GluuFederation" \
    version="5.0.0" \
    release="dev" \
    summary="GluuFederation Flex Monolith Image" \
    description="Janssen Authorization server + Casa + AdminUI"

COPY scripts /app/scripts
RUN chmod +x /app/scripts/entrypoint.sh

CMD ["/bin/bash", "-c", "exec /app/scripts/entrypoint.sh --log-target=journal 3>&1"]
