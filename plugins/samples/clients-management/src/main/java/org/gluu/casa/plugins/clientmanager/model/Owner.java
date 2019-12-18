package org.gluu.casa.plugins.clientmanager.model;

import org.gluu.casa.core.model.BasePerson;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.Optional;

@DataEntry
@ObjectClass("gluuPerson")
public class Owner extends BasePerson {

    @AttributeName
    private String givenName;

    @AttributeName(name ="sn")
    private String familyName;

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getFormattedName() {
        String name = Optional.ofNullable(givenName).orElse("");
        String surname = Optional.ofNullable(familyName).orElse("");
        return String.format("%s %s", name, surname);
    }

}
