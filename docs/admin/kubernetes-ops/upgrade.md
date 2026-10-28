---
tags:
  - administration
  - kubernetes
  - operations
  - helm
  - upgrade
---

This guide shows how to upgrade a Gluu Flex helm deployment.

1.  Back up your deployment before you upgrade. Follow the [Backup and Restore](./backup-restore.md) guide and keep the ConfigMap, Secret, database dump, `override.yaml` and the customizations that your values mount from the cluster.

2.  `helm ls -n <namespace>`

3.  Keep note of the helm release version

4.  Add your changes to `override.yaml`

5.  Apply your upgrade:

    `helm upgrade <flex-release-name> gluu-flex/gluu -n <namespace> -f override.yaml --version=replace-flex-version`

6.  Check that your customizations still work after the upgrade. The upgrade can redeploy the stock `agama-pw` and Casa projects and overwrite changes you made to them, and a file mounted over the image hides the new image's version of that file. See [Customizations after a restore or an upgrade](./backup-restore.md#customizations-after-a-restore-or-an-upgrade).
