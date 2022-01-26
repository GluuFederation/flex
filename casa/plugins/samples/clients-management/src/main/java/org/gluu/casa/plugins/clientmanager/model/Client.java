package org.gluu.casa.plugins.clientmanager.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.List;

@DataEntry
@ObjectClass("oxAuthClient")
public class Client extends InumEntry {

    @AttributeName
    private String displayName;

    @AttributeName(name = "associatedPerson")
    private List<String> owners;

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public List<String> getOwners() {
        return owners;
    }

    public void setOwners(List<String> owners) {
        this.owners = owners;
    }

}
