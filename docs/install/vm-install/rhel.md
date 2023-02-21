---
tags:
- administration
- installation
- vm
- RHEL
- CentOS
---

# Red Hat EL Flex Installation

Before you install, check the [VM system requirements](vm-requirements.md).

## Supported versions
- Red Hat Enterprise Linus 8 (RHEL 8)

## Disable SELinux
You can disbale SELinux temporarily by executing `setenforce 0`. To disable permanently edit file `/etc/selinux/config`.

## Install the Package


- Download the release package from the Github Flex
  [Releases](https://github.com/gluufederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/v5.0.0-4/flex-5.0.0-4.el8.x86_64.rpm -P ~/
```
  
- Install the package

```
yum install ~/flex-5.0.0-4.el8.x86_64.rpm
```

## Run the setup script

- Run the setup script in interactive mode:

```
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py
```

## RHEL Flex Uninstallation

Removing Flex is a two step process:

1. Delete files installed by Gluu Flex
1. Remove and purge the `jans` package

Use the command below to uninstall the Gluu Flex server

```
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```

<!-- I need to add the output when command is run. -->


The command below removes and uninstall the `jans` package

```
python3 /opt/jans/jans-setup/install.py -uninstall

```

<!-- I need to add the output when command is run. -->
