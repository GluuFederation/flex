package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;

@LdapEntry
@LdapObjectClass(values = { "top", "gluuOrganization" })
public class GluuOrganization extends Entry {

    @LdapAttribute
    private String displayName;

    @LdapAttribute(name = "gluuManagerGroup")
    private List<String> managerGroups;

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getManagerGroups() {
        return managerGroups;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setManagerGroups(List<String> managerGroups) {
        this.managerGroups = managerGroups;
    }

}
