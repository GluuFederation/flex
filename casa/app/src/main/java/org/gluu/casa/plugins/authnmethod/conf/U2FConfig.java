package org.gluu.casa.plugins.authnmethod.conf;

/**
 * @author jgomer
 */
public class U2FConfig {

    private String appId;

    private String endpointUrl;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getEndpointUrl() {
        return endpointUrl;
    }

    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }

}
