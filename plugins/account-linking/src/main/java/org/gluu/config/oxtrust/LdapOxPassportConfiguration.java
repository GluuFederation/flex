package org.gluu.config.oxtrust;

import io.jans.orm.model.base.Entry;
import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.JsonObject;
import io.jans.orm.annotation.ObjectClass;

import org.gluu.model.passport.PassportConfiguration;

@DataEntry
@ObjectClass(value = "jansPassportConf")
public class LdapOxPassportConfiguration extends Entry {

    private static final long serialVersionUID = -8451013277721189767L;

    @JsonObject
    @AttributeName(name = "jansPassportConfiguration")
    private PassportConfiguration passportConfiguration;

    public PassportConfiguration getPassportConfiguration() {
            return passportConfiguration;
    }

    public void setPassportConfiguration(PassportConfiguration passportConfiguration) {
            this.passportConfiguration = passportConfiguration;
    }

}
