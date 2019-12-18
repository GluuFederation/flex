package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class U2fSettings {

    private String relativeMetadataUri;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public String getRelativeMetadataUri() {
        return relativeMetadataUri;
    }

    @JsonProperty("u2f_relative_uri")
    public void setRelativeMetadataUri(String relativeMetadataUri) {
        this.relativeMetadataUri = relativeMetadataUri;
    }

}
