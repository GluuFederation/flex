package org.gluu.casa.plugins.consent.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.Entry;

@DataEntry
@ObjectClass("oxAuthToken")
public class Token extends Entry {

    @AttributeName
    private String oxAuthTokenCode;

    @AttributeName
    private String oxAuthClientId;

    @AttributeName
    private String oxAuthTokenType;

    @AttributeName
    private String oxAuthUserId;

    public String getOxAuthTokenCode() {
        return oxAuthTokenCode;
    }

    public String getOxAuthClientId() {
        return oxAuthClientId;
    }

    public String getOxAuthTokenType() {
        return oxAuthTokenType;
    }

    public String getOxAuthUserId() {
        return oxAuthUserId;
    }

    public void setOxAuthTokenCode(String oxAuthTokenCode) {
        this.oxAuthTokenCode = oxAuthTokenCode;
    }

    public void setOxAuthClientId(String v) {
        this.oxAuthClientId = v;
    }

    public void setOxAuthTokenType(String v) {
        this.oxAuthTokenType = v;
    }

    public void setOxAuthUserId(String oxAuthUserId) {
        this.oxAuthUserId = oxAuthUserId;
    }

}
