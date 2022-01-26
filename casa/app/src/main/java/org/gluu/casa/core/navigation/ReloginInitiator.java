package org.gluu.casa.core.navigation;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.gluu.casa.core.AuthFlowContext;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.OIDCFlowService;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.util.Pair;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.util.Initiator;

public class ReloginInitiator implements Initiator {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void doInit(Page page, Map<String, Object> map) throws Exception {

        try {
            logger.info("Forcing re-login");
            List<String> acrs = Collections.singletonList(ConfigurationHandler.DEFAULT_ACR);
            Pair<String, String> pair = Utils.managedBean(OIDCFlowService.class).getAuthnRequestUrl(acrs, "login");

            Utils.managedBean(AuthFlowContext.class).setState(pair.getY());
            WebUtils.execRedirect(pair.getX());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
