package org.gluu.casa.core;

import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.ISessionContext;

import javax.enterprise.context.SessionScoped;
import javax.inject.Named;
import java.io.Serializable;
import java.time.ZoneOffset;
import java.util.Optional;

/**
 * @author jgomer
 */
@Named
@SessionScoped
public class SessionContext implements ISessionContext, Serializable {

    private User user;

    private boolean onMobile;

    private BrowserInfo browser;

    private int screenWidth;

    private ZoneOffset zoneOffset;

    public ZoneOffset getZoneOffset() {
        return zoneOffset;
    }

    public User getUser() {
        return user;
    }

    public User getLoggedUser() {
        return Optional.ofNullable(user).map(Utils::cloneObject).map(User.class::cast).orElse(null);
    }

    public BrowserInfo getBrowser() {
        return browser;
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

    public void setScreenWidth(int screenWidth) {
        this.screenWidth = screenWidth;
    }

    public void setBrowser(BrowserInfo browser) {
        this.browser = browser;
    }

}
