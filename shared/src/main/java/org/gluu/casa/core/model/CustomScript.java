package org.gluu.casa.core.model;

import org.gluu.casa.misc.Utils;
import org.gluu.model.SimpleCustomProperty;
import org.gluu.persist.model.base.Entry;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.JsonObject;
import org.gluu.persist.annotation.ObjectClass;

import java.util.List;
import java.util.Optional;

/**
 * A basic representation of a Gluu Server custom script. Use this class in conjuction with
 * {@link org.gluu.casa.service.IPersistenceService} to read data, modify or delete custom scripts from the server.
 */
@DataEntry
@ObjectClass("oxCustomScript")
public class CustomScript extends Entry {

    @AttributeName
    private String displayName;

    @AttributeName(name = "oxEnabled")
    private Boolean enabled;

    @JsonObject
    @AttributeName(name = "oxConfigurationProperty")
    private List<SimpleCustomProperty> configurationProperties;

    @AttributeName(name = "oxLevel")
    private Integer level;

    @JsonObject
    @AttributeName(name = "oxModuleProperty")
    private List<SimpleCustomProperty> moduleProperties;

    @AttributeName(name = "oxRevision")
    private Long revision;

    @AttributeName(name = "oxScript")
    private String script;

    public String getDisplayName() {
        return displayName;
    }

    public Boolean getEnabled() {
        return enabled;
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
