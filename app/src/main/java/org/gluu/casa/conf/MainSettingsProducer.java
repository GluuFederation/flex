package org.gluu.casa.conf;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
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

    public static String GLUU_BASE;

    @PostConstruct
    private void init() {
        String candidateGluuBase = System.getProperty("gluu.base");
        GLUU_BASE = (candidateGluuBase == null && !Utils.onWindows()) ? DEFAULT_GLUU_BASE : candidateGluuBase;
    }

    /**
     * Returns a reference to the configuration file of the application (casa.json)
     * @param baseDir Path to configuration file without the CONF_FILE_RELATIVE_PATH part
     * @return A Path object
     */
    private Path getConfigFilePath(String baseDir) {
        Path path = Paths.get(baseDir, CONF_FILE_RELATIVE_PATH);
        return Files.exists(path) ? path : null;
    }

    @Produces @ApplicationScoped
    public MainSettings instance() {

        MainSettings settings = null;
        logger.info("init. Obtaining global settings");

        logger.info("init. Gluu base inferred was {}", GLUU_BASE);

        if (GLUU_BASE != null) {
            //Get a reference to the config-file
            Path srcConfigFilePath = getConfigFilePath(GLUU_BASE);

            if (srcConfigFilePath == null) {
                logger.error("init. Cannot read configuration file {}", CONF_FILE_RELATIVE_PATH);
            } else {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
                    //Parses config file in a Configs instance
                    settings = mapper.readValue(srcConfigFilePath.toFile(), MainSettings.class);
                    settings.setFilePath(srcConfigFilePath);

                    //Migrate from 3.1.6 format to 4.0
                    LdapSettings ldapSettings = settings.getLdapSettings(true);
                    if (Utils.isNotEmpty(ldapSettings.getOxLdapLocation())) {
                        ldapSettings.setType(LdapSettings.BACKEND.LDAP.getValue());
                        ldapSettings.setConfigurationFile(ldapSettings.getOxLdapLocation());
                        ldapSettings.setOxLdapLocation(null);
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
