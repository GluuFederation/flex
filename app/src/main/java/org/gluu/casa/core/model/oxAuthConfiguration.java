package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

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
