package org.gluu.casa.core.ldap;

import com.unboundid.ldap.sdk.DN;
import com.unboundid.ldap.sdk.persist.LDAPField;
import com.unboundid.ldap.sdk.persist.LDAPObject;
import org.gluu.casa.misc.Utils;

import java.util.List;

/**
 * This class provides an implementation of an object that can be used to
 * represent gluuPerson objects in the directory.
 */
@LDAPObject(structuralClass="gluuPerson",
        superiorClass="top")
public class Person extends BaseLdapPerson {

    // The field used for optional attribute givenName.
    @LDAPField
    private String[] givenName;

    // The field used for optional attribute sn.
    @LDAPField
    private String[] sn;

    // The field used for optional attribute sn.
    @LDAPField
    private String[] oxEnrollmentCode;

    // The field used for optional attribute gluuManagerGroup.
    @LDAPField
    private DN[] memberOf;

    /**
     * Retrieves the first value for the field associated with the
     * givenName attribute, if present.
     *
     * @return  The first value for the field associated with the
     *          givenName attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public String getFirstGivenName() {
        if ((givenName == null) ||
                (givenName.length == 0)) {
            return null;
        } else {
            return givenName[0];
        }
    }

    /**
     * Retrieves the values for the field associated with the
     * givenName attribute, if present.
     *
     * @return  The values for the field associated with the
     *          givenName attribute, or
     *          {@code null} if that attribute was not present in the entry.
     */
    public List<String> getGivenNames()
    {
        return Utils.listfromArray(givenName);
    }

    /**
     * Retrieves the first value for the field associated with the
     * sn attribute, if present.
     *
     * @return  The first value for the field associated with the
     *          sn attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public String getFirstSn()
    {
        if ((sn == null) ||
                (sn.length == 0))
        {
            return null;
        }
        else
        {
            return sn[0];
        }
    }

    public List<String> getSns() {
        return Utils.listfromArray(sn);
    }

    public List<DN> getMemberOfDNs() {
        return Utils.listfromArray(memberOf);
    }

    /**
     * Retrieves the first value for the field associated with the
     * oxEnrollmentCode attribute, if present.
     *
     * @return  The first value for the field associated with the
     *          oxEnrollmentCode attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public String getEnrollmentCode()
    {
        if ((oxEnrollmentCode == null) ||
                (oxEnrollmentCode.length == 0))
        {
            return null;
        }
        else
        {
            return oxEnrollmentCode[0];
        }
    }

    /**
     * Sets the values for the field associated with the
     * oxEnrollmentCode attribute.
     *
     * @param  v  The values for the field associated with the
     *            oxEnrollmentCode attribute.
     */
    public void setEnrollmentCode(final String... v)
    {
        this.oxEnrollmentCode = v;
    }

}
