package org.gluu.casa.plugins.consent;

import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.pf4j.Extension;

/**
 * Allows markup to be added to user navigation menu
 * @author jgomer
 */
@Extension
public class AuthorizedClientsMenu implements NavigationMenu {

    public String getContentsUrl() {
        return "menu.zul";
    }

    public MenuType menuType() {
        return MenuType.USER;
    }

    public float getPriority() {
        return 0.1f;
    }

}
