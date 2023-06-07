# Uninstallation and clean up

To remove Casa from your Gluu installation, do the following:

1. Update applications requesting `casa` acr. In case you have OpenId Connect clients requesting this acr_value, do the required changes because uninstallation will remove this acr and its corresponding custom script from your server. For instance, in oxTrust navigate to `Configuration` > `Manage Authentication` > `Default Authentication method` and update accordingly if you have selected `casa` there.

1. Login to chroot.

1. Run the cleanup utility. It will remove configurations added to your Gluu Server when Casa was installed, as well as data no  longer needed. In the chroot run:
    
    ```
    # cd /install/community-edition-setup/
    # ./casa_cleanup.py
    ```
