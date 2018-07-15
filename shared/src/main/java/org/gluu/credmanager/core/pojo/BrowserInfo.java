package org.gluu.credmanager.core.pojo;

/**
 * Created by jgomer on 2018-06-27.
 */
public class BrowserInfo {

    private String name;
    private int mainVersion;
    private boolean mobile;

    public String getName() {
        return name;
    }

    public int getMainVersion() {
        return mainVersion;
    }

    public boolean isMobile() {
        return mobile;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMainVersion(int mainVersion) {
        this.mainVersion = mainVersion;
    }

    public void setMobile(boolean mobile) {
        this.mobile = mobile;
    }

}
