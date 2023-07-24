---
tags:
- administration
- installation
- vm
- Ubuntu
---

# Install Gluu Flex On Ubuntu Linux

This is a step-by-step guide for installation and uninstallation of Gluu Flex on Ubuntu Linux

## Prerequisites

- Ensure that the OS platform is one of the [supported versions](./vm-requirements.md#supported-versions)
- VM should meet [VM system requirements](./vm-requirements.md)
- Make sure that if `SELinux` is installed then it is put into permissive mode
- If the server firewall is running, make sure you allow `https`, which is
  needed for OpenID and FIDO.
```shell
sudo ufw allow https
```
- Please obtain an [SSA](../../install/software-statements/ssa.md) to trial Flex, after which you are issued a JWT
  that you can use during installation. SSA should be stored in a text file on an accessible path.

## Install the Package

### Download and Verify the Release Package

- Download the release package from the GitHub FLEX [Releases](https://github.com/gluufederation/flex/releases). Choose
the correct command from below based on the OS version.
```shell
#Ubuntu 22.04
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu22.04_amd64.deb -P /tmp
```
```shell
#Ubuntu 20.04
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu20.04_amd64.deb -P /tmp
```

- GPG key is used to ensure the authenticity of the downloaded package during the installation process. If the key is
  not found, the [installation step](#install-the-release-package) would fail. Use the commands below to download and
  import the GPG key.
```shell
wget https://github.com/GluuFederation/flex/files/11814579/automation-flex-public-gpg.zip
```
```shell
unzip automation-flex-public-gpg.zip;
```
```shell
sudo gpg --import automation-flex-public-gpg.asc;
```

- Verify the integrity of the downloaded package using published `sha256sum`. Download the `sha256sum` file for the 
package.  Choose the correct command from below based on the OS version.
```shell
#Ubuntu 22.04
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu22.04_amd64.deb.sha256sum  -P /tmp
```
```shell
#Ubuntu 20.04
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu20.04_amd64.deb.sha256sum  -P /tmp
```
Verify package integrity of the package that has been downloaded by checking hash.
Run the command below from the directory where the downloaded package and the `.sha256sum` files are located.
Choose the correct command from below based on the OS version.
```shell
#Ubuntu 22.04
sha256sum -c flex_replace-flex-version.ubuntu22.04_amd64.deb.sha256sum
```
```shell
#Ubuntu 20.04
sha256sum -c flex_replace-flex-version.ubuntu20.04_amd64.deb.sha256sum
```
Output similar to below should confirm the integrity of the downloaded package.
```shell
flex_replace-flex-version.ubuntu<version>_amd64.deb: ok
```

### Install the Release Package

Choose the correct command from below based on the OS version.

```shell
#Ubuntu 22.04
apt install -y ./flex_replace-flex-version.ubuntu22.04_amd64.deb
```
```shell
#Ubuntu 20.04
apt install -y ./flex_replace-flex-version.ubuntu20.04_amd64.deb
```

### Run the setup script

Execute the setup script with command below:
```shell
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py
```
If Admin-UI component is being installed, then the script will require SSA input, either as text or as a file path.
This should be the SSA or file which was acquired as part of [prerequisite step](#prerequisites).
```text
Install Admin UI [Y/n]: y
Please enter path of file containing SSA or paste SSA (q to exit):
```
Alternatively, for SSA file can be passed as a parameter to the setup script as below.
```shell
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py -admin-ui-ssa [filename]
```

## Verify and Access the Installation

Verify that installation has been successful and all installed components are accessible using the steps below:

- Log in to Text User Interface (TUI)
```shell
/opt/jans/jans-cli/jans_cli_tui.py
```
[TUI](https://docs.jans.io/stable/admin/config-guide/jans-tui) is a text-based configuration tool for Gluu Flex Server.

- Log into Admin-UI using URI below
```text
https://FQDN/admin
```

- Access Casa using URI below
```text
https://FQDN/casa
```

## Uninstallation
Removing Flex is a two step process:

- [Uninstall Gluu Flex](#uninstall-gluu-flex)
- [Uninstall Janssen Packages](#uninstall-janssen-packages)

If you have not run the setup script, you can skip step 1 and just remove
the package.

### Uninstall Gluu Flex
Use the command below to uninstall the Gluu Flex server
```shell
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```
Output:
```text
root@manojs1978-cute-ram:~# python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex

This process is irreversible.
Gluu Flex Components will be removed


 
Are you sure to uninstall Gluu Flex? [yes/N] yes

Profile was detected as jans.

Log Files:

/opt/jans/jans-setup/logs/flex-setup.log
/opt/jans/jans-setup/logs/flex-setup-error.log

Please wait while collecting properties...
Uninstalling Gluu Casa
  - Deleting /etc/default/casa
  - Deleting /etc/systemd/system/casa.service
  - Removing casa directives from apache configuration
  - Deleting /opt/jans/jetty/jans-auth/custom/libs/casa-config.jar
  - Removing plugin /opt/jans/jetty/jans-auth/custom/libs/casa-config.jar from Jans Auth Configuration
  - Deleting /opt/jans/python/libs/Casa.py
  - Deleting /opt/jans/python/libs/casa-external_fido2.py
  - Deleting /opt/jans/python/libs/casa-external_otp.py
  - Deleting /opt/jans/python/libs/casa-external_super_gluu.py
  - Deleting /opt/jans/python/libs/casa-external_twilio_sms.py
  - Deleting casa client from db backend
  - Deleting casa client scopes from db backend
  - Deleting casa configuration from db backend
  - Deleting script 3000-F75A from db backend
  - Deleting /opt/jans/jetty/casa
Uninstalling Gluu Admin-UI
  - Deleting Gluu Flex Admin UI Client  2001.e7989c7e-09b5-4e39-a7c9-a78017127cf0
  - Removing Admin UI directives from apache configuration
  - Deleting /opt/jans/jetty/jans-config-api/custom/libs/gluu-flex-admin-ui-plugin.jar
  - Removing plugin /opt/jans/jetty/jans-config-api/custom/libs/gluu-flex-admin-ui-plugin.jar from Jans Config API Configuration
  - Deleting /opt/jans/jetty/jans-config-api/custom/config/log4j2-adminui.xml
  - Deleting /opt/jans/jetty/jans-config-api/custom/config/log4j2.xml
  - Rewriting Jans CLI init file for plugins
  - Deleting /var/www/html/admin
Disabling script A51E-76DA
Restarting Apache
Restarting Jans Auth
Restarting Janssen Config Api
```

### Uninstall Janssen Packages
The command below removes and uninstall the `jans` package
```shell
python3 /opt/jans/jans-setup/install.py -uninstall
```
Output :
```text
root@manojs1978-cute-ram:~# python3 /opt/jans/jans-setup/install.py -uninstall

This process is irreversible.
You will lose all data related to Janssen Server.


 
Are you sure to uninstall Janssen Server? [yes/N] yes

Uninstalling Jannsen Server...
Removing /etc/default/jans-config-api
Stopping jans-config-api
Removing /etc/default/jans-auth
Stopping jans-auth
Removing /etc/default/jans-fido2
Stopping jans-fido2
Removing /etc/default/jans-scim
Stopping jans-scim
Removing /etc/default/jans-cache-refresh
Stopping jans-cache-refresh
Stopping OpenDj Server
Stopping Server...
[23/Jun/2023:09:10:27 +0000] category=BACKEND severity=NOTICE msgID=370 msg=The backend userRoot is now taken offline
[23/Jun/2023:09:10:28 +0000] category=BACKEND severity=NOTICE msgID=370 msg=The backend site is now taken offline
[23/Jun/2023:09:10:28 +0000] category=BACKEND severity=NOTICE msgID=370 msg=The backend metric is now taken offline
[23/Jun/2023:09:10:28 +0000] category=CORE severity=NOTICE msgID=203 msg=The Directory Server is now stopped
Executing rm -r -f /etc/certs
Executing rm -r -f /etc/jans
Executing rm -r -f /opt/jans
Executing rm -r -f /opt/amazon-corretto*
Executing rm -r -f /opt/jre
Executing rm -r -f /opt/node*
Executing rm -r -f /opt/jetty*
Executing rm -r -f /opt/jython*
Executing rm -r -f /opt/opendj
Executing rm -r -f /opt/dist
Removing /etc/apache2/sites-enabled/https_jans.conf
Removing /etc/apache2/sites-available/https_jans.conf
```

### Remove Gluu Flex Packages:
List existing Gluu Flex packages with:
```shell
sudo apt list --installed | grep flex
```
Remove packages:
```shell
sudo apt remove <package name>
```