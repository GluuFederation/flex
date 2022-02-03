package org.gluu.casa.core.model;

import io.jans.orm.model.base.InumEntry;
import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.CustomObjectClass;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;

import java.util.Set;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;

/**
 * Serves as a minimal representation of a user (person) entry in Gluu database directory. Plugin developers can extend
 * this class by adding fields needed (with their respective getters/setters) in order to have access to more attributes.
 * Use this class in conjunction with {@link org.gluu.casa.service.IPersistenceService} to CRUD users to your server.
 */
@DataEntry
@ObjectClass("jansPerson")
public class BasePerson extends InumEntry {

    @AttributeName
    private String uid;

    @CustomObjectClass
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
