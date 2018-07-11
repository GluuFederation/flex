/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.ui.vm.admin;

import org.gluu.credmanager.conf.MainSettings;
import org.gluu.credmanager.core.ConfigurationHandler;
import org.gluu.credmanager.core.ExtensionsManager;
import org.gluu.credmanager.extension.navigation.MenuType;
import org.gluu.credmanager.extension.navigation.NavigationMenu;
import org.gluu.credmanager.misc.UIUtils;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.ui.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.util.List;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("configurationHandler")
    private ConfigurationHandler confHandler;

    @WireVariable
    private MenuService menuService;

    private List<Pair<String,NavigationMenu>> extraButtons;

    private String subpage;

    public String getSubpage() {
        return subpage;
    }

    public List<Pair<String,NavigationMenu>> getExtraButtons() {
        return extraButtons;
    }

    @Init
    public void init() {
        extraButtons = menuService.getMenusOfType(MenuType.ADMIN_CONSOLE);
    }

    /**
     * Changes the page loaded in the content area. Also sets values needed in the UI (these are taken directly from
     * calls to AdminService's getConfigSettings method.
     * @param page The (string) url of the page that must be loaded (by default /admin/default.zul is being shown)
     */
    @Command
    @NotifyChange({"subpage"})
    public void loadSubPage(@BindingParam("page") String page) {
        subpage = page;
    }

    public MainSettings getSettings() {
        return confHandler.getSettings();
    }

    boolean updateMainSettings(String sucessMessage) {

        boolean success = false;
        try {
            //update app-level config and persist
            getSettings().save();
            if (sucessMessage == null) {
                UIUtils.showMessageUI(true);
            } else {
                Messagebox.show(sucessMessage, null, Messagebox.OK, Messagebox.INFORMATION);
            }
            success = true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            UIUtils.showMessageUI(false, Labels.getLabel("adm.conffile_error_update"));
        }
        return success;

    }

    boolean updateMainSettings() {
        return updateMainSettings(null);
    }

}
