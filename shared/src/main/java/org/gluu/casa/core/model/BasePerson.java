package org.gluu.casa.core.model;

import org.gluu.persist.model.base.InumEntry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapCustomObjectClass;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

/**
 * Serves as a minimal representation of a user (person) entry in Gluu database directory. Plugin developers can extend
 * this class by adding fields needed (with their respective getters/setters) in order to have access to more attributes.
 * Use this class in conjuction with {@link org.gluu.casa.service.IPersistenceService} to CRUD users to your server.
 */
@LdapEntry
@LdapObjectClass(values = { "top", "gluuPerson" })
public class BasePerson extends InumEntry {

    @LdapAttribute
    private String uid;

    @LdapCustomObjectClass
    private String[] customObjectClasses;

    public BasePerson() {
        //TODO: how to properly handle this!
        setCustomObjectClasses(new String[]{"gluuCustomPerson"});
    }

    public String getUid() {
        return uid;
    }

    public String[] getCustomObjectClasses() {
        return customObjectClasses;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public void setCustomObjectClasses(String[] customObjectClasses) {
        this.customObjectClasses = customObjectClasses;
    }

}
