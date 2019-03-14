package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;

/**
 * Extends {@link BasePerson} in order to manipulate attributes <code>userPassword</code> and <code>oxExternalUid</code>.
 */
@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class IdentityPerson extends BasePerson {

    @LdapAttribute(name ="userPassword")
    private String password;

    @LdapAttribute
    private List<String> oxExternalUid;

    @LdapAttribute
    private List<String> oxUnlinkedExternalUids;

    public boolean hasPassword() {
        return Utils.isNotEmpty(password);
    }

    public String getPassword() {
        return password;
    }

    public List<String> getOxExternalUid() {
        return Utils.nonNullList(oxExternalUid);
    }

    public List<String> getOxUnlinkedExternalUids() {
        return Utils.nonNullList(oxUnlinkedExternalUids);
    }

    public void setPassword(String userPassword) {
        this.password = userPassword;
    }

    public void setOxExternalUid(List<String> oxExternalUid) {
        this.oxExternalUid = oxExternalUid;
    }

    public void setOxUnlinkedExternalUids(List<String> oxUnlinkedExternalUids) {
        this.oxUnlinkedExternalUids = oxUnlinkedExternalUids;
    }

}
