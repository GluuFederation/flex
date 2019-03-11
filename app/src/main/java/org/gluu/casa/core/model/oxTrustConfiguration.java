package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

@LdapEntry
@LdapObjectClass(values = { "top", "oxTrustConfiguration" })
public class oxTrustConfiguration extends Entry {

    @LdapAttribute
    private String oxTrustConfApplication;

    @LdapAttribute
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
