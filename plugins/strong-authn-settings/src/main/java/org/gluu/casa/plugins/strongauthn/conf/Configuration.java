package org.gluu.casa.plugins.strongauthn.conf;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Configuration {

    @JsonProperty("min_creds_2FA")
    private Integer minCredsFor2FA;

    @JsonProperty("policy_2fa")
    private List<EnforcementPolicy> enforcement2FA;

    @JsonProperty("trusted_dev_settings")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private TrustedDevicesSettings trustedDevicesSettings;

    public Integer getMinCredsFor2FA() {
        return minCredsFor2FA;
    }

    public TrustedDevicesSettings getTrustedDevicesSettings() {
        return trustedDevicesSettings;
    }

    public List<EnforcementPolicy> getEnforcement2FA() {
        return enforcement2FA;
    }

    public void setMinCredsFor2FA(Integer minCredsFor2FA) {
        this.minCredsFor2FA = minCredsFor2FA;
    }

    public void setEnforcement2FA(List<EnforcementPolicy> enforcement2FA) {
        this.enforcement2FA = enforcement2FA;
    }

    public void setTrustedDevicesSettings(TrustedDevicesSettings trustedDevicesSettings) {
        this.trustedDevicesSettings = trustedDevicesSettings;
    }

}
