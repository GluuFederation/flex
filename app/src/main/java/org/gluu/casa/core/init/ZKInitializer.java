/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.init;

import org.gluu.casa.core.ZKService;
import org.gluu.casa.misc.Utils;
import org.zkoss.zk.ui.WebApp;
import org.zkoss.zk.ui.util.WebAppInit;

/**
 * @author jgomer
 */
public class ZKInitializer implements WebAppInit {

    public void init(WebApp webApp) throws Exception {
        Utils.managedBean(ZKService.class).init(webApp);
    }

}
