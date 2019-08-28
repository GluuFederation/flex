package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

@DataEntry
@ObjectClass("oxTrustConfiguration")
public class oxTrustConfiguration extends Entry {

    @AttributeName
    private String oxTrustConfApplication;

    public String getOxTrustConfApplication() {
        return oxTrustConfApplication;
    }

    public void setOxTrustConfApplication(String oxTrustConfApplication) {
        this.oxTrustConfApplication = oxTrustConfApplication;
    }

}
