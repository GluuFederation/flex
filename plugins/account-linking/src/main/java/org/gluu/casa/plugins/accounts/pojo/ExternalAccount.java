package org.gluu.casa.plugins.accounts.pojo;

/**
 * @author jgomer
 */
public class ExternalAccount {

    private Provider provider;
    private String uid;

    public Provider getProvider() {
        return provider;
    }

    public String getUid() {
        return uid;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

}
