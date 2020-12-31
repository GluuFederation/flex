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
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.select.annotation.WireVariable;

import java.util.List;

/**
 * @author jgomer
 */
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

    public void logoutFromAuthzServer() {

        try {
            //When the session expires, the browser is automatically taken to /session-expired.zul (see zk.xml), so
            //in theory, the call below will not yield NPE, and authFlowContext.isHasSessionAtOP() is always true
            logger.trace("Log off attempt for {}", sessionContext.getUser().getUserName());

            //After End-User has logged out, the Client might request to log him out of the OP too
            String idToken = authFlowContext.getIdToken();
            Executions.sendRedirect(oxdService.getLogoutUrl(idToken));

            //Kill session
            WebUtils.invalidateSession(WebUtils.getServletRequest());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
