package org.gluu.casa.plugins.authnmethod.rs;

import org.gluu.casa.core.pojo.RegisteredCredential;

/**
 * @author jgomer
 */
public class NamedCredential extends RegisteredCredential {

    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

}
