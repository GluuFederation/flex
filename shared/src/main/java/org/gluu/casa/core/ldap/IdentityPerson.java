package org.gluu.casa.core.ldap;

import com.unboundid.ldap.sdk.persist.FilterUsage;
import com.unboundid.ldap.sdk.persist.LDAPField;
import com.unboundid.ldap.sdk.persist.LDAPObject;
import org.gluu.casa.misc.Utils;

@LDAPObject(structuralClass="gluuPerson",
        superiorClass="top")
public class IdentityPerson extends BaseLdapPerson {

    // The field used for optional attribute userPassword.
    @LDAPField
    private String[] userPassword;

    // The field used for optional attribute oxExternalUid.
    @LDAPField(filterUsage= FilterUsage.ALWAYS_ALLOWED)
    private String[] oxExternalUid;

    // The field used for optional attribute oxUnlinkedExternalUids.
    @LDAPField(filterUsage=FilterUsage.ALWAYS_ALLOWED)
    private String[] oxUnlinkedExternalUids;

    public boolean hasPassword() {
        return Utils.isNotEmpty(userPassword);
    }

    /**
     * Retrieves the values for the field associated with the
     * oxExternalUid attribute, if present.
     *
     * @return  The values for the field associated with the
     *          oxExternalUid attribute, or
     *          {@code null} if that attribute was not present in the entry.
     */
    public String[] getOxExternalUid()
    {
        return oxExternalUid;
    }

    /**
     * Retrieves the values for the field associated with the
     * oxUnlinkedExternalUids attribute, if present.
     *
     * @return  The values for the field associated with the
     *          oxUnlinkedExternalUids attribute, or
     *          {@code null} if that attribute was not present in the entry.
     */
    public String[] getOxUnlinkedExternalUids()
    {
        return oxUnlinkedExternalUids;
    }

    /**
     * Sets the values for the field associated with the
     * oxExternalUid attribute.
     *
     * @param  v  The values for the field associated with the
     *            oxExternalUid attribute.
     */
    public void setOxExternalUid(final String... v)
    {
        this.oxExternalUid = v;
    }

    /**
     * Sets the values for the field associated with the
     * oxExternalUid attribute.
     *
     * @param  v  The values for the field associated with the
     *            oxExternalUid attribute.
     */
    public void setOxUnlinkedExternalUids(final String... v)
    {
        this.oxUnlinkedExternalUids = v;
    }

    /**
     * Sets the values for the field associated with the
     * userPassword attribute.
     *
     * @param  v  The values for the field associated with the
     *            userPassword attribute.
     */
    public void setPassword(final String ...v)
    {
        this.userPassword = v;
    }

}

