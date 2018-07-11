/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.credmanager.ui.vm;

import org.gluu.credmanager.core.SessionContext;
import org.gluu.credmanager.core.UserService;
import org.gluu.credmanager.core.pojo.BrowserInfo;
import org.gluu.credmanager.core.pojo.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.*;
import org.zkoss.json.JSONObject;
import org.zkoss.zk.au.out.AuInvoke;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.time.ZoneOffset;
import java.util.Optional;

/**
 * This class is employed to store in session some user settings
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class HomeViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private SessionContext sessionContext;

    @Init
    public void init() {
        Clients.response(new AuInvoke("sendBrowserData"));
    }

    @AfterCompose
    public void afterCompose(@ContextParam(ContextType.VIEW) Component view) {
        Selectors.wireEventListeners(view, this);
    }

    @Listen("onData=#message")
    public void notified(Event evt) {

        Optional<JSONObject> opt = Optional.ofNullable(evt.getData()).map(JSONObject.class::cast);
        if (opt.isPresent()) {
            JSONObject jsonObject = opt.get();
            logger.info("Browser data is {} ", jsonObject.toJSONString());

            boolean mobile = Executions.getCurrent().getBrowser("mobile") != null;
            logger.trace("Detected browser is {} mobile", mobile ? "" : "not");

            updateOffset(jsonObject.get("offset"));
            if (mobile) {
                updateMobile(jsonObject.get("screenWidth"));
            }
            updateBrowserInfo(jsonObject.get("name"), jsonObject.get("version"), mobile);
        }
        sessionContext.updateCssPath();
        //reloads this page so the navigation flow proceeds (see HomeInitiator class)

        //TODO: re-adjust (added oxauth went crazy)
        User user = new User();
        user.setAdmin(true);
        user.setPreferredMethod("twilio_sms");
        user.setId("@!3245.DF39.6A34.9E97!0001!513A.9888!0000!A8F2.DE1E.D7FB");
        user.setUserName("admin");
        user.setGivenName("amin");
        sessionContext.setUser(user);

        //Executions.sendRedirect(null);

    }

    private void updateOffset(Object value) {

        try {
            if (sessionContext.getZoneOffset() == null) {
                int offset = (int) value;
                ZoneOffset zoffset = ZoneOffset.ofTotalSeconds(offset);
                sessionContext.setZoneOffset(zoffset);
                logger.trace("Time offset for session is {}", zoffset.toString());
                //Ideally zone should be associated to something like "America/Los_Angeles", not a raw offset like "GMT+0010"
                //but this is not achievable unless the user is asked to directly provide his zone
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private void updateMobile(Object width) {

        try {
            int w = (int) width;
            sessionContext.setScreenWidth(w);
            //This attrib should be in the session, but it's more comfortable at the desktop level for testing purposes
            sessionContext.setOnMobile(w < 992);    //If screen is wide enough, behave as desktop
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private void updateBrowserInfo(Object browserName, Object browserVersion, boolean mobile) {

        try {
            if (sessionContext.getBrowser() == null) {
                BrowserInfo binfo = new BrowserInfo();
                sessionContext.setBrowser(binfo);

                binfo.setMobile(mobile);
                binfo.setName(browserName.toString());

                String version = browserVersion.toString();
                int browserVer = version.indexOf(".");
                if (browserVer > 0) {
                    browserVer = Integer.parseInt(version.substring(0, browserVer));
                }
                binfo.setMainVersion(browserVer);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
