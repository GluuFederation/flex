package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * @author jgomer
 */
public class OxdClientSettings {

    private String oxdId;
    private String clientId;
    private String clientSecret;
    private String clientName;

    public OxdClientSettings() {
        //Do not remove
    }

    public OxdClientSettings(String clientName, String oxdId, String clientId, String clientSecret) {

        this.clientName = clientName;
        this.oxdId = oxdId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public String getOxdId() {
        return oxdId;
    }

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public String getClientId() {
        return clientId;
    }

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public String getClientSecret() {
        return clientSecret;
    }

    public String getClientName() {
        return clientName;
    }

}
