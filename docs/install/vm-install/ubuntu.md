
# Ubuntu Janssen Installation

Before you install, check the [VM system requirements](vm-requirements.md).

## Supported Versions
- Ubuntu 20.04

## Install the Package

- Download the release package from the Github Gluu Flex [Releases](https://github.com/GluuFederation/flex/releases)

```
wget https://github.com/GluuFederation/flex/releases/download/v5.0.0-4/flex_5.0.0-4.ubuntu20.04_amd64.deb -P ~/
```

- Verify integrity of the downloaded package by verifying published `sha256sum`.   

    Download `sha256sum` file for the package

    ```shell
    wget https://github.com/GluuFederation/flex/releases/download/v5.0.0-4/flex_5.0.0-4.ubuntu20.04_amd64.deb.sha256sum -P ~/
    ```

    Check the hash if it is matching. 

    ```shell
    sha256sum -c flex_5.0.0-4.ubuntu20.04_amd64.deb.sha256sum
    ```

    Output similar to below should confirm the integrity of the downloaded package.
    
    ```text
    <package-name>: OK
    ```

- Install the package

```
apt install -y ~/flex_5.0.0-4.ubuntu20.04_amd64.deb
```

## Run the setup script

- Run the setup script in interactive mode:

```
python3 /opt/jans/flex/flex-linux-setup/flex_setup.py
```

See more detailed [instructions](../setup.md) on the setup script if you're confused how to answer any of the questions, for details about command line arguments, or you would prefer to use a properties file instead of interactive mode.

## Ubuntu Flex Un-Installation

Removing Janssen is a two step process:

1. Delete files installed by Gluu Flex
1. Remove and purge the `jans` package

Use the command below to uninstall the Gluu Flex server

```
python3 /opt/jans/flex/flex-linux-setup/flex_setup.py --remove-flex
```

<!-- I need to add the output when command is run. -->


The command below removes and purges the `jans` package

```
apt-get --purge remove jans
```

<!-- I need to add the output when command is run. -->
