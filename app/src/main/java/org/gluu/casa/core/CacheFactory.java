package org.gluu.casa.core;

import org.gluu.service.cache.*;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import java.util.Optional;

import static org.gluu.service.cache.CacheProviderType.*;

/**
 * @author jgomer
 */
@ApplicationScoped
public class CacheFactory {

    private CacheProvider storeService;

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;

    @Produces
    @ApplicationScoped
    public CacheProvider getCacheProvider() {

        //Initialize only upon first usage
        if (storeService == null) {

            CacheConfiguration cacheConfiguration = persistenceService.getCacheConfiguration();
            StringEncrypter stringEncrypter = persistenceService.getStringEncrypter();
            StandaloneCacheProviderFactory scpf = new StandaloneCacheProviderFactory(persistenceService.getEntryManager(), stringEncrypter);
            CacheProviderType type = Optional.ofNullable(cacheConfiguration).map(CacheConfiguration::getCacheProviderType)
                    .orElse(null);

            if (type != null) {
                try {
                    logger.info("Initializing store of type = {}", type);
                    storeService = scpf.getCacheProvider(cacheConfiguration);
                    logger.info("Store created");
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                }
            } else {
                logger.warn("Cache store configuration missing!");
            }

            if (storeService == null) {
                //Try to use in-memory
                InMemoryCacheProvider imc = new InMemoryCacheProvider();
                imc.configure(cacheConfiguration);
                imc.init();
                imc.create();

                storeService = imc;
                logger.info("Defaulting to {} cache store", IN_MEMORY);
            }
        }
        return storeService;

    }

}
