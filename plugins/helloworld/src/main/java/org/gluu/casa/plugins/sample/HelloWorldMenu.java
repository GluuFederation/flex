/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.sample;

import org.gluu.credmanager.extension.navigation.MenuType;
import org.gluu.credmanager.extension.navigation.NavigationMenu;

/**
 * A class implementing the {@link NavigationMenu} extension point.
 * @author jgomer
 */
public class HelloWorldMenu implements NavigationMenu {

    public String getContentsUrl() {
        return "menu.zul";
    }

    public MenuType menuType() {
        return MenuType.USER;
    }

    public float getPriority() {
        return 0.5f;
    }

}
