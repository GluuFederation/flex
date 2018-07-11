/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.ui.vm;

import org.gluu.credmanager.core.UserService;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.extension.navigation.MenuType;
import org.gluu.credmanager.extension.navigation.NavigationMenu;
import org.gluu.credmanager.ui.MenuService;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.List;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class MenuViewModel {

    @WireVariable
    UserService userService;

    @WireVariable
    private MenuService menuService;

    private List<Pair<String, NavigationMenu>> pluginMenuItems;

    private List<AuthnMethod> authnMethods;

    public List<Pair<String, NavigationMenu>> getPluginMenuItems() {
        return pluginMenuItems;
    }

    public List<AuthnMethod> getAuthnMethods() {
        return authnMethods;
    }

    @Init
    public void init() {
        authnMethods = userService.getLiveAuthnMethods();
        pluginMenuItems = menuService.getMenusOfType(MenuType.USER);
    }

}
