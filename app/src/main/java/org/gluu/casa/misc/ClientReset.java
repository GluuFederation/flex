package org.gluu.casa.misc;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.model.casa.ApplicationConfiguration;
import org.gluu.persist.PersistenceEntryManager;
import org.gluu.persist.couchbase.impl.CouchbaseEntryManagerFactory;
import org.gluu.persist.ldap.impl.LdapEntryManagerFactory;
import org.gluu.util.security.PropertiesDecrypter;
import org.gluu.util.security.StringEncrypter;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

public class ClientReset {

    private static final String BASE_DIR = "/etc/gluu/conf";
    private static final String CONFIG_FILE = BASE_DIR + File.separator + "gluu.properties";
    private static final Charset utf8 = StandardCharsets.UTF_8;
    private static final PrintStream out = System.out;

    public static void main(String ...args) throws Exception {

        Properties p;
        String type;
        try (Reader isr = new InputStreamReader(new FileInputStream(CONFIG_FILE), utf8)) {
            p = new Properties();
            p.load(isr);
            type = p.getProperty("persistence.type").toLowerCase();
            out.println("Detected persistence type " + type);

            if (!type.equals("couchbase")) {
                //if it's hybrid or ldap, assume ldap
                type = "ldap";
            }
        }

        String confFileName =  String.format("%s%sgluu-%s.properties", BASE_DIR, File.separator, type);
        out.println("Loading " + confFileName);
        try (Reader isr = new InputStreamReader(new FileInputStream(confFileName), utf8)) {
            p = new Properties();
            p.load(isr);
        }

        Set<String> keys = p.keySet().stream().map(Object::toString).collect(Collectors.toSet());
        for (String key : keys) {
            if (!key.startsWith("ssl.")) {
                p.setProperty(type + "." + key, p.getProperty(key));
            }
            p.remove(key);
        }

        out.println("Decrypting properties...");
        String salt;
        try (Reader isr = new InputStreamReader(new FileInputStream(BASE_DIR + File.separator + "salt"), utf8)) {
            Properties saltProperties = new Properties();
            saltProperties.load(isr);
            salt = saltProperties.getProperty("encodeSalt");
        }
        p = PropertiesDecrypter.decryptAllProperties(StringEncrypter.instance(salt), p);

        out.println("Obtaining a persistence entry manager...");
        PersistenceEntryManager entryManager;

        if (type.equals("ldap")) {
            LdapEntryManagerFactory ldapEntryManagerFactory = new LdapEntryManagerFactory();
            entryManager = ldapEntryManagerFactory.createEntryManager(p);
        } else {
            CouchbaseEntryManagerFactory couchbaseEntryManagerFactory = new CouchbaseEntryManagerFactory();
            couchbaseEntryManagerFactory.create();
            entryManager = couchbaseEntryManagerFactory.createEntryManager(p);
        }

        String dn = "ou=casa,ou=configuration,o=gluu";
        out.print("Looking up configuration from " + dn);

        ApplicationConfiguration appConfig = entryManager.find(ApplicationConfiguration.class, dn);
        String strSettings = appConfig.getSettings();
        out.println("...found!");

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> settings = mapper.readValue(strSettings, new TypeReference<Map<String, Object>>(){});
        Map<String, Object> oxdSettings = (Map<String, Object>) settings.get("oxd_config");

        if (oxdSettings.containsKey("client")) {
            oxdSettings.remove("client");
            out.println("Flushing client section...");

            appConfig.setSettings(mapper.writeValueAsString(settings));
            entryManager.merge(appConfig);
            out.println("Done. Please restart Casa to trigger a new registration by oxd.");
        } else {
            out.println("Client section in configuration is absent. Nothing to do.");
        }

    }

}
