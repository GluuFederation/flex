package org.gluu.casa.plugins.accounts.model;

import org.gluu.model.passport.PassportConfiguration;
import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.annotation.JsonObject;

@DataEntry
@ObjectClass(values = { "top", "oxPassportConfiguration" })
public class oxPassportConfiguration extends Entry {

    @JsonObject
    @AttributeName(name = "gluuPassportConfiguration")
    private PassportConfiguration config;

    public PassportConfiguration getConfig() {
        return config;
    }

    public void setConfig(PassportConfiguration config) {
        this.config = config;
    }

}
