package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

@DataEntry
@ObjectClass(values = { "top", "oxTrustConfiguration" })
public class oxTrustConfiguration extends Entry {

    @AttributeName
    private String oxTrustConfApplication;

    @AttributeName
    private String oxTrustConfCacheRefresh;

    public String getOxTrustConfApplication() {
        return oxTrustConfApplication;
    }

    public String getOxTrustConfCacheRefresh() {
        return oxTrustConfCacheRefresh;
    }

    public void setOxTrustConfApplication(String oxTrustConfApplication) {
        this.oxTrustConfApplication = oxTrustConfApplication;
    }

    public void setOxTrustConfCacheRefresh(String oxTrustConfCacheRefresh) {
        this.oxTrustConfCacheRefresh = oxTrustConfCacheRefresh;
    }

}
