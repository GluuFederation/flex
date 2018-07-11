/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core.ldap;

import com.unboundid.ldap.sdk.DN;
import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.ReadOnlyEntry;
import com.unboundid.ldap.sdk.persist.FilterUsage;
import com.unboundid.ldap.sdk.persist.LDAPEntryField;
import com.unboundid.ldap.sdk.persist.LDAPField;
import com.unboundid.ldap.sdk.persist.LDAPObject;

/**
 * This class provides an implementation of an object that can be used to
 * represent gluuOrganization objects in the directory.
 */
@LDAPObject(structuralClass="gluuOrganization",
        superiorClass="top")
public class gluuOrganization {

    // The field to use to hold a read-only copy of the associated entry.
    @LDAPEntryField()
    private ReadOnlyEntry ldapEntry;

    // The field used for RDN attribute o.
    @LDAPField(attribute="o",
            objectClass="gluuOrganization",
            inRDN=true,
            filterUsage= FilterUsage.ALWAYS_ALLOWED,
            requiredForEncode=true)
    private String[] o;

    // The field used for optional attribute displayName.
    @LDAPField(attribute="displayName",
            objectClass="gluuOrganization",
            filterUsage=FilterUsage.CONDITIONALLY_ALLOWED)
    private String displayName;

    // The field used for optional attribute gluuManagerGroup.
    @LDAPField(attribute="gluuManagerGroup",
            objectClass="gluuOrganization",
            filterUsage=FilterUsage.CONDITIONALLY_ALLOWED)
    private DN[] gluuManagerGroup;

    /**
     * Retrieves the value for the field associated with the
     * displayName attribute, if present.
     *
     * @return  The value for the field associated with the
     *          displayName attribute, or
     *          {@code null} if the field does not have a value.
     */
    public String getDisplayName()
    {
        return displayName;
    }

    /**
     * Retrieves the first value for the field associated with the
     * gluuManagerGroup attribute as a DN, if present.
     *
     * @return  The first value for the field associated with the
     *          gluuManagerGroup attribute, or
     *          {@code null} if that attribute was not present in the entry or
     *          does not have any values.
     */
    public DN getFirstGluuManagerGroupDN()
    {
        if ((gluuManagerGroup == null) ||
                (gluuManagerGroup.length == 0))
        {
            return null;
        }
        else
        {
            return gluuManagerGroup[0];
        }
    }



    /**
     * Retrieves the values for the field associated with the
     * gluuManagerGroup attribute as DNs, if present.
     *
     * @return  The values for the field associated with the
     *          gluuManagerGroup attribute, or
     *          {@code null} if that attribute was not present in the entry.
     */
    public DN[] getGluuManagerGroupDNs()
    {
        return gluuManagerGroup;
    }



}
