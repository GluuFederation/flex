package org.gluu.casa.plugins.stytch.model;

import org.gluu.casa.core.model.BasePerson;
import org.gluu.casa.misc.Utils;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.List;

@DataEntry
@ObjectClass("gluuPerson")
public class PersonMobile extends BasePerson {

    @AttributeName(name = "oxMobileDevices")
    private String mobileDevices;

    @AttributeName
    private List<String> mobile;

    public String getMobileDevices(){
        return mobileDevices;
    }

    public List<String> getMobile() {
        return Utils.nonNullList(mobile);
    }

    public void setMobileDevices(String v) {
        this.mobileDevices = v;
    }

    public void setMobile(List<String> v) {
        this.mobile = v;
    }

}
