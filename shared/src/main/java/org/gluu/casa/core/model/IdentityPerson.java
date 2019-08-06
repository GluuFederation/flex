package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.List;

/**
 * Extends {@link BasePerson} in order to manipulate attributes <code>userPassword</code> and <code>oxExternalUid</code>.
 */
@DataEntry
@ObjectClass("gluuPerson")
public class IdentityPerson extends BasePerson {

    @AttributeName(name ="userPassword")
    private String password;

    @AttributeName
    private List<String> oxExternalUid;

    @AttributeName
    private List<String> oxUnlinkedExternalUids;

    public boolean hasPassword() {
        return Utils.isNotEmpty(password);
    }

    public String getPassword() {
        return password;
    }

    public List<String> getOxExternalUid() {
        return Utils.nonNullList(oxExternalUid);
    }

    public List<String> getOxUnlinkedExternalUids() {
        return Utils.nonNullList(oxUnlinkedExternalUids);
    }

    public void setPassword(String userPassword) {
        this.password = userPassword;
    }

    public void setOxExternalUid(List<String> oxExternalUid) {
        this.oxExternalUid = oxExternalUid;
    }

    public void setOxUnlinkedExternalUids(List<String> oxUnlinkedExternalUids) {
        this.oxUnlinkedExternalUids = oxUnlinkedExternalUids;
    }

}
