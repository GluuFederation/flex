package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.persist.model.base.InumEntry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapCustomObjectClass;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.Set;

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
    private static String[] customObjectClasses;

    static {
        IPersistenceService ips = Utils.managedBean(IPersistenceService.class);
        if (ips != null) {
            Set<String> ocs = ips.getPersonOCs();
            ocs.remove("top");
            ocs.remove("gluuPerson");
            setCustomObjectClasses(ocs.toArray(new String[0]));
        }
    }

    public String getUid() {
        return uid;
    }

    public static String[] getCustomObjectClasses() {
        return customObjectClasses;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public static void setCustomObjectClasses(String[] customObjectClasses) {
        BasePerson.customObjectClasses = customObjectClasses;
    }

}
