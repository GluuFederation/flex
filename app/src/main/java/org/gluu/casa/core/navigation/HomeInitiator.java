/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.core.navigation;

import org.gluu.casa.core.AuthFlowContext;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.OxdService;
import org.gluu.casa.core.SessionContext;
import org.gluu.casa.core.UserService;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.Page;
import org.zkoss.zk.ui.util.Initiator;

import java.util.Map;

import static org.gluu.casa.core.AuthFlowContext.RedirectStage.*;

/**
 * This is a ZK Page Initiator (the doInit method is called before any rendering of UI components). It's the initiator
 * associated to the /index.zul URL (home URL) so here's where the authentication flow is handled.
 * @author jgomer
 */
public class HomeInitiator extends CommonInitiator implements Initiator {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private AuthFlowContext flowContext;
    private OxdService oxdService;

    public void doInit(Page page, Map<String, Object> map) throws Exception {

        super.doInit(page, map);
        if (page.getAttribute("error") == null) {

            flowContext = Utils.managedBean(AuthFlowContext.class);
            oxdService = Utils.managedBean(OxdService.class);
            try {
                switch (flowContext.getStage()) {
                    case NONE:
                        try {
                            goForAuthorization();
                        } catch (Exception e) {
                            String error = "An error occurred during authorization step";
                            setPageErrors(page, error, e.getMessage());
                            logger.error(error, e);
                        }
                        break;
                    case INITIAL:
                        //If IDP response contains error query parameter we cannot proceed
                        if (errorsParsed(page)) {
                            flowContext.setStage(NONE);
                        } else {
                            String code = WebUtils.getQueryParam("code");
                            if (code == null) {
                                //This may happen when user did not ever entered his username at IDP, and tries accessing the app again
                                goForAuthorization();
                            } else {
                                Pair<String, String> tokens = oxdService.getTokens(code, WebUtils.getQueryParam("state"));
                                String accessToken = tokens.getX();
                                String idToken = tokens.getY();
                                logger.debug("Authorization code={}, Access token={}, Id token {}", code, accessToken, idToken);

                                User user = Utils.managedBean(UserService.class).getUserFromClaims(oxdService.getUserClaims(accessToken));
                                //Store in session
                                logger.debug("Adding user to session");
                                Utils.managedBean(SessionContext.class).setUser(user);
                                flowContext.setIdToken(idToken);
                                flowContext.setStage(BYPASS);
                                flowContext.setHasSessionAtOP(true);
                                //This flow continues at index.zul
                            }
                        }
                        break;
                    case BYPASS:
                        //go straight without the need for showing UI
                        logger.debug("Taking user to homepage...");
                        WebUtils.execRedirect(WebUtils.USER_PAGE_URL);
                        break;
                    default:
                        //Added to pass style checker
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                setPageErrors(page, Labels.getLabel("general.error.general"), e.getMessage());
                flowContext.setStage(NONE);
            }

        }
    }

    //Redirects to an authorization URL obtained with OXD
    private void goForAuthorization() throws Exception {
        flowContext.setStage(INITIAL);
        logger.debug("Starting authorization flow");
        //do Authz Redirect
        WebUtils.execRedirect(oxdService.getAuthzUrl(ConfigurationHandler.DEFAULT_ACR));
    }

    private boolean errorsParsed(Page page) {

        String error = WebUtils.getQueryParam("error");
        boolean errorsFound = error != null;
        if (errorsFound) {
            setPageErrors(page, error, WebUtils.getQueryParam("error_description"));
        }
        return errorsFound;

    }

}
