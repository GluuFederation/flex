package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.List;

/**
 * A basic representation of the directory tree organization entry (see <code>gluuOrganization</code> object class of
 * LDAP for instance).This class gives you access to data such as organization name, inum, and manager group.
 * <p>To obtain an instance of this class use {@link org.gluu.casa.service.IPersistenceService}.</p>
 */
@DataEntry
@ObjectClass("gluuOrganization")
public class GluuOrganization extends Entry {

    @AttributeName
    private String displayName;

    @AttributeName(name = "gluuManagerGroup")
    private List<String> managerGroups;

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Retrieves a list of DNs corresponding to defined manager groups.
     * @return A list of Strings
     */
    public List<String> getManagerGroups() {
        return managerGroups;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setManagerGroups(List<String> managerGroups) {
        this.managerGroups = managerGroups;
    }

}
