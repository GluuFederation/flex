package org.gluu.casa.conf;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author jgomer
 */
@ApplicationScoped
public class MainSettingsProducer {

    private static final String DEFAULT_GLUU_BASE = "/etc/gluu";
    private static final String CONF_FILE_RELATIVE_PATH = "conf/casa.json";

    @Inject
    private Logger logger;

    private static String getGluuBase() {
        String candidateGluuBase = System.getProperty("gluu.base");
        return (candidateGluuBase == null && !Utils.onWindows()) ? DEFAULT_GLUU_BASE : candidateGluuBase;
    }

    /**
     * Returns a reference to the configuration file of the application (casa.json)
     * @param baseDir Path to configuration file without the CONF_FILE_RELATIVE_PATH part
     * @return A File object
     */
    private File getConfigFile(String baseDir) {
        Path path = Paths.get(baseDir, CONF_FILE_RELATIVE_PATH);
        return Files.exists(path) ? path.toFile() : null;
    }

    @Produces @ApplicationScoped
    public MainSettings instance() {

        MainSettings settings = null;
        logger.info("init. Obtaining global settings");

        String gluuBase = getGluuBase();
        logger.info("init. Gluu base inferred was {}", gluuBase);

        if (gluuBase != null) {
            //Get a reference to the config-file
            File srcConfigFile = getConfigFile(gluuBase);

            if (srcConfigFile == null) {
                logger.error("init. Cannot read configuration file {}", CONF_FILE_RELATIVE_PATH);
            } else {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
                    //Parses config file in a Configs instance
                    settings = mapper.readValue(srcConfigFile, MainSettings.class);
                    settings.setSourceFile(srcConfigFile);

                    //Migrate from 3.1.6 format to 4.0
                    LdapSettings ldapSettings = settings.getLdapSettings(true);
                    if (Utils.isNotEmpty(ldapSettings.getOxLdapLocation())) {
                        ldapSettings.setType(LdapSettings.BACKEND.LDAP.getValue());
                        ldapSettings.setConfigurationFile(ldapSettings.getOxLdapLocation());
                        ldapSettings.setOxLdapLocation(null);
                    }

                    try {
                        settings.updateMemoryStore();
                    } catch (Exception e) {
                        settings = null;
                        logger.error("Unable to update data in memory store!");
                        logger.error(e.getMessage(), e);
                    }
                } catch (Exception e) {
                    logger.error("Error parsing configuration file {}", CONF_FILE_RELATIVE_PATH);
                    logger.error(e.getMessage(), e);
                }
            }
        }
        return settings;

    }

}
