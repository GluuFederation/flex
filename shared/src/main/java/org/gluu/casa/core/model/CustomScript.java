package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.model.SimpleCustomProperty;
import org.gluu.persist.model.base.Entry;
import org.gluu.site.ldap.persistence.annotation.LdapAttribute;
import org.gluu.site.ldap.persistence.annotation.LdapEntry;
import org.gluu.site.ldap.persistence.annotation.LdapJsonObject;
import org.gluu.site.ldap.persistence.annotation.LdapObjectClass;

import java.util.List;
import java.util.Optional;

/**
 * A basic representation of a Gluu Server custom script. Use this class in conjuction with
 * {@link org.gluu.casa.service.IPersistenceService} to read data, modify or delete custom scripts from the server.
 */
@LdapEntry
@LdapObjectClass(values = { "top", "oxCustomScript" })
public class CustomScript extends Entry {

    @LdapAttribute
    private String displayName;

    @LdapAttribute(name = "gluuStatus")
    private Boolean enabled;

    @LdapJsonObject
    @LdapAttribute(name = "oxConfigurationProperty")
    private List<SimpleCustomProperty> configurationProperties;

    @LdapAttribute(name = "oxLevel")
    private Integer level;

    @LdapJsonObject
    @LdapAttribute(name = "oxModuleProperty")
    private List<SimpleCustomProperty> moduleProperties;

    @LdapAttribute(name = "oxRevision")
    private Long revision;

    @LdapAttribute(name = "oxScript")
    private String script;

    public String getDisplayName() {
        return displayName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    /**
     * A convenience method.
     * @return False if {@link #getEnabled()} returns null or false. True otherwise
     */
    public boolean isEnabled() {
        return Optional.ofNullable(enabled).orElse(false);
    }

    public List<SimpleCustomProperty> getConfigurationProperties() {
        return configurationProperties;
    }

    public Integer getLevel() {
        return level;
    }

    public List<SimpleCustomProperty> getModuleProperties() {
        return Utils.nonNullList(moduleProperties);
    }

    public Long getRevision() {
        return revision;
    }

    public String getScript() {
        return script;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setConfigurationProperties(List<SimpleCustomProperty> configurationProperties) {
        this.configurationProperties = configurationProperties;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public void setModuleProperties(List<SimpleCustomProperty> moduleProperties) {
        this.moduleProperties = moduleProperties;
    }

    public void setRevision(Long revision) {
        this.revision = revision;
    }

    public void setScript(String script) {
        this.script = script;
    }

}
