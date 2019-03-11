package org.gluu.casa.core.model;

import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.Date;

@LdapEntry
@LdapObjectClass(values = { "top", "oxDeviceRegistration" })
public class DeviceRegistration extends Entry {

    @LdapAttribute
    private String oxId;

    @LdapAttribute
    private String oxApplication;

    @LdapAttribute
    private Long oxCounter;

    @LdapAttribute
    private String displayName;

    @LdapAttribute
    private Date creationDate;

    @LdapAttribute(name = "oxLastAccessTime")
    private Date lastAccessTime;

    @LdapAttribute
    private String oxStatus;

    @LdapAttribute(name = "oxDeviceData")
    private String deviceData;

    public String getOxId() {
        return oxId;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public Date getLastAccessTime() {
        return lastAccessTime;
    }

    public Long getOxCounter() {
        return oxCounter;
    }

    public String getOxApplication() {
        return oxApplication;
    }

    public String getOxStatus() {
        return oxStatus;
    }

    public String getDeviceData() {
        return deviceData;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setOxId(String oxId) {
        this.oxId = oxId;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setOxApplication(String oxApplication) {
        this.oxApplication = oxApplication;
    }

    public void setOxStatus(String oxStatus) {
        this.oxStatus = oxStatus;
    }

    public void setOxCounter(Long oxCounter) {
        this.oxCounter = oxCounter;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public void setLastAccessTime(Date lastAccessTime) {
        this.lastAccessTime = lastAccessTime;
    }

    public void setDeviceData(String deviceData) {
        this.deviceData = deviceData;
    }

}
