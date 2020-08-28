package org.gluu.casa.plugins.credentials.extensions;

import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.pf4j.Extension;


/**
 * @author madhumita
 *
 */
@Extension
public class BioidMenu implements NavigationMenu {

    public String getContentsUrl() {
        return "menu.zul";
    }

    public MenuType menuType() {
        return MenuType.USER;
    }

    public float getPriority() {
        return 0.8f;
    }

}
