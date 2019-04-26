package org.gluu.casa.plugins.accounts.pojo;

/**
 * @author jgomer
 */
public enum ProviderType {
    SOCIAL("passport_social"),
    SAML("passport_saml");

    private String acr;

    ProviderType(String acr) {
        this.acr = acr;
    }

    public String getAcr() {
        return acr;
    }

}
