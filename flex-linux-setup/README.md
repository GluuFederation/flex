Flex Linux Setup
=======================

Scripts and templates to automate deployment Gluu Flex components on Janssen server,

Installing Admin UI
-----------------------

We tested installation on CentOS 8, Ubuntu 18 and Ubuntu 20.
First we need to install Janssen Server by following below two steps:
1. Download installer

   `curl https://raw.githubusercontent.com/JanssenProject/jans/main/jans-linux-setup/install.py > install.py`

2. Execute installer

   `python3 install.py`

Then Admin UI can be installed by running flex-setup script. The steps are

1. Download installer

   `curl https://raw.githubusercontent.com/GluuFederation/flex/main/flex-linux-setup/flex-setup.py > flex-setup.py`

2. Execute installer
 
   `python3 flex-setup.py`

Add/Remove Admin UI plugins
--------------------------------------

To add/remove Admin UI on vm execute -

`python3 /opt/jans/jans-setup/static/scripts/admin_ui_plugin.py`