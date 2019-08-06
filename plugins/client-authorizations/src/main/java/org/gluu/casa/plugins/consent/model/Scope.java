package org.gluu.casa.plugins.consent.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.Optional;

@DataEntry
@ObjectClass("oxAuthCustomScope")
public class Scope extends InumEntry {

    @AttributeName
    private String description;

    @AttributeName(name = "oxId")
    private String id;

    public String getDescription() {
        return description;
    }

    public String getId()
    {
        return id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        boolean equal = o != null && o instanceof Scope;
        if (equal) {
            String otherId = Scope.class.cast(o).getId();
            equal = Optional.ofNullable(getId()).map(name -> name.equals(otherId)).orElse(otherId == null);
        }
        return equal;
    }

}
