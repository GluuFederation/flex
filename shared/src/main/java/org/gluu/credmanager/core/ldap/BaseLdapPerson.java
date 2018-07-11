package org.gluu.credmanager.core.ldap;

import com.unboundid.ldap.sdk.DN;
import com.unboundid.ldap.sdk.ReadOnlyEntry;
import com.unboundid.ldap.sdk.persist.*;
import org.gluu.credmanager.misc.Utils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * This class provides an implementation of an object that can be used to
 * represent gluuPerson objects in the directory.
 */
@LDAPObject(structuralClass="gluuPerson",
        superiorClass="top")
public class BaseLdapPerson {

    // The field to use to hold a read-only copy of the associated entry.
    @LDAPEntryField()
    private ReadOnlyEntry ldapEntry;

    // The field used for RDN attribute ou.
    @LDAPField(inRDN=true,
            filterUsage= FilterUsage.ALWAYS_ALLOWED,
            requiredForEncode=true)
    private String[] inum;

    // The field used for optional attribute uid.
    @LDAPField()
    private String[] uid;

    /**
     * Retrieves the first value for the field associated with the
     * inum attribute, if present.
     *
     * @return  The first value for the field associated with the
     *          inum attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public String getInum()
    {
        if ((inum == null) ||
                (inum.length == 0))
        {
            return null;
        }
        else
        {
            return inum[0];
        }
    }

    /**
     * Retrieves the first value for the field associated with the
     * uid attribute, if present.
     *
     * @return  The first value for the field associated with the
     *          uid attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public String getUid()
    {
        if ((uid== null) ||
                (uid.length == 0))
        {
            return null;
        }
        else
        {
            return uid[0];
        }
    }

}
