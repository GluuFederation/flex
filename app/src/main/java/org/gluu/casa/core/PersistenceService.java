package org.gluu.casa.core;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.conf.LdapSettings;
import org.gluu.casa.core.model.*;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.persist.PersistenceEntryManager;
import org.gluu.persist.PersistenceEntryManagerFactory;
import org.gluu.persist.ldap.operation.LdapOperationService;
import org.gluu.persist.model.PersistenceConfiguration;
import org.gluu.persist.model.SearchScope;
import org.gluu.persist.service.PersistanceFactoryService;
import org.gluu.service.cache.CacheConfiguration;
import org.gluu.util.properties.FileConfiguration;
import org.gluu.util.security.PropertiesDecrypter;
import org.gluu.util.security.StringEncrypter;
import org.gluu.search.filter.Filter;
import org.jboss.weld.inject.WeldInstance;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.*;
import java.util.stream.Stream;

@Named
@ApplicationScoped
public class PersistenceService implements IPersistenceService {

    private static final int RETRIES = 15;
    private static final int RETRY_INTERVAL = 15;

    @Inject
    private Logger logger;

    @Inject
    private PersistanceFactoryService persistanceFactoryService;

    @Inject
    private WeldInstance<PersistenceEntryManagerFactory> pFactoryInstance;

    private PersistenceEntryManager entryManager;

    private LdapOperationService ldapOperationService;

    private String rootDn;

    private JsonNode oxAuthConfDynamic;

    private JsonNode oxAuthConfStatic;

    private JsonNode oxTrustConfCacheRefresh;

    private Set<String> personCustomObjectClasses;

    private ObjectMapper mapper;

    private StringEncrypter stringEncrypter;

    private CacheConfiguration cacheConfiguration;

    public boolean initialize(LdapSettings ldapSettings) {

        boolean success = false;
        try {
            mapper = new ObjectMapper();
            success = setup(ldapSettings, RETRIES, RETRY_INTERVAL);
            logger.info("PersistenceService was{} initialized successfully", success ? "" : " not");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public boolean setup(LdapSettings ldapSettings) throws Exception {
        return setup(ldapSettings, 1, 1);
    }

    public <T> List<T> find(Class<T> clazz, String baseDn, Filter filter, int start, int count) {

        try {
            return entryManager.findEntries(baseDn, clazz, filter, SearchScope.SUB, null, null, start, count, 0);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public <T> List<T> find(Class<T> clazz, String baseDn, Filter filter) {

        try {
            return entryManager.findEntries(baseDn, clazz, filter);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Collections.emptyList();
        }

    }

    public <T> List<T> find(T object) {

        try {
            return entryManager.findEntries(object);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public <T> int count(T object) {

        try {
            return entryManager.countEntries(object);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return -1;
        }

    }

    public <T> boolean add(T object) {

        try {
            entryManager.persist(object);
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return false;
        }

    }

    public <T> T get(Class<T> clazz, String dn) {

        try {
            return entryManager.find(clazz, dn);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

    }

    public <T> boolean modify(T object) {

        try {
            entryManager.merge(object);
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return false;
        }

    }

    public <T> boolean delete(T object) {

        try {
            entryManager.remove(object);
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return false;
        }

    }

    public Map<String, String> getCustScriptConfigProperties(String acr) {
        return Optional.ofNullable(getScript(acr)).map(Utils::scriptConfigPropertiesAsMap).orElse(null);
    }

    public String getPersonDn(String id) {
        return String.format("inum=%s,%s", id, getPeopleDn());
    }

    public String getPeopleDn() {
        return oxAuthConfStatic.get("baseDn").get("people").asText();
    }

    public String getGroupsDn() {
        return oxAuthConfStatic.get("baseDn").get("groups").asText();
    }

    public String getClientsDn() {
        return oxAuthConfStatic.get("baseDn").get("clients").asText();
    }

    public String getScopesDn() {
        return oxAuthConfStatic.get("baseDn").get("scopes").asText();
    }

    public String getCustomScriptsDn() {
        return oxAuthConfStatic.get("baseDn").get("scripts").asText();
    }

    public GluuOrganization getOrganization() {
        return get(GluuOrganization.class, rootDn);
    }

    public String getIssuerUrl() {
        return oxAuthConfDynamic.get("issuer").asText();
    }

    public Set<String> getPersonOCs() {
        return personCustomObjectClasses;
    }

    public boolean isAdmin(String userId) {
        GluuOrganization organization = getOrganization();
        List<String> dns = organization.getManagerGroups();

        Person personMember = get(Person.class, getPersonDn(userId));
        return personMember != null
                && personMember.getMemberOf().stream().anyMatch(m -> dns.stream().anyMatch(dn -> dn.equals(m)));

    }

    public String getOIDCEndpoint() {
        return oxAuthConfDynamic.get("openIdConfigurationEndpoint").asText();
    }

    public int getDynamicClientExpirationTime() {
        boolean dynRegEnabled = oxAuthConfDynamic.get("dynamicRegistrationEnabled").asBoolean();
        return dynRegEnabled ? oxAuthConfDynamic.get("dynamicRegistrationExpirationTime").asInt() : -1;
    }

    public StringEncrypter getStringEncrypter() {
        return stringEncrypter;
    }

    public CacheConfiguration getCacheConfiguration() {
        return cacheConfiguration;
    }

    /**
     * Tries to determine whether local installation of Gluu is using a backend LDAP. This reads the OxTrust configuration
     * Json and inspects inside property "sourceConfigs"
     * @return A boolean value
     */
    public boolean isBackendLdapEnabled() {

        try {
            if (oxTrustConfCacheRefresh != null) {
                List<Boolean> enabledList = new ArrayList<>();
                oxTrustConfCacheRefresh.get("sourceConfigs").forEach(node -> enabledList.add(node.get("enabled").asBoolean()));
                return enabledList.stream().anyMatch(Boolean::booleanValue);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return false;

    }

    public boolean authenticate(String uid, String pass) throws Exception {
        return entryManager.authenticate(rootDn, uid, pass);
    }

    public void prepareFidoBranch(String userInum){

        String dn = "ou=fido," + getPersonDn(userInum);
        OrganizationalUnit entry = get(OrganizationalUnit.class, dn);
        if (entry == null) {
            logger.info("Non existing fido branch for {}, creating...", userInum);
            entry = new OrganizationalUnit();
            entry.setOu("fido");
            entry.setDn(dn);

            if (!add(entry)) {
                logger.error("Could not create fido branch");
            }
        }

    }

    public CustomScript getScript(String acr) {

        CustomScript script = new CustomScript();
        script.setDisplayName(acr);
        script.setBaseDn(getCustomScriptsDn());

        List<CustomScript> scripts = find(script);
        if (scripts.size() == 0) {
            logger.warn("Script '{}' not found", acr);
            script = null;
        } else {
            script = scripts.get(0);
        }
        return script;

    }

    private boolean loadApplianceSettings(String prefix, Properties properties) {

        boolean success = false;
        try {
            loadOxAuthSettings(properties.getProperty(prefix + "oxauth_ConfigurationEntryDN"));
            rootDn = "o=gluu";
            success = true;

            GluuConfiguration gluuConf = new GluuConfiguration();
            gluuConf.setBaseDn(oxAuthConfStatic.get("baseDn").get("configuration").asText());
            gluuConf = find(gluuConf).get(0);
            cacheConfiguration = gluuConf.getCacheConfiguration();

            String dn = properties.getProperty(prefix + "oxtrust_ConfigurationEntryDN");
            if (dn != null) {
                loadOxTrustSettings(dn);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    private void loadOxAuthSettings(String dn) throws Exception {

        oxAuthConfiguration conf = get(oxAuthConfiguration.class, dn);
        oxAuthConfDynamic = mapper.readTree(conf.getOxAuthConfDynamic());
        oxAuthConfStatic = mapper.readTree(conf.getOxAuthConfStatic());

        personCustomObjectClasses = Optional.ofNullable(oxAuthConfDynamic.get("personCustomObjectClassList"))
                .map(node -> {
                    try {
                        Set<String> ocs = new HashSet<>();
                        Iterator<JsonNode> it = node.elements();
                        while (it.hasNext()) {
                            ocs.add(it.next().asText());
                        }
                        return ocs;
                    } catch (Exception e) {
                        logger.error(e.getMessage());
                        return null;
                    }
                })
                .orElse(Collections.singleton("gluuCustomPerson"));

    }

    private void loadOxTrustSettings(String dn) throws Exception {

        oxTrustConfiguration confT = get(oxTrustConfiguration.class, dn);
        if (confT != null) {
            JsonNode oxTrustConfApplication = mapper.readTree(confT.getOxTrustConfApplication());
            oxTrustConfCacheRefresh = mapper.readTree(confT.getOxTrustConfCacheRefresh());
            rootDn = oxTrustConfApplication.get("baseDN").asText();
        }

    }

    LdapOperationService getOperationService() {
        return ldapOperationService;
    }

    String getRootDn() {
        return rootDn;
    }

    private boolean setup(LdapSettings ldapSettings, int retries, int retry_interval) throws Exception {

        Properties backendProperties;
        boolean ret = false;
        PersistenceEntryManagerFactory factory = null;
        String saltFile = ldapSettings.getSaltLocation();
        String type = ldapSettings.getType();
        String file = ldapSettings.getConfigurationFile();

        if (Utils.isNotEmpty(saltFile)) {
            stringEncrypter = Utils.stringEncrypter(saltFile);
        }

        //Obtain an instance of PersistenceEntryManagerFactory
        if (Stream.of(type, file).allMatch(Utils::isNotEmpty)) {
            //load configuration manually
            backendProperties = new FileConfiguration(file).getProperties();

            Set<String> rawProps = backendProperties.stringPropertyNames();
            for (String prop : rawProps) {
                backendProperties.setProperty(String.format("%s.%s", type, prop), backendProperties.getProperty(prop));
            }

            for (WeldInstance.Handler<PersistenceEntryManagerFactory> handler : pFactoryInstance.handlers()) {
                if (handler.get().getPersistenceType().equals(type)) {
                    factory = handler.get();
                    break;
                }
            }

        } else {
            //load the configuration using the oxcore-persistence-cdi API
            PersistenceConfiguration persistenceConf = persistanceFactoryService.loadPersistenceConfiguration();
            FileConfiguration persistenceConfig = persistenceConf.getConfiguration();
            backendProperties = persistenceConfig.getProperties();
            factory = persistanceFactoryService.getPersistenceEntryManagerFactory(persistenceConf);

            type = factory.getPersistenceType();
            logger.info("Underlying database of type '{}' detected", type);
            file = String.format("/etc/gluu/conf/%s", persistenceConf.getFileName());
            logger.info("Using config file: {}", file);

            //Fill missing data
            ldapSettings.setType(type);
            ldapSettings.setConfigurationFile(file);
        }

        if (stringEncrypter != null) {
            backendProperties = PropertiesDecrypter.decryptAllProperties(stringEncrypter, backendProperties);
        }

        if (factory != null) {

            int i = 0;
            do {
                try {
                    i++;
                    entryManager = factory.createEntryManager(backendProperties);
                } catch (Exception e) {
                    logger.warn("Unable to create persistence entry manager, retrying in {} seconds", retry_interval);
                    Thread.sleep(retry_interval * 1000);
                }
            } while (entryManager == null && i < retries);

            if (entryManager != null) {

                if (type.equals(LdapSettings.BACKEND.LDAP.getValue())) {
                    ldapOperationService = (LdapOperationService) entryManager.getOperationService();
                }
                //Initialize important class members
                ret = loadApplianceSettings(type + ".", backendProperties);
            }
        } else {
            logger.error("No persistence factory found for type '{}'", type);
        }
        return ret;

    }

}
