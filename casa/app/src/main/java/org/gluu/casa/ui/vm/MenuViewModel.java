package org.gluu.casa.ui.vm;

import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.gluu.casa.ui.MenuService;
import org.gluu.casa.ui.vm.user.UserMainViewModel;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.select.annotation.WireVariable;

import java.util.List;

/**
 * @author jgomer
 */
public class MenuViewModel extends UserMainViewModel {

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

    @Init(superclass = true)
    //When using superclass = true, note child class's initial method should not override parent class's initial method
    public void childChildInit() {
        authnMethods = isHas2faRequisites() ? getWidgets() : getPre2faMethods();
        pluginMenuItems = menuService.getMenusOfType(MenuType.USER);
    }

}
