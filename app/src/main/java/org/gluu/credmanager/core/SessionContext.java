/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core;

import org.gluu.credmanager.core.pojo.BrowserInfo;
import org.gluu.credmanager.core.pojo.User;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;
import java.time.ZoneOffset;

/**
 * @author jgomer
 */
@Named
@SessionScoped
public class SessionContext implements Serializable {

    @Inject
    private ZKService zkService;

    private User user;

    private String custdir;

    private String cssPath;

    private boolean onMobile;

    private BrowserInfo browser;

    private int screenWidth;

    private ZoneOffset zoneOffset;

    private String logoDataUri;

    private String faviconDataUri;

    @PostConstruct
    private void inited() {

        //these 3 variables are fixed during the whole session no matter if a different thing was specified later via admin UI
        custdir = zkService.getAssetsPrefix();
        logoDataUri = zkService.getLogoDataUri();
        faviconDataUri = zkService.getFaviconDataUri();
        updateCssPath();

    }

    public void updateCssPath() {
        String path = "org.gluu.credmanager.css.";
        path += onMobile ? "mobile" : "desktop";
        //The Java variables are defined in ZK descriptor, see zk.xml
        path = custdir + System.getProperty(path);
        setCssPath(path);

    }

    public ZoneOffset getZoneOffset() {
        return zoneOffset;
    }

    public String getCustdir() {
        return custdir;
    }

    public User getUser() {
        return user;
    }

    public boolean getOnMobile() {
        return onMobile;
    }

    public BrowserInfo getBrowser() {
        return browser;
    }

    public String getCssPath() {
        return cssPath;
    }

    public String getLogoDataUri() {
        return logoDataUri;
    }

    public String getFaviconDataUri() {
        return faviconDataUri;
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

    public void setCssPath(String cssPath) {
        this.cssPath = cssPath;
    }

    public void setScreenWidth(int screenWidth) {
        this.screenWidth = screenWidth;
    }

    public void setBrowser(BrowserInfo browser) {
        this.browser = browser;
    }

}
