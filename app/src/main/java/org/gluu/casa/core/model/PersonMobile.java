package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;

@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class PersonMobile extends BasePerson {

    @LdapAttribute(name = "oxMobileDevices")
    private String mobileDevices;

    @LdapAttribute
    private List<String> mobile;

    public String getMobileDevices(){
        return mobileDevices;
    }

    public List<String> getMobile() {
        return Utils.nonNullList(mobile);
    }

    public void setMobileDevices(String v)
    {
        this.mobileDevices = v;
    }

    public void setMobile(List<String> v)
    {
        this.mobile = v;
    }

}
