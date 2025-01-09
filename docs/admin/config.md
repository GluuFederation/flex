# Configuring Gluu Flex

## Overview

After installing, there are four primary strategies to configure Gluu Flex.

## Text-based User Interface (TUI)

The current recommendation is to use the Janssen TUI to configure Flex components. The TUI calls the Config API to perform ad hoc configuration, and instructions can be found in the Janssen [documentation here.](https://docs.jans.io/head/janssen-server/config-guide/config-tools/jans-tui/)

## CURL Commands

As an alternative, the Config API can be called directly using [CURL commands.](https://docs.jans.io/head/janssen-server/config-guide/config-tools/curl-guide/)

## Command Line Interface (CLI)

If needed, a command-line alternative to the TUI is available. Instructions can be found in the Janssen [documentation here.](https://docs.jans.io/head/janssen-server/config-guide/config-tools/jans-cli/)

## Admin UI

The Gluu Flex Admin UI is a reactive web interface to simplify the management and configuration of your Auth Server. The Admin UI enables you to easily view and edit configuration properties, interception scripts, clients, and metrics in one place. The Admin UI can be accessed by accessing the hostname set during installation in the browser.
