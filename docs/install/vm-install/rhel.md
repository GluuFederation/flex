---
tags:
- administration
- installation
- vm
- RHEL
- CentOS
---

# Install Gluu Flex On Red Hat EL

This is a step-by-step guide for installation and uninstallation of Gluu Flex on Red Hat Enterprise Linux.

## Prerequisites
- Ensure that the OS platform is one of the [supported versions](./vm-requirements.md#supported-versions)
- VM should meet [VM system requirements](./vm-requirements.md)
- Make sure that if `SELinux` is installed then it is 
[put into permissive mode](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/using_selinux/index#selinux-states-and-modes_getting-started-with-selinux)
- If the server firewall is running, make sure you allow `https`, which is
  needed for OpenID and FIDO.
```shell
sudo firewall-cmd --permanent --zone=public --add-service=https
```
```shell
sudo firewall-cmd --reload;
```
- Install EPEL and mod-auth-openidc as dependencies
```shell
sudo yum -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-$(rpm -E %rhel).noarch.rpm
```
```shell
sudo yum -y module enable mod_auth_openidc;
```
- Please obtain an [SSA](../../install/agama/prerequisites.md#software-statement-assertions) to trial Flex, after which you are issued a JWT
  that you can use during installation. SSA should be stored in a text file on an accessible path.

## Install the Package

### Download and Verify the Release Package
- Download the release package from the Github Flex
  [Releases](https://github.com/gluufederation/flex/releases)
```shell
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex-replace-flex-version-stable.el8.x86_64.rpm -P /tmp
```
- GPG key is used to ensure the authenticity of the downloaded package during the installation process. If the key is
  not found, the [installation step](#install-the-release-package) would fail. Use the commands below to download and
  import the GPG key.
```shell
wget https://github.com/GluuFederation/flex/files/11814579/automation-flex-public-gpg.zip
```
```shell
unzip automation-flex-public-gpg.zip
```
```shell
sudo rpm -import automation-flex-public-gpg.asc
```


Verify integrity of the downloaded package by verifying published `sha256sum`.  
    
  * Go to the [Flex Project Releases page](https://github.com/gluufederation/flex/releases) and copy the `sha256sum` value for the `flex-replace-flex-version-stable.el8.x86_64.rpm` file:
  * Replace `paste-release-sha256sum` in the command below with the actual checksum you copied from the release page, and run the following command:
      ```bash title="Command"
      echo 'paste-release-sha256sum flex-replace-flex-version-stable.el8.x86_64.rpm' | sed 's/^sha256://' > flex-replace-flex-version-stable.el8.x86_64.rpm.sha256sum && sha256sum -c flex-replace-flex-version-stable.el8.x86_64.rpm.sha256sum
      ```
  * Output similar to below should confirm the integrity of the downloaded package.
    ```bash title="Command"
    flex-replace-flex-version-stable.el8.x86_64.rpm: OK
    ```

### Install the Release Package
```shell
sudo yum install ./flex-replace-flex-version-stable.el8.x86_64.rpm
```

## Run the setup script
Execute the setup script with command below:
```
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py
```

```text
Install Admin UI [Y/n]: y

```

## Verify and Access the Installation
Verify that installation has been successful and all installed components are accessible using the steps below

- Log in to Text User Interface (TUI)
```shell
/opt/jans/jans-cli/jans_cli_tui.py
```
Full TUI documentation can be found [here](https://docs.jans.io/head/janssen-server/config-guide/config-tools/jans-tui/)

- Log into Admin-UI using URI below
```text
https://FQDN/admin
```
After successful installation of the Admin-UI component, we need to upload the required SSA input as a file path.
This should be the SSA or file that was acquired as part of [prerequisite step](#prerequisites).

When troubleshooting issues with Admin UI access, it's advisable to check the [logs](../../admin/admin-ui/logs.md), refer to the [FAQ](../../admin/admin-ui/faq.md), and review [service dependencies](../../admin/admin-ui/introduction.md/#flex-services-dependencies) for potential solutions.

- Access Casa using URI below
```text
https://FQDN/jans-casa
```
## Enabling HTTPS 
To enable communication with Janssen Server over TLS (https) in a production 
environment, Janssen Server needs details about CA certificate. Update the 
HTTPS cofiguration file `https_jans.conf` as shown below:

!!! Note
    Want to use `Let's Encrypt` to get a certificate? Follow [this guide](../../openbanking/install-vm.md#importing-the-ca-certificate-in-jvm-truststore-and-signing-encryption-keys-into-auth-server-keystore).
- Open `https_jans.conf` 
  ```bash
  sudo vi /etc/httpd/conf.d/https_jans.conf
  ```
- Update `SSLCertificateFile` and `SSLCertificateKeyFile` parameters values
  ```bash
  SSLCertificateFile location_of_fullchain.pem
  SSLCertificateKeyFile location_of_privkey.pem
  ```
- Restart `httpd` service for changes to take effect
  ```bash
  sudo service httpd restart
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
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```
Output:
```text
[ec2-user@manojs1978-lenient-drum ~]$ sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex

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
  - Deleting Gluu Flex Admin UI Client  2001.931e814d-01e2-4983-898f-91bf93670f7b
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
sudo python3 /opt/jans/jans-setup/install.py -uninstall
```
Output:
```text
[ec2-user@manojs1978-lenient-drum ~]$ sudo python3 /opt/jans/jans-setup/install.py -uninstall

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
Removing /etc/httpd/conf.d/https_jans.conf
```
### Remove Gluu Flex Packages:
List existing Gluu packages with:
```shell
sudo yum list installed | grep flex
```
Remove packages:
```shell
sudo yum remove <package-name>
```

### Uninstalling Admin UI

To uninstall the Admin UI from your Flex installation, execute this command:

```shell
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```

### Updating Admin UI

To update the Admin UI in an existing Flex installation, execute this command:

```shell
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --update-admin-ui
```
