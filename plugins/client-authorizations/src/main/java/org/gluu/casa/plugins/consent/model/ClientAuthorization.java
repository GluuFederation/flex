package org.gluu.casa.plugins.consent.model;

import org.gluu.casa.misc.Utils;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.Entry;

import java.util.List;

@DataEntry
@ObjectClass(values = { "top", "oxAuthClient" })
public class ClientAuthorization extends Entry {

    @AttributeName
    private String oxAuthClientId;

    @AttributeName(name = "oxAuthScope")
    private List<String> scopes;

    public String getOxAuthClientId() {
        return oxAuthClientId;
    }

    public List<String> getScopes() {
        return Utils.nonNullList(scopes);
    }

    public void setOxAuthClientId(String v) {
        this.oxAuthClientId = v;
    }

    public void setScopes(List<String> scopes) {
        this.scopes = scopes;
    }

}
