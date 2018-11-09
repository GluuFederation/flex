/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui.vm;

import org.gluu.casa.core.AuthFlowContext;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.core.SessionContext;
import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.gluu.casa.misc.WebUtils;
import org.gluu.casa.ui.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class HeaderViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private OxdService oxdService;

    @WireVariable
    private AuthFlowContext authFlowContext;

    @WireVariable
    private MenuService menuService;

    @WireVariable
    private SessionContext sessionContext;

    private List<Pair<String, NavigationMenu>> contextMenuItems;

    public List<Pair<String, NavigationMenu>> getContextMenuItems() {
        return contextMenuItems;
    }

    @Init
    public void init() {
        contextMenuItems = menuService.getMenusOfType(MenuType.AUXILIARY);
    }

    @Command
    public void logoutFromAuthzServer() {

        try {
            //When the session expires, the browser is taken to /session-expired.zul (see zk.xml), so theoretically, the
            //calls to session-scoped method above will not yield null
            logger.trace("Log off attempt for {}", sessionContext.getUser().getUserName());

            //After End-User has logged out, the Client might request to log him out of the OP too
            String idToken = authFlowContext.getIdToken();
            Executions.sendRedirect(oxdService.getLogoutUrl(idToken));

            //Kill session
            Optional.ofNullable(WebUtils.getServletRequest().getSession(false)).ifPresent(HttpSession::invalidate);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
