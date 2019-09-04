package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class LdapSettings {

    public enum BACKEND {
        LDAP, COUCHBASE, HYBRID;

        public String getValue() {
            //This is needed to match the value returned by PersistenceEntryManagerFactory.getPersistenceType()
            return toString().toLowerCase();
        }

    }

    @JsonProperty("salt")
    private String saltLocation;

    @JsonProperty("backend_type")
    private String type;

    @JsonProperty("config_file")
    private String configurationFile;

    //This will be unused after MainSettingsProducer migrates data
    @JsonProperty("ox-ldap_location")
    private String oxLdapLocation;

    public String getSaltLocation() {
        return saltLocation;
    }

    public String getType() {
        return type;
    }

    public String getConfigurationFile() {
        return configurationFile;
    }

    public String getOxLdapLocation() {
        return oxLdapLocation;
    }

    public void setSaltLocation(String saltLocation) {
        this.saltLocation = saltLocation;
    }

    public void setOxLdapLocation(String oxLdapLocation) {
        this.oxLdapLocation = oxLdapLocation;
    }

    public void setConfigurationFile(String configurationFile) {
        this.configurationFile = configurationFile;
    }

    public void setType(String type) {
        this.type = type;
    }

}
