package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainSettings {

    @JsonProperty("enable_pass_reset")
    private boolean enablePassReset;

    @JsonProperty("use_branding")
    private boolean useExternalBranding;

    @JsonProperty("log_level")
    private String logLevel;

    @JsonProperty("min_creds_2FA")
    private Integer minCredsFor2FA;

    @JsonProperty("acr_plugin_mapping")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, String> acrPluginMap;

    @JsonProperty("extra_css")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String extraCssSnippet;

    @JsonProperty("oxd_config")
    private OxdSettings oxdSettings;

    @JsonProperty("allowed_cors_domains")
    private List<String> corsDomains;

    @JsonProperty("u2f_settings")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private U2fSettings u2fSettings;

    @JsonProperty("plugins_settings")
    private Map<String, Map<String,Object>> pluginSettings = new HashMap<>();

    public boolean isEnablePassReset() {
        return enablePassReset;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public boolean isUseExternalBranding() {
        return useExternalBranding;
    }

    public Map<String, String> getAcrPluginMap() {
        return acrPluginMap;
    }

    public String getExtraCssSnippet() {
        return extraCssSnippet;
    }

    public U2fSettings getU2fSettings() {
        return u2fSettings;
    }

    public OxdSettings getOxdSettings() {
        return oxdSettings;
    }

    public Integer getMinCredsFor2FA() {
        return minCredsFor2FA;
    }

    public List<String> getCorsDomains() {
        return corsDomains;
    }

    public Map<String, Map<String, Object>> getPluginSettings() {
        return pluginSettings;
    }

    public void setEnablePassReset(boolean enablePassReset) {
        this.enablePassReset = enablePassReset;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }

    public void setUseExternalBranding(boolean useExternalBranding) {
        this.useExternalBranding = useExternalBranding;
    }

    public void setMinCredsFor2FA(Integer minCredsFor2FA) {
        this.minCredsFor2FA = minCredsFor2FA;
    }

    public void setAcrPluginMap(Map<String, String> acrPluginMap) {
        this.acrPluginMap = acrPluginMap;
    }

    public void setExtraCssSnippet(String extraCssSnippet) {
        this.extraCssSnippet = extraCssSnippet;
    }

    public void setOxdSettings(OxdSettings oxdSettings) {
        this.oxdSettings = oxdSettings;
    }

    public void setU2fSettings(U2fSettings u2fSettings) {
        this.u2fSettings = u2fSettings;
    }

    public void setCorsDomains(List<String> corsDomains) {
        this.corsDomains = corsDomains;
    }

    public void setPluginSettings(Map<String, Map<String, Object>> pluginSettings) {
        this.pluginSettings = pluginSettings;
    }

}
