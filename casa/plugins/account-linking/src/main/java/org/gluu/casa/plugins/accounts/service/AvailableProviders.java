package org.gluu.casa.plugins.accounts.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import org.gluu.casa.misc.Utils;
import org.gluu.model.passport.PassportConfigurationEntry;
import org.gluu.casa.plugins.accounts.pojo.Provider;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.model.passport.PassportConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author jgomer
 */
public class AvailableProviders {

    private static final String CONFIG_FILE = "/etc/gluu/conf/gluu.properties";
    private static final String OXPASSPORT_PROPERTY = "oxpassport_ConfigurationEntryDN";

    private static List<Provider> providers;

    private static Logger logger = LoggerFactory.getLogger(AvailableProviders.class);

    private static IPersistenceService persistenceService;

    static {
        persistenceService = Utils.managedBean(IPersistenceService.class);
        //Lookup the authentication providers supported in the current Passport installation
        providers = retrieveProviders();
    }

    public static List<Provider> get() {
        return get(false);
    }

    public static List<Provider> get(boolean refresh) {
        if (refresh) {
            providers = retrieveProviders();
        }
        return providers;
    }

    public static Optional<Provider> get(String id) {
        return providers.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    private static List<Provider> retrieveProviders() {

        List<Provider> providers = new ArrayList<>();
        logger.info("Loading providers info");
        try {
            logger.debug("Reading DN of passport configuration");
            Path path = Paths.get(CONFIG_FILE);

            if (path == null) {
                throw new IOException("No configuration file found in /etc/gluu/conf");
            }

            String dn = Files.newBufferedReader(path).lines().filter(l -> l.startsWith(OXPASSPORT_PROPERTY))
                    .findFirst().map(l -> l.substring(OXPASSPORT_PROPERTY.length())).get();
            //skip uninteresting chars
            dn = dn.replaceFirst("[\\W]*=[\\W]*","");

            List<org.gluu.model.passport.Provider> details = Optional.ofNullable(persistenceService.get(PassportConfigurationEntry.class, dn))
                    .map(PassportConfigurationEntry::getPassportConfiguration).map(PassportConfiguration::getProviders)
                    .orElse(Collections.emptyList());

            details = details.stream().filter(org.gluu.model.passport.Provider::isEnabled).collect(Collectors.toList());
            logger.info("Found {} enabled providers", details.size());
            for (org.gluu.model.passport.Provider p : details) {
                Provider provider = new Provider(p);

                if (provider.getDisplayName() == null) {
                    provider.setDisplayName(p.getId());
                }
                logger.info("Found provider {}", provider.getDisplayName());

                //Fix the logo
                String logo = provider.getLogoImg();
                if (logo != null && !logo.startsWith("http")) {
                    //It's not an absolute URL
                    logo = "/jans-auth/auth/passport/" + logo;
                }
                provider.setLogoImg(logo);
                providers.add(provider);
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return providers;

    }

}
