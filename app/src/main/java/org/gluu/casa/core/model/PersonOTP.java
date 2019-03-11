package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;

@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class PersonOTP extends BasePerson {

    @LdapAttribute(name ="oxExternalUid")
    private List<String> externalUids;

    @LdapAttribute(name = "oxOTPDevices")
    private String OTPDevices;

    public List<String> getExternalUids() {
        return Utils.nonNullList(externalUids);
    }

    public String getOTPDevices() {
        return OTPDevices;
    }

    public void setExternalUids(List<String> v) {
        this.externalUids = v;
    }

    public void setOTPDevices(String OTPDevices) {
        this.OTPDevices = OTPDevices;
    }

}
