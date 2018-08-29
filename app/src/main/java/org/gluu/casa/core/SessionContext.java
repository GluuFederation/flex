/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.ISessionContext;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;
import java.time.ZoneOffset;
import java.util.Optional;

/**
 * @author jgomer
 */
@Named
@SessionScoped
//TODO: methods getCustdir, getCssPath, getFaviconDataUri will all be transfered after UI re-design takes place, entails editing all .zul files
public class SessionContext implements ISessionContext, Serializable {

    @Inject
    private ZKService zkService;

    private User user;

    private boolean onMobile;

    private BrowserInfo browser;

    private int screenWidth;

    private ZoneOffset zoneOffset;

    public ZoneOffset getZoneOffset() {
        return zoneOffset;
    }

    public String getCustdir() {
        return zkService.getAssetsPrefix();
    }

    public User getUser() {
        return user;
    }

    public User getLoggedUser() {
        return Optional.ofNullable(user).map(Utils::cloneObject).map(User.class::cast).orElse(null);
    }

    public boolean isOnMobile() {
        return onMobile;
    }

    public BrowserInfo getBrowser() {
        return browser;
    }

    public String getCssPath() {

        String path = "org.gluu.casa.css.";
        path += onMobile ? "mobile" : "desktop";
        //The Java variables are defined in ZK descriptor, see zk.xml
        return getCustdir() + System.getProperty(path);
    }

    public String getFaviconDataUri() {
        return zkService.getFaviconDataUri();
    }

    public int getScreenWidth() {
        return screenWidth;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setZoneOffset(ZoneOffset zoneOffset) {
        this.zoneOffset = zoneOffset;
    }

    public void setOnMobile(boolean onMobile) {
        this.onMobile = onMobile;
    }

    public void setScreenWidth(int screenWidth) {
        this.screenWidth = screenWidth;
    }

    public void setBrowser(BrowserInfo browser) {
        this.browser = browser;
    }

}
