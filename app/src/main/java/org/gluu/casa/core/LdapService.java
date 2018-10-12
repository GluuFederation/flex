/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.ldap.sdk.*;
import com.unboundid.ldap.sdk.persist.LDAPPersistException;
import com.unboundid.ldap.sdk.persist.LDAPPersister;
import com.unboundid.ldap.sdk.persist.PersistedObjects;
import org.gluu.casa.conf.LdapSettings;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ldap.*;
import org.gluu.casa.misc.Utils;
//import org.gluu.persist.ldap.operation.LdapOperationService;
import org.gluu.casa.service.ILdapService;
import org.gluu.site.ldap.LDAPConnectionProvider;
import org.gluu.site.ldap.OperationsFacade;
import org.slf4j.Logger;
import org.xdi.util.properties.FileConfiguration;
import org.xdi.util.security.PropertiesDecrypter;
import org.xdi.util.security.StringEncrypter;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * @author jgomer
 */
@Named
@ApplicationScoped
public class LdapService implements ILdapService {

    private static final int RETRIES = 15;
    private static final int RETRY_INTERVAL = 15;

    @Inject
    private Logger logger;

    @Inject
    private MainSettings settings;

    //private LdapOperationService ldapOperationService;
    private OperationsFacade ldapOperationService;

    private String orgInum;

    private JsonNode oxAuthConfDynamic;

    private JsonNode oxAuthConfStatic;

    private JsonNode oxTrustConfApplication;

    private JsonNode oxTrustConfCacheRefresh;

    private ObjectMapper mapper;

    private StringEncrypter stringEncrypter;

    public String getOIDCEndpoint() {
        return oxAuthConfDynamic.get("openIdConfigurationEndpoint").asText();
    }

    public String getIssuerUrl() {
        return oxAuthConfDynamic.get("issuer").asText();
    }

    public int getDynamicClientExpirationTime() {
        boolean dynRegEnabled = oxAuthConfDynamic.get("dynamicRegistrationEnabled").asBoolean();
        return dynRegEnabled ? oxAuthConfDynamic.get("dynamicRegistrationExpirationTime").asInt() : -1;
    }

    public String getEncryptedString(String str) throws StringEncrypter.EncryptionException {
        return stringEncrypter == null ? str : stringEncrypter.encrypt(str);
    }

    public String getDecryptedString(String str) throws StringEncrypter.EncryptionException  {
        return (stringEncrypter == null || str == null) ? str :  stringEncrypter.decrypt(str);
    }

    public boolean initialize() {

        boolean success = false;
        try {
            mapper = new ObjectMapper();
            success = setup(settings.getLdapSettings(), RETRIES, RETRY_INTERVAL);
            logger.info("LDAPService was{} initialized successfully", success ? "" : " not");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public boolean setup(LdapSettings ldapSettings) throws Exception {
        return setup(ldapSettings, 1, 1);
    }

    private boolean setup(LdapSettings ldapSettings, int retries, int retry_interval) throws Exception {

        Properties ldapProperties = new FileConfiguration(ldapSettings.getOxLdapLocation()).getProperties();
        String saltFile = ldapSettings.getSaltLocation();

        if (Utils.isNotEmpty(saltFile)) {
            String salt = new FileConfiguration(saltFile).getProperties().getProperty("encodeSalt");
            stringEncrypter = StringEncrypter.instance(salt);
            ldapProperties = PropertiesDecrypter.decryptProperties(stringEncrypter, ldapProperties);
        }
        //4.0 style
        //ldapOperationService = new LdapEntryManagerFactory().createEntryManager(ldapProperties).getOperationService();

        //3.1.x style:
        ldapOperationService = new OperationsFacade(new LDAPConnectionProvider(ldapProperties));

        for (int i = 0; (i < retries) && (ldapOperationService.getConnectionPool() == null); i++) {
            logger.warn("Could not retrieve LDAP connection pool, retrying in {} seconds", retry_interval);
            Thread.sleep(retry_interval * 1000);
            ldapOperationService = new OperationsFacade(new LDAPConnectionProvider(ldapProperties));
        }

        //Initialize important class members if valid
        return ldapOperationService.getConnectionPool() != null && loadApplianceSettings(ldapProperties);

    }

    public Map<String, String> getCustScriptConfigProperties(String displayName) {

        Map<String, String> properties = null;
        try {
            oxCustomScript script = new oxCustomScript();
            script.setDisplayName(displayName);

            List<oxCustomScript> scripts = find(script, oxCustomScript.class, getCustomScriptsDn());
            if (scripts.size() > 0) {
                properties = Utils.scriptConfigPropertiesAsMap(scripts.get(0));
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return properties;

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

    public String getOrganizationInum() {
        return oxAuthConfDynamic.get("organizationInum").asText();
    }

    public gluuOrganization getOrganization() {
        return get(gluuOrganization.class, String.format("o=%s,o=gluu", getOrganizationInum()));
    }

    public boolean isAdmin(String userId) {
        gluuOrganization organization = getOrganization();
        List<DN> dns = organization.getGluuManagerGroupDNs();

        Person personMember = get(Person.class, getPersonDn(userId));
        return personMember != null
                && personMember.getMemberOfDNs().stream().anyMatch(m -> dns.stream().anyMatch(dn -> dn.equals(m)));

    }

    public <T> T get(Class<T> clazz, String dn) {

        T object = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            object = persister.get(dn, ldapOperationService.getConnectionPool());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return object;

    }

    public <T> List<T> find(Class<T> clazz, String parentDn, Filter filter) {

        List<T> results = new ArrayList<>();
        LDAPConnection conn = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            conn = ldapOperationService.getConnection();
            results = fromPersistedObjects(persister.search(conn, parentDn, SearchScope.SUB,
                    DereferencePolicy.NEVER, 0, 0, filter == null ? Filter.create("(objectClass=top)") : filter));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (conn != null) {
                ldapOperationService.getConnectionPool().releaseConnection(conn);
            }
        }
        return results;

    }

    public <T> List<T> find(T object, Class<T> clazz, String parentDn) {

        List<T> results = new ArrayList<>();
        LDAPConnection conn = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            conn = ldapOperationService.getConnection();
            results = fromPersistedObjects(persister.search(object, conn, parentDn, SearchScope.SUB));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (conn != null) {
                ldapOperationService.getConnectionPool().releaseConnection(conn);
            }
        }
        return results;

    }

    public <T> boolean add(T object, Class<T> clazz, String parentDn) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.add(object, ldapOperationService.getConnectionPool(), parentDn);
            success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
            logger.trace("add. Operation result was '{}'", ldapResult.getResultCode().getName());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public <T> boolean modify(T object, Class<T> clazz) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.modify(object, ldapOperationService.getConnectionPool(), null, true);
            if (ldapResult == null) {
                success = true;
                logger.trace("modify. No attribute changes took place for this modification");
            } else {
                success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
                logger.trace("modify. Operation result was '{}'", ldapResult.getResultCode().getName());
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public <T> boolean delete(T object, Class<T> clazz) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.delete(object, ldapOperationService.getConnectionPool());
            success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
            logger.trace("delete. Operation result was '{}'", ldapResult.getResultCode().getName());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

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
        if (oxTrustConfApplication != null) {
            return ldapOperationService.authenticate(uid, pass, oxTrustConfApplication.get("baseDN").asText());
        }
        throw new UnsupportedOperationException("LDAP authentication is not supported with current settings");
    }


    public void prepareFidoBranch(String userInum){

        String dn = getPersonDn(userInum);
        organizationalUnit entry = get(organizationalUnit.class, String.format("ou=fido,%s", dn));
        if (entry == null) {
            logger.info("Non existing fido branch for {}, creating...", userInum);
            entry = new organizationalUnit();
            entry.setOu("fido");

            if (!add(entry, organizationalUnit.class, dn)) {
                logger.error("Could not create fido branch");
            }
        }

    }

    private boolean loadApplianceSettings(Properties properties) {

        boolean success = false;
        try {
            loadOxAuthSettings(properties.getProperty("oxauth_ConfigurationEntryDN"));
            success = true;
            String dn = properties.getProperty("oxtrust_ConfigurationEntryDN");
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
        oxAuthConfDynamic = mapper.readTree(conf.getAuthConfDynamic());
        oxAuthConfStatic = mapper.readTree(conf.getAuthConfStatic());

    }

    private void loadOxTrustSettings(String dn) throws Exception {
        oxTrustConfiguration confT = get(oxTrustConfiguration.class, dn);
        if (confT != null) {
            oxTrustConfApplication = mapper.readTree(confT.getOxTrustConfApplication());
            oxTrustConfCacheRefresh = mapper.readTree(confT.getOxTrustConfCacheRefresh());
        }
    }

    private <T> List<T> fromPersistedObjects(PersistedObjects<T> objects) throws LDAPPersistException {

        List<T> results = new ArrayList<>();
        for (T obj = objects.next(); obj != null; obj = objects.next()) {
            results.add(obj);
        }
        return results;

    }

}
