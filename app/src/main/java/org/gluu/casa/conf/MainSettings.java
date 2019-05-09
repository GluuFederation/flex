package org.gluu.casa.conf;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.gluu.casa.conf.sndfactor.EnforcementPolicy;
import org.gluu.casa.core.inmemory.StoreFactory;
import org.gluu.casa.core.inmemory.IStoreService;
import org.gluu.casa.misc.Utils;
import org.gluu.service.cache.CacheConfiguration;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.gluu.casa.conf.StaticInstanceUtil.*;

/**
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainSettings {

    private final String INMEM_PREFIX = getClass().getSimpleName() + "_";

    @JsonIgnore
    private Logger logger = LoggerFactory.getLogger(getClass());

    @JsonIgnore
    private IStoreService storeService;

    @JsonIgnore
    private File sourceFile;

    @JsonIgnore
    private ObjectMapper mapper;

    @JsonProperty("store_config")
    private CacheConfiguration cacheConfiguration;

    @JsonProperty("enable_pass_reset")
    private boolean enablePassReset;

    @JsonProperty("use_branding")
    private boolean useExternalBranding;

    @JsonProperty("log_level")
    private String logLevel;

    @JsonProperty("min_creds_2FA")
    private Integer minCredsFor2FA;

    @JsonProperty("ldap_settings")
    private LdapSettings ldapSettings;

    @JsonProperty("policy_2fa")
    private List<EnforcementPolicy> enforcement2FA;

    @JsonProperty("trusted_dev_settings")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private TrustedDevicesSettings trustedDevicesSettings;

    @JsonProperty("acr_plugin_mapping")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, String> acrPluginMap;

    @JsonProperty("plugins")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<PluginInfo> knownPlugins;

    @JsonProperty("extra_css")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String extraCssSnippet;

    @JsonProperty("oxd_config")
    private OxdSettings oxdSettings;

    @JsonProperty("u2f_settings")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private U2fSettings u2fSettings;

    public void save() throws Exception {
        updateMemoryStore();
        //update file to disk
        mapper.writeValue(sourceFile, this);
    }

    public boolean isEnablePassReset() {
        return getInMemoryValue("enablePassReset", TR_BOOLEAN);
    }

    public String getLogLevel() {
        return getInMemoryValue("logLevel", TR_STRING);
    }

    public boolean isUseExternalBranding() {
        return getInMemoryValue("useExternalBranding", TR_BOOLEAN);
    }

    public Map<String, String> getAcrPluginMap() {
        return getInMemoryValue("acrPluginMap", TR_MAP_STRING_STRING);
    }

    public String getExtraCssSnippet() {
        return getInMemoryValue("extraCssSnippet", TR_STRING);
    }

    public U2fSettings getU2fSettings() {
        return getInMemoryValue("u2fSettings", TR_U2FSETTINGS);
    }

    public TrustedDevicesSettings getTrustedDevicesSettings() {
        return getInMemoryValue("trustedDevicesSettings", TR_TRUSTED_DEVICES_SETTINGS);
    }

    public List<PluginInfo> getKnownPlugins() {
        return getInMemoryValue("knownPlugins", TR_LIST_PLUGININFO);
    }

    public OxdSettings getOxdSettings() {
        return getInMemoryValue("oxdSettings", TR_OXDSETTINGS);
    }

    public Integer getMinCredsFor2FA() {
        return getInMemoryValue("minCredsFor2FA", TR_INTEGER);
    }

    public LdapSettings getLdapSettings() {
        return getLdapSettings(false);
    }

    public List<EnforcementPolicy> getEnforcement2FA() {
        return getInMemoryValue("enforcement2FA", TR_LIST_ENFORCEMENT_POLICY);
    }

    public void setEnablePassReset(boolean enablePassReset) {
        this.enablePassReset = enablePassReset;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }

    public void setLdapSettings(LdapSettings ldapSettings) {
        this.ldapSettings = ldapSettings;
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

    public void setEnforcement2FA(List<EnforcementPolicy> enforcement2FA) {
        this.enforcement2FA = enforcement2FA;
    }

    public void setU2fSettings(U2fSettings u2fSettings) {
        this.u2fSettings = u2fSettings;
    }

    public void setTrustedDevicesSettings(TrustedDevicesSettings trustedDevicesSettings) {
        this.trustedDevicesSettings = trustedDevicesSettings;
    }

    public void setKnownPlugins(List<PluginInfo> knownPlugins) {
        this.knownPlugins = knownPlugins;
    }

    public void setCacheConfiguration(CacheConfiguration cacheConfiguration) {
        this.cacheConfiguration = cacheConfiguration;
    }

    MainSettings() {
        mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    //Needed for serializing (eg to disk)
    File getSourceFile() {
        return sourceFile;
    }

    void setSourceFile(File sourceFile) {
        this.sourceFile = sourceFile;
    }

    LdapSettings getLdapSettings(boolean skipStore) {
        return skipStore ? ldapSettings : getInMemoryValue("ldapSettings", TR_LDAPSETTINGS);
    }

    void updateMemoryStore() throws Exception {

        if (storeService == null) {
            StringEncrypter encr = null;
            try {
                String saltFile = ldapSettings.getSaltLocation();
                if (Utils.isNotEmpty(saltFile)) {
                    encr = Utils.stringEncrypter(saltFile);
                }
            } catch (Exception e) {
                logger.warn("Unable to create a StringDecrypter Instance");
            }
            storeService = StoreFactory.getCacheProvider(cacheConfiguration,  encr);
        }

        //Iterate through fields of this class annotated with JsonProperty
        Arrays.stream(getClass().getDeclaredFields()).filter(f -> f.getAnnotation(JsonProperty.class) != null)
                .forEach(f -> {
                    try {
                        //Convert this field value to json
                        String value = mapper.writeValueAsString(f.get(this));
                        //Underlying oxcore library for Redis access does not like classes not implementing Serializable,
                        //so only strings representations are stored
                        storeService.put(INMEM_PREFIX + f.getName(), value);
                    } catch (Exception e) {
                        logger.error(e.getMessage(), e);
                    }
                });
    }

    private <T> T getInMemoryValue(String property, TypeReference<T> valueTypeRef) {

        try {
            return mapper.readValue(storeService.get(INMEM_PREFIX + property).toString(), valueTypeRef);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

    }

}
