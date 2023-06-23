---
tags:
- administration
- installation
- vm
- SUSE
- SLES
- Tumbleweed
---

# SUSE Flex Installation

Before you install, check the [VM system requirements](vm-requirements.md).

SELinux must be set to permissive in ```/etc/selinux/config```

## Supported versions
- SUSE Linux Enterprise Server (SLES) 15
- openSUSE Leap 15.4
- openSUSE Tumbleweed (non-production)

## Install the Package
- If the server firewall is running, make sure to disable it during installation.
  For example:
```
firewall-cmd --permanent --zone=public --add-service=https;
firewall-cmd --reload;
```
- Download the GPG key zip file , unzip and import GPG key
```
wget https://github.com/GluuFederation/flex/files/11814579/automation-flex-public-gpg.zip;
unzip automation-flex-public-gpg.zip;
sudo rpm -import automation-flex-public-gpg.asc;
```
- Download the release package from the GitHub FLEX [Releases](https://github.com/gluufederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex-replace-flex-version-suse15.x86_64.rpm -P ~/
```
- Verify integrity of the downloaded package using published sha256sum.

  Download sha256sum file for the package
```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex-replace-flex-version-suse15.x86_64.rpm.sha256sum  -P ~/
```
  Check the hash if it is matching.
```
sha256sum -c flex-replace-flex-version-suse15.x86_64.rpm.sha256sum
```
- Install the package

```
sudo zypper install ~/flex-replace-flex-version-suse15.x86_64.rpm
```

## Run the setup script

- Before initiating the setup please obtain an [SSA](../../install/software-statements/ssa.md) to trial Flex, after which you are issued a JWT that you can use during installation specified by the `-admin-ui-ssa` argument.

- Run the setup script:

```
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py -admin-ui-ssa [filename]
```

## Log in to Text User Interface (TUI)

Begin configuration by accessing the TUI with the following command:

```
/opt/jans/jans-cli/jans_cli_tui.py
```

Full TUI documentation can be found [here](https://docs.jans.io/stable/admin/config-guide/jans-tui)

To login admin UI
```
https://FQDN/admin
```
To login casa
```
https://FQDN/casa
```

## Uninstallation

Removing Flex is a two step process:

1. Delete files installed by Gluu Flex
1. Remove and purge the `jans` package

Use the command below to uninstall the Gluu Flex server

```
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```
output will be like this:
<!-- I need to add the output when command is run. -->
```
ec2-user@manojs1978-clear-camel:~> sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex

This process is irreversible.
Gluu Flex Components will be removed


 
Are you sure to uninstall Gluu Flex? [yes/N] yes

Profile was detected as jans.

Log Files:

/opt/jans/jans-setup/logs/flex-setup.log
/opt/jans/jans-setup/logs/flex-setup-error.log

/opt/jans/jans-setup/setup_app/pylib/jwt/utils.py:7: CryptographyDeprecationWarning: Python 3.6 is no longer supported by the Python core team. Therefore, support for it is deprecated in cryptography and will be removed in a future release.
  from cryptography.hazmat.primitives.asymmetric.ec import EllipticCurve
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
  - Deleting Gluu Flex Admin UI Client  2001.732c7b51-57c4-48a5-b64d-8718b3e043bb
  - Removing Admin UI directives from apache configuration
  - Deleting /opt/jans/jetty/jans-config-api/custom/libs/gluu-flex-admin-ui-plugin.jar
  - Removing plugin /opt/jans/jetty/jans-config-api/custom/libs/gluu-flex-admin-ui-plugin.jar from Jans Config API Configuration
  - Deleting /opt/jans/jetty/jans-config-api/custom/config/log4j2-adminui.xml
  - Deleting /opt/jans/jetty/jans-config-api/custom/config/log4j2.xml
  - Rewriting Jans CLI init file for plugins
  - Deleting /srv/www/htdocs/admin
Disabling script A51E-76DA
Restarting Apache
Restarting Jans Auth
Restarting Janssen Config Api
```

The command below removes and uninstall the `jans` package

```
sudo python3 /opt/jans/jans-setup/install.py -uninstall
```
output will be like this:
<!-- I need to add the output when command is run. -->
```
ec2-user@manojs1978-clear-camel:~> sudo python3 /opt/jans/jans-setup/install.py -uninstall

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
Executing rm -r -f /etc/certs
Executing rm -r -f /etc/jans
Executing rm -r -f /opt/jans
Executing rm -r -f /opt/amazon-corretto*
Executing rm -r -f /opt/jre
Executing rm -r -f /opt/node*
Executing rm -r -f /opt/jetty*
Executing rm -r -f /opt/jython*
Executing rm -r -f /opt/dist
Removing /etc/apache2/vhosts.d/_https_jans.conf
```
