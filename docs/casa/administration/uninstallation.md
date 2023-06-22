# Uninstall Gluu Casa

Follow the steps below to remove Casa from your Gluu Flex Server installation:

1. Update acr: Uninstallation will remove `casa` acr and its corresponding custom script from your server.
So, before you uninstall Casa, update the acr value if it is set to `casa`. In case you have OpenId Connect clients 
requesting this acr_value they you'll need to update their configuration. Also, check if the default authentication 
method is set to `casa`. Do this using Admin-UI <TODO> 

1. Login to chroot.

1. Run the cleanup utility. It will remove configurations added to your Gluu Flex Server when Casa was installed, 
as well as any data which is no longer needed. In the chroot run:
    
    ```
    # cd /install/community-edition-setup/
    # ./casa_cleanup.py
    ```
