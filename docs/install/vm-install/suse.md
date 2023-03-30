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

## Supported versions
- SUSE Linux Enterprise Server (SLES) 15
- openSUSE Leap 15.4
- openSUSE Tumbleweed (non-production)

## Install the Package

- Download the release package from the GitHub FLEX [Releases](https://github.com/gluufederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/vreplace-flex-version/flex-replace-flex-version-suse15.x86_64.rpm -P /tmp
```

- Install the package

```
zypper install /tmp/flex-replace-flex-version-suse15.x86_64.rpm
```

## Run the setup script

- Your organization needs to register with Gluu to trial Flex, after which you are issued a JWT you can use to install, specified by the `-admin-ui-ssa` argument.

- Run the setup script:

```
python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py -admin-ui-ssa [filename]
```

## Log in to Text User Interface (TUI)

Begin configuration by accessing the TUI with the following command:

```
/opt/jans/jans-cli/jans_cli_tui.py
```

Full TUI documentation can be found [here](https://docs.jans.io/v1.0.10/admin/config-guide/jans-tui/)

## Uninstallation

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
