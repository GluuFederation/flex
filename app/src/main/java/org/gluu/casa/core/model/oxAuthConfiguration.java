package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

@LdapEntry
@LdapObjectClass(values = { "top", "oxAuthConfiguration" })
public class oxAuthConfiguration extends Entry {

    @LdapAttribute
    private String oxAuthConfDynamic;

    @LdapAttribute
    private String oxAuthConfStatic;

    public String getOxAuthConfDynamic() {
        return oxAuthConfDynamic;
    }

    public String getOxAuthConfStatic() {
        return oxAuthConfStatic;
    }

    public void setOxAuthConfDynamic(String oxAuthConfDynamic) {
        this.oxAuthConfDynamic = oxAuthConfDynamic;
    }

    public void setOxAuthConfStatic(String oxAuthConfStatic) {
        this.oxAuthConfStatic = oxAuthConfStatic;
    }

}
