package org.gluu.casa.plugins.consent.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.Optional;

@DataEntry
@ObjectClass(values = { "top", "oxAuthCustomScope" })
public class Scope extends InumEntry {

    @AttributeName
    private String description;

    @AttributeName
    private String displayName;

    public String getDescription() {
        return description;
    }

    public String getDisplayName()
    {
        return displayName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public boolean equals(Object o) {
        boolean equal = o != null && o instanceof Scope;
        if (equal) {
            String otherName = Scope.class.cast(o).getDisplayName();
            equal = Optional.ofNullable(getDisplayName()).map(name -> name.equals(otherName)).orElse(otherName == null);
        }
        return equal;
    }

}
