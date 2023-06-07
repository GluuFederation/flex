# Installation 
Thanks for your interest in Casa! Follow the instructions below to spin up an instance of Casa to offer end-users self-service 2FA and more for their account(s) in your Gluu Server.

View screenshots in the [User Guide](../user-guide.md).
 
## Installation via Linux Packages 

Casa is offered as one of the several components of the Gluu Server CE. To include Casa in your instance, just ensure to check it when prompted at [installation](https://gluu.org/docs/gluu-server/4.4/installation-guide/) time.

To add Casa post-install do the following:

1. Login to chroot
1. `cd /install/community-edition-setup`
1. Run `./setup.py --install-casa`


**Important notes:**

- Account for **1GB of additional RAM** than you use in a standard CE installation. See [Gluu Server system requirements](https://gluu.org/docs/gluu-server/4.4/installation-guide/#system-requirements)

- It is required your installation was configured to use a FQDN for hostname, not an IP address

- Apache and oxAuth are required components

- Ensure your server has "dynamic registration" of clients enabled and that "returnClientSecretOnRead" is set to *true*. These settings can be reverted once your Casa installation is fully operational 

- Casa requires [oxd](https://gluu.org/docs/oxd) 4.x to operate. Ideally you would use a ready-to-use external oxd server (its location is prompted upon installation); if you don't have such a server, please select `oxd` from the selection Menu, then oxd-server will be installed for you locally. 

## Finish setup

After installation, you can access the application at `https://<host>/casa`. 

For the first time the application will try to register an OpenID Connect client via oxd. If this operation fails due to network problems or SSL cert issues, login will not work. Please refer to the [FAQ](./faq.md#oxd) for troubleshooting.

!!! Note 
    To change the default URL path for Casa follow the steps listed [here](change-context-path.md). It is advisable to apply this customization **before** credentials are enrolled. 

### Unlocking admin features

Recall admin capabilities are disabled by default. To unlock admin features follow these steps:

1. Navigate inside chroot to `/opt/gluu/jetty/casa/`
1. Create an empty file named `.administrable` (ie. `touch .administrable`)
1. Run `chown casa:casa .administrable` (do this only if you are on FIPS environment)
1. Logout in case you have an open browser session

!!! Warning
    Once you have configured, tailored, and tested your deployment thoroughly, you are strongly encouraged to remove the marker file. This will prevent problems in case a user can escalate privileges or if some administrative account is compromised.

<!--
### A word on security

In a clustered or containerized deployment, admin features and user features should run on different nodes. It is responsibility of the administrator to enable admin features on a specific (small) set of nodes and make those publically inaccessible, for instance, by removing them from the load balancer.
-->
