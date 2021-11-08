package org.gluu.casa.core.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;
import io.jans.orm.model.base.Entry;

@DataEntry
@ObjectClass("jansAppConf")
public class oxAuthConfiguration extends Entry {

    @AttributeName
    private String jansConfDyn;

    @AttributeName
    private String jansConfStatic;

    public String getJansConfStatic() {
        return jansConfDyn;
    }

    public String getJansConfDyn() {
        return jansConfStatic;
    }

    public void setJansConfDyn(String jansConfDyn) {
        this.jansConfDyn = jansConfDyn;
    }

    public void setJansConfStatic(String jansConfStatic) {
        this.jansConfStatic = jansConfStatic;
    }

}
