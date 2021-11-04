package org.gluu.casa.core.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;

import java.util.List;

import org.gluu.casa.misc.Utils;

@DataEntry
@ObjectClass("gluuPerson")
public class PersonOTP extends BasePerson {

    @AttributeName(name ="oxExternalUid")
    private List<String> externalUids;

    @AttributeName(name = "oxOTPDevices")
    private String OTPDevices;

    public List<String> getExternalUids() {
        return Utils.nonNullList(externalUids);
    }

    public String getOTPDevices() {
        return OTPDevices;
    }

    public void setExternalUids(List<String> v) {
        this.externalUids = v;
    }

    public void setOTPDevices(String OTPDevices) {
        this.OTPDevices = OTPDevices;
    }

}
