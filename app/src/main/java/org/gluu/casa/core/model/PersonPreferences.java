package org.gluu.casa.core.model;

import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class PersonPreferences extends BasePerson {

    @LdapAttribute(name = "oxPreferredMethod")
    private String preferredMethod;

    @LdapAttribute(name = "oxStrongAuthPolicy")
    private String strongAuthPolicy;

    @LdapAttribute(name = "oxTrustedDevicesInfo")
    private String trustedDevices;

    public String getPreferredMethod() {
        return preferredMethod;
    }

    public String getStrongAuthPolicy() {
        return strongAuthPolicy;
    }

    public String getTrustedDevices() {
        return trustedDevices;
    }

    public void setPreferredMethod(String preferredMethod) {
        this.preferredMethod = preferredMethod;
    }

    public void setStrongAuthPolicy(String strongAuthPolicy) {
        this.strongAuthPolicy = strongAuthPolicy;
    }

    public void setTrustedDevices(String trustedDevicesInfo) {
        this.trustedDevices = trustedDevicesInfo;
    }

}
