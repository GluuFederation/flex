#!/usr/bin/env bash
set -e

# ======================================================================================================================
# INSTALL FLEX
# PASSED VARS:
# FLEX_SOURCE_VERSION: Specifies the exact commit version to build off of
# CN_HOSTNAME : hostname i.e test.gluu.org
# CN_ORG_NAME : Organization name i.e Janssen
# CN_EMAIL: i.e support@gluu.org
# CN_CITY: i.e Austin
# CN_STATE: i.e TX
# CN_COUNTRY: i.e US
# CN_ADMIN_PASS: LDAP or MYSQL and ADMIN user password
# INSTALL_LDAP
# CN_INSTALL_CONFIG_API
# CN_INSTALL_SCIM
# CN_INSTALL_CLIENT_API
# CN_INSTALL_CASA
# CN_INSTALL_ADMIN_UI
# MYSQL_DATABASE
# MYSQL_USER
# MYSQL_PASSWORD
# ======================================================================================================================

IS_FLEX_DEPLOYED=/flex/deployed
# Functions
install_flex() {
  echo "*****   Writing properties!!   *****"
  echo "hostname=${CN_HOSTNAME}" | tee -a setup.properties > /dev/null
  # shellcheck disable=SC2016
  echo "admin_password=${CN_ADMIN_PASS}" | tee -a setup.properties > /dev/null
  echo "orgName=${CN_ORG_NAME}" | tee -a setup.properties > /dev/null
  echo "admin_email=${CN_EMAIL}" | tee -a setup.properties > /dev/null
  echo "city=${CN_CITY}" | tee -a setup.properties > /dev/null
  echo "state=${CN_STATE}" | tee -a setup.properties > /dev/null
  echo "countryCode=${CN_COUNTRY}" | tee -a setup.properties > /dev/null
  # shellcheck disable=SC2016
  echo "ldapPass=${CN_ADMIN_PASS}" | tee -a setup.properties > /dev/null
  echo "installLdap=""$([[ ${INSTALL_LDAP} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "install_config_api=""$([[ ${CN_INSTALL_CONFIG_API} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "install_scim_server=""$([[ ${CN_INSTALL_SCIM} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "installFido2=""$([[ ${CN_INSTALL_FIDO2} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "install_client_api=""$([[ ${CN_INSTALL_CLIENT_API} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "install-admin-ui=""$([[ ${CN_INSTALL_ADMIN_UI} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "install-casa=""$([[ ${CN_INSTALL_CASA} == true ]] && echo True || echo False)" | tee -a setup.properties > /dev/null
  echo "adminui-authentication-mode=casa" | tee -a setup.properties > /dev/null

  if [[ "${INSTALL_LDAP}" == "false" ]]; then
    echo "rdbm_install=2" | tee -a setup.properties > /dev/null
    echo "rdbm_install_type=2" | tee -a setup.properties > /dev/null
    echo "rdbm_db=${MYSQL_DATABASE}" | tee -a setup.properties > /dev/null
    echo "rdbm_user=${MYSQL_USER}" | tee -a setup.properties > /dev/null
    echo "rdbm_password=${MYSQL_PASSWORD}" | tee -a setup.properties > /dev/null
    echo "rdbm_type=mysql" | tee -a setup.properties > /dev/null
    echo "rdbm_host=${MYSQL_HOST}" | tee -a setup.properties > /dev/null
  fi

  echo "*****   Running the setup script for ${CN_ORG_NAME}!!   *****"
  echo "*****   PLEASE NOTE THAT THIS MAY TAKE A WHILE TO FINISH. PLEASE BE PATIENT!!   *****"
  echo "*****   Installing Gluu Flex..."
  curl https://raw.githubusercontent.com/GluuFederation/flex/"${FLEX_SOURCE_VERSION}"/flex-linux-setup/flex_linux_setup/flex_setup.py > flex_setup.py
  python3 flex_setup.py -f setup.properties --flex-non-interactive
  echo "*****   Setup script completed!!    *****"

}

check_installed_flex() {
  if [ -f "$IS_FLEX_DEPLOYED" ]; then
    echo "Flex has already been installed. Starting services..."
  else
    install_flex 2>&1 | tee setup_log || exit 1
    mkdir flex
    touch "$IS_FLEX_DEPLOYED"
  fi
}

register_fqdn() {
    if [[ "${IS_FQDN_REGISTERED}" == "true" ]]; then
      certbot --apache -d "${CN_HOSTNAME}" -n --agree-tos --email "${CN_EMAIL}" || echo "FQDN was not registered with cerbot"
    fi
}
start_services() {
  /etc/init.d/apache2 start
  /opt/dist/scripts/jans-auth start
  /opt/dist/scripts/jans-client-api start
  /opt/dist/scripts/jans-config-api start
  /opt/dist/scripts/jans-fido2 start
  /opt/dist/scripts/jans-scim start
  /opt/dist/scripts/casa start
}

check_installed_flex
start_services
register_fqdn

tail -f /opt/jans/jetty/jans-auth/logs/*.log \
-f /opt/jans/jetty/jans-client-api/logs/*.log \
-f /opt/jans/jetty/jans-config-api/logs/*.log \
-f /opt/jans/jetty/jans-fido2/logs/*.log \
-f /opt/jans/jetty/jans-scim/logs/*.log \
-f /opt/jans/jetty/casa/logs/*.log


