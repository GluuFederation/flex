package org.gluu.casa.plugins.consent.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;
import io.jans.orm.model.base.Entry;

import org.gluu.casa.misc.Utils;

import java.util.List;

@DataEntry
@ObjectClass("oxClientAuthorization")
public class ClientAuthorization extends Entry {

    @AttributeName
    private String oxAuthClientId;

    @AttributeName(name = "oxAuthScope")
    private List<String> scopes;

    @AttributeName(name = "oxAuthUserId")
    private String userId;

    public String getOxAuthClientId() {
        return oxAuthClientId;
    }

    public List<String> getScopes() {
        return Utils.nonNullList(scopes);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setOxAuthClientId(String v) {
        this.oxAuthClientId = v;
    }

    public void setScopes(List<String> scopes) {
        this.scopes = scopes;
    }

}
