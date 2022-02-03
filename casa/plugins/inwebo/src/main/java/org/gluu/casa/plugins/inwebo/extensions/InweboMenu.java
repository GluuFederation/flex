package org.gluu.casa.plugins.inwebo.extensions;

import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.pf4j.Extension;

/**
 * An extension class implementing the {@link NavigationMenu} extension point. 
 * @author jgomer
 */
@Extension
public class InweboMenu implements NavigationMenu 
{

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
