package org.gluu.casa.core.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.List;

@DataEntry
@ObjectClass("oxAuthClient")
public class OIDCClient extends InumEntry {

    @AttributeName(name = "oxAuthPostLogoutRedirectURI")
    private String postLogoutURI;

    @AttributeName(name = "oxAuthScope")
    private List<String> scopes;

    public String getPostLogoutURI() {
        return postLogoutURI;
    }

    public List<String> getScopes() {
        return scopes;
    }

    public void setPostLogoutURI(String postLogoutURI) {
        this.postLogoutURI = postLogoutURI;
    }

    public void setScopes(List<String> scopes) {
        this.scopes = scopes;
    }

}
