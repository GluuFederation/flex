package org.gluu.casa.plugins.strongauthn.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by jgomer on 2018-04-18.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TrustedOrigin {

    private String city;
    private String country;
    private long timestamp;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

}
