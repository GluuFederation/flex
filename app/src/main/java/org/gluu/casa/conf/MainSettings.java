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
import org.gluu.service.cache.CacheConfiguration;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.gluu.casa.conf.StaticInstanceUtil.*;

/**
 * Important: getters of this class do not read values from internal private fields but from external memory store. Only
 * setters modify internal fields values. To sync the store with respect to internal values a call to {@link #updateMemoryStore()}
 * should be made. To persist store values to disk a call to {@link #updateConfigFile()} is necessary.
 * @author jgomer
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainSettings {

    private final String INMEM_PREFIX = getClass().getName() + "_";

    @JsonIgnore
    private Logger logger = LoggerFactory.getLogger(getClass());

    @JsonIgnore
    private IStoreService storeService;

    @JsonIgnore
    private Path filePath;

    @JsonIgnore
    private ObjectMapper mapper;

    @JsonIgnore
    private int previousHash;

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
        updateConfigFile();
    }

    public boolean isEnablePassReset() {
        return getInMemoryValue("enablePassReset", TR_BOOLEAN);
    }

    public String getLogLevel() {
        return getLogLevel(false);
    }

    public String getLogLevel(boolean skipStore) {
        return skipStore ? logLevel : getInMemoryValue("logLevel", TR_STRING);
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

    public OxdSettings getOxdSettings() {
        return getInMemoryValue("oxdSettings", TR_OXDSETTINGS);
    }

    public Integer getMinCredsFor2FA() {
        return getInMemoryValue("minCredsFor2FA", TR_INTEGER);
    }

    public LdapSettings getLdapSettings() {
        return getLdapSettings(false);
    }

    public LdapSettings getLdapSettings(boolean skipStore) {
        return skipStore ? ldapSettings : getInMemoryValue("ldapSettings", TR_LDAPSETTINGS);
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

    public void setupMemoryStore(CacheConfiguration storeConfiguration, StringEncrypter encrypter) throws Exception {
        storeService = StoreFactory.createMemoryStoreService(storeConfiguration, encrypter);
        updateMemoryStore();
    }

    public void updateConfigFile() throws Exception {

        //update file to disk: this provokes calling the getters of this object which in turn read the memory store
        String contents = mapper.writeValueAsString(this);
        int hash = contents.hashCode();

        if (previousHash != hash) {
            previousHash = hash;
            Files.write(filePath, contents.getBytes(StandardCharsets.UTF_8));
        }

    }

    MainSettings() {
        mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    //TODO: are u sure?
    //Needed for serializing (eg to disk)
    Path getFilePath() {
        return filePath;
    }

    void setFilePath(Path filePath) {
        this.filePath = filePath;
    }

    private void updateMemoryStore() throws Exception {

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

        T value = null;
        try {
            if (storeService == null) {
                logger.error("No memory store has been configured yet!");
            } else {
                value = mapper.readValue(storeService.get(INMEM_PREFIX + property).toString(), valueTypeRef);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return value;

    }

}
