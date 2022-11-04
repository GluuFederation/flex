Flex Linux Setup
=======================

Scripts and templates to automate deployment Gluu Flex components on Janssen server.
Currently Gluu Flex has three components: Admin UI, Janssen and Casa.

Installing Gluu Flex
-----------------------

Currently, installation is supported on CentOS 8 and Ubuntu 20.

If you installed Janssen server before, the script will install additional Gluu Flex Components. If Janssen isn't already installed, the script will do so.

1. Download installer

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex_linux_setup/flex_setup.py > flex_setup.py`

2. Execute installer
 
   `python3 flex_setup.py`

    If you have `setup.properties` file and want to automate installation, you can pass properties file as
    `python3 flex_setup.py -f /path/to/setup.properties -n -c`

    Minimal example setup.properties file:
    ```
    ip=10.146.197.201
    hostname=flex.gluu.org
    orgName=Gluu
    admin_email=flex@gluu.org
    city=Austing
    state=Texas
    countryCode=US
    installLdap=True
    admin_password=MyAdminPassword
    ldapPass=MyLdapPassword
    casa_client_id=3000.7986c837-2a8f-4c31-9c63-1bd2f6abce77
    casa_client_pw=MyCasaClientSecret
    ```

Add/Remove Admin UI plugins
--------------------------------------

To add/remove Admin UI, on vm execute -

1. Download script

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex_linux_setup/flex-plugin.py -O /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`

2. Execute
    `python3 /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`

The available plugins can be downloaded from https://jenkins.gluu.org/npm/admin_ui/<git-branch-name>