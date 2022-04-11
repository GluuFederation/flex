Flex Linux Setup
=======================

Scripts and templates to automate deployment Gluu Flex components on Janssen server.
Currenlty Gluu Flex has two components: Admin UI and Casa

Installing Gluu Flex
-----------------------

We tested installation on CentOS 8 and Ubuntu 20.

If you installed Janssen server before, the script will just install Gluu Flex Components, otherwise
it first installs Janssen server, then install Gluu Flex Components

1. Download installer

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex_linux_setup/flex_setup.py > flex_setup.py`

2. Execute installer
 
   `python3 flex_setup.py`

Add/Remove Admin UI plugins
--------------------------------------

To add/remove Admin UI on vm execute -

1. Download script

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex_linux_setup/flex-plugin.py -O /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`

2. Execute
    `python3 /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`
