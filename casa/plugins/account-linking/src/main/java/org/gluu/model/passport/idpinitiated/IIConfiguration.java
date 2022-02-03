package org.gluu.model.passport.idpinitiated;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IIConfiguration {

    private OIDCDetails openidclient;
    private List<AuthzParams> authorizationParams=new ArrayList<>();

    public OIDCDetails getOpenidclient() {
        return openidclient;
    }

    public void setOpenidclient(OIDCDetails openidclient) {
        this.openidclient = openidclient;
    }

    public List<AuthzParams> getAuthorizationParams() {
        return authorizationParams;
    }

    public void setAuthorizationParams(List<AuthzParams> authorizationParams) {
        this.authorizationParams = authorizationParams;
    }

}
