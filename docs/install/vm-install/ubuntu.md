
# Ubuntu Flex Installation

Before you install, check the [VM system requirements](vm-requirements.md).

## Supported Versions
- Ubuntu 22.04
- Ubuntu 20.04

## Install the Package
- If the server firewall is running, make sure to disable it during installation.
  For example:
```
sudo ufw disable;
sudo ufw status;

```
- Download the GPG key zip file , unzip and import GPG key
```
wget https://github.com/GluuFederation/flex/files/11814579/automation-flex-public-gpg.zip;
unzip automation-flex-public-gpg.zip;
sudo gpg --import automation-flex-public-gpg.asc;
```

### Ubuntu 22.04

- Download the release package from the Github Gluu Flex [Releases](https://github.com/GluuFederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu22.04_amd64.deb -P /tmp

```

- Verify integrity of the downloaded package using published sha256sum.

  Download sha256sum file for the package
  
```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu22.04_amd64.deb.sha256sum  -P /tmp

```
  Check the hash if it is matching.
```
cd /tmp;
sha256sum -c flex_replace-flex-version.ubuntu22.04_amd64.deb.sha256sum

```

Output similar to below should confirm the integrity of the downloaded package.
```
flex_replace-flex-version.ubuntu22.04_amd64.deb.sha256sum: ok

```

- Install the package

```
apt install -y /tmp/flex_replace-flex-version.ubuntu22.04_amd64.deb
```

### Ubuntu 20.04

- Download the release package from the Github Gluu Flex [Releases](https://github.com/GluuFederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu20.04_amd64.deb -P /tmp
```

- Verify integrity of the downloaded package using published sha256sum.

  Download sha256sum file for the package
  
```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex_replace-flex-version.ubuntu20.04_amd64.deb.sha256sum  -P /tmp

```
  Check the hash if it is matching.
```
cd /tmp;
sha256sum -c flex_replace-flex-version.ubuntu20.04_amd64.deb.sha256sum

```

Output similar to below should confirm the integrity of the downloaded package.
```
flex_replace-flex-version.ubuntu20.04_amd64.deb.sha256sum: ok

```

- Install the package

```
apt install -y /tmp/flex_replace-flex-version.ubuntu20.04_amd64.deb
```

## Run the setup script

- Before initiating the setup please obtain an [SSA](../../install/software-statements/ssa.md) to trial Flex, after which you are issued a JWT that you can use during installation specified by the `-admin-ui-ssa` argument.

- Run the setup script:

```
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py -admin-ui-ssa [filename]
```

## Log in to Text User Interface (TUI)

Begin configuration by accessing the TUI with the following command:

```
/opt/jans/jans-cli/jans_cli_tui.py
```

Full TUI documentation can be found [here](https://docs.jans.io/stable/admin/config-guide/jans-tui/)

## Uninstallation

Removing Flex is a two step process:

1. Delete files installed by Gluu Flex
1. Remove and purge the `jans` package

Use the command below to uninstall the Gluu Flex server

```
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```
output:

```
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
<!-- I need to add the output when command is run. -->


The command below removes and uninstall the `jans` package

```
python3 /opt/jans/jans-setup/install.py -uninstall

```

<!-- I need to add the output when command is run. -->
output :

```
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
