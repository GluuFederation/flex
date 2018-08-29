/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class LdapSettings {

    @JsonProperty("salt")
    private String saltLocation;

    @JsonProperty("ox-ldap_location")
    private String oxLdapLocation;

    public String getSaltLocation() {
        return saltLocation;
    }

    public void setSaltLocation(String saltLocation) {
        this.saltLocation = saltLocation;
    }

    public String getOxLdapLocation() {
        return oxLdapLocation;
    }

    public void setOxLdapLocation(String oxLdapLocation) {
        this.oxLdapLocation = oxLdapLocation;
    }

}
