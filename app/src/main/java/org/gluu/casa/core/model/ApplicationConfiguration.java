package org.gluu.casa.core.model;

import org.gluu.casa.conf.MainSettings;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.JsonObject;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.Entry;

@DataEntry
@ObjectClass(value = "oxApplicationConfiguration")
public class ApplicationConfiguration extends Entry {

    @JsonObject
    @AttributeName(name = "oxConfApplication")
    private MainSettings settings;

    public MainSettings getSettings() {
        return settings;
    }

    public void setSettings(MainSettings settings) {
        this.settings = settings;
    }

}
