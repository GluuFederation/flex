package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.Date;

//Using org.gluu.fido2.model.entry.Fido2RegistrationEntry directly from fido2-model artifact
//does not work well, why!!! why!!!
@DataEntry
@ObjectClass(value = "oxFido2RegistrationEntry")
public class Fido2RegistrationEntry extends Entry {

    @AttributeName(name = "displayName")
    private String displayName;

    @AttributeName(name = "creationDate")
    private Date creationDate;
    
    @AttributeName(name = "oxId")
    private String id;

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
}
