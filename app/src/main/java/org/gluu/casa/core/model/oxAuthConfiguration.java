package org.gluu.casa.core.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;
import io.jans.orm.model.base.Entry;

@DataEntry
@ObjectClass("oxAuthConfiguration")
public class oxAuthConfiguration extends Entry {

    @AttributeName
    private String oxAuthConfDynamic;

    @AttributeName
    private String oxAuthConfStatic;

    public String getOxAuthConfDynamic() {
        return oxAuthConfDynamic;
    }

    public String getOxAuthConfStatic() {
        return oxAuthConfStatic;
    }

    public void setOxAuthConfDynamic(String oxAuthConfDynamic) {
        this.oxAuthConfDynamic = oxAuthConfDynamic;
    }

    public void setOxAuthConfStatic(String oxAuthConfStatic) {
        this.oxAuthConfStatic = oxAuthConfStatic;
    }

}
