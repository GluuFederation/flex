package org.gluu.casa.core.navigation;

import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.util.Initiator;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * @author jgomer
 */
public class ReloginInitiator implements Initiator {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void doInit(Page page, Map<String, Object> map) throws Exception {

        try {
            //logger.info("Forcing logout from the OP");
            //WebUtils.execRedirect(Utils.managedBean(OxdService.class).getLogoutUrl(null));
            logger.info("Forcing re-login");
            List<String> acrs = Collections.singletonList(ConfigurationHandler.DEFAULT_ACR);
            WebUtils.execRedirect(Utils.managedBean(OxdService.class).getAuthzUrl(acrs, "login"));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
