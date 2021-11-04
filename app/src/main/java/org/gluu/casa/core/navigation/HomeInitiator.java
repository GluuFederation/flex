package org.gluu.casa.core.navigation;

import com.nimbusds.oauth2.sdk.ErrorObject;

import java.util.Map;

import org.gluu.casa.core.AuthFlowContext;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.OIDCFlowService;
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

import static org.gluu.casa.core.AuthFlowContext.RedirectStage.*;

/**
 * This is a ZK Page Initiator (the doInit method is called before any rendering of UI components). It's the initiator
 * associated to the /index.zul URL (home URL) so here's where the authentication flow is handled.
 */
public class HomeInitiator extends CommonInitiator implements Initiator {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private AuthFlowContext flowContext;
    private OIDCFlowService oidcFlowService;

    public void doInit(Page page, Map<String, Object> map) throws Exception {

        super.doInit(page, map);
        if (page.getAttribute("error") != null)
            return;

        flowContext = Utils.managedBean(AuthFlowContext.class);
        oidcFlowService = Utils.managedBean(OIDCFlowService.class);
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
                    //If OP response contains error query parameter we cannot proceed
                    Pair<String, ErrorObject> result = oidcFlowService.validateAuthnResponse(
                            WebUtils.getServletRequest().getRequestURI(), flowContext.getState());
                    flowContext.setState(null);
                    ErrorObject error = result.getY();

                    if (error != null) {
                        flowContext.setStage(NONE);
                        setPageErrors(page, error.getCode(), error.getDescription());
                        return;
                    }
                    //TODO: check what happens when user did not ever entered his username at IDP, and tries accessing the app again

                    Pair<Pair<String, String>, ErrorObject> tokenResult = oidcFlowService.getTokens(result.getX());
                    error = result.getY();

                    if (error != null ) {
                        //TODO: set flow stage ?
                        setPageErrors(page, error.getCode(), error.getDescription());
                        return;
                    }
                    
                    String accessToken = tokenResult.getX().getX();
                    String idToken = tokenResult.getX().getY();
                    //logger.debug("Access token={}, Id token {}", accessToken, idToken);

                    Pair<Map<String, Object>, ErrorObject> claimsResult = oidcFlowService.getUserClaims(accessToken);
                    error = result.getY();

                    if (error != null) {
                        //TODO: set flow stage ?
                        setPageErrors(page, error.getCode(), error.getDescription());
                        return;
                    }
                    
                    User user = Utils.managedBean(UserService.class).getUserFromClaims(claimsResult.getX());
                    //Store in session
                    logger.debug("Adding user to session");
                    Utils.managedBean(SessionContext.class).setUser(user);
                    flowContext.setIdToken(idToken);
                    flowContext.setStage(BYPASS);
                    flowContext.setHasSessionAtOP(true);
                    //This flow continues at index.zul

                    break;
                case BYPASS:
                    //go straight without the need for showing UI
                    logger.debug("Taking user to homepage...");
                    WebUtils.execRedirect(WebUtils.USER_PAGE_URL);
                    break;
            }
        } catch (Exception e) {
            //TODO: is this catch needed?
            logger.error(e.getMessage(), e);
            setPageErrors(page, Labels.getLabel("general.error.general"), e.getMessage());
            flowContext.setStage(NONE);
        }

    }

    //Redirects to an authorization URL obtained with OXD
    private void goForAuthorization() throws Exception {
        flowContext.setStage(INITIAL);
        logger.debug("Starting authorization flow");
        //do Authz Redirect
        Pair<String, String> pair = oidcFlowService.getAuthnRequestUrl(ConfigurationHandler.DEFAULT_ACR);
        //TODO: process null response
        flowContext.setState(pair.getY());
        WebUtils.execRedirect(pair.getX());
    }

}
