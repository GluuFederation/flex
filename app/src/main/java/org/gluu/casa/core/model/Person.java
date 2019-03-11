package org.gluu.casa.core.model;

import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;

@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class Person extends BasePerson {

    @LdapAttribute
    private String givenName;

    @LdapAttribute(name = "sn")
    private String surname;

    // The field used for optional attribute sn.
    @LdapAttribute(name = "oxEnrollmentCode")
    private String enrollmentCode;

    @LdapAttribute
    private List<String> memberOf;

    public String getGivenName() {
        return givenName;
    }

    public String getSurname() {
        return surname;
    }

    public String getEnrollmentCode() {
        return enrollmentCode;
    }

    public List<String> getMemberOf() {
        return memberOf;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setEnrollmentCode(String enrollmentCode) {
        this.enrollmentCode = enrollmentCode;
    }

    public void setMemberOf(List<String> memberOf) {
        this.memberOf = memberOf;
    }

}
