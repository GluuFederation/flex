/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.extension.navigation;

/**
 * An enumeration with the different types of menus that can be extended in Gluu Casa.
 * @author jgomer
 */
public enum MenuType {
    /**
     * The menu shown in the administrator's dashboard
     */
    ADMIN_CONSOLE,
    /**
     * The menu shown top-right (where "Help" and "Logout" are)
     */
    AUXILIARY,
    /**
     * The menu used by all users of the application (shown on the left of UI pages)
     */
    USER
}
