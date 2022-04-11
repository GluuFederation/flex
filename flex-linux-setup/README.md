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

Add/Remove Admin UI plugins
--------------------------------------

To add/remove Admin UI, on vm execute -

1. Download script

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex_linux_setup/flex-plugin.py -O /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`

2. Execute
    `python3 /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`
