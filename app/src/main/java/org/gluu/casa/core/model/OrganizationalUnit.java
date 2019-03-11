package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

@LdapEntry
@LdapObjectClass(values = { "top", "organizationalUnit" })
public class OrganizationalUnit extends Entry {

    @LdapAttribute
    private String ou;

    public void setOu(String ou) {
        this.ou = ou;
    }

}
