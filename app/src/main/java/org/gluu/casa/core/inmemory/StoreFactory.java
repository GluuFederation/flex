package org.gluu.casa.core.inmemory;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.misc.Utils;
import org.gluu.service.cache.*;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import java.lang.reflect.Proxy;
import java.util.Optional;

import static org.gluu.service.cache.CacheProviderType.IN_MEMORY;
import static org.gluu.service.cache.CacheProviderType.NATIVE_PERSISTENCE;
import static org.gluu.service.cache.CacheProviderType.REDIS;

/**
 * @author jgomer
 */
@ApplicationScoped
public class StoreFactory {

    private static Class<IStoreService> IStoreServiceClass = IStoreService.class;

    private static IStoreService storeService;

    private static Logger logger = LoggerFactory.getLogger(StoreFactory.class);

    @Produces @ApplicationScoped
    public IStoreService getMemoryStore() {
        return storeService;
    }

    public static IStoreService createMemoryStoreService(CacheConfiguration cacheConfiguration, StringEncrypter stringEncrypter) throws Exception {

        //Initialize only upon first usage
        if (storeService == null) {

            Object store = null;
            CacheProviderType type = Optional.ofNullable(cacheConfiguration).map(CacheConfiguration::getCacheProviderType).orElse(null);
            if (type != null) {

                try {
                    logger.info("Initializing memory of type = {}", type);
                    //We cannot inject oxcore's NativePersistenceCacheProvider or RedisProvider.
                    //There are problems when importing artifact oxcore-service (see pom.xml)
                    if (type.equals(REDIS)) {
                        RedisConfiguration redisConfiguration = cacheConfiguration.getRedisConfiguration();
                        if (Utils.isNotEmpty(redisConfiguration.getPassword())) {
                            logger.debug("Decrypting password for Redis Connection...");
                            redisConfiguration.setDecryptedPassword(stringEncrypter.decrypt(redisConfiguration.getPassword()));
                        }

                        AbstractRedisProvider arp = RedisProviderFactory.create(redisConfiguration);
                        arp.create();
                        store = arp;
                        logger.info("Redis provider created");

                    } else if (type.equals(NATIVE_PERSISTENCE)) {
                        PersistenceService ps = Utils.managedBean(PersistenceService.class);
                        cacheConfiguration.getNativePersistenceConfiguration().setBaseDn(ps.getRootDn());

                        NativePersistenceCacheProvider naive = new NativePersistenceCacheProvider();
                        naive.setCacheConfiguration(cacheConfiguration);
                        naive.setEntryManager(ps.getEntryManager());

                        naive.create();
                        store = naive;
                        logger.info("Native provider created");

                    } else if (!type.equals(IN_MEMORY)) {
                        logger.warn("Casa does not support this cache provider");
                    }
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                }
            } else {
                logger.warn("In-memory store configuration missing!");
            }

            if (store == null) {
                InMemoryCacheProvider imc = new InMemoryCacheProvider();
                imc.setCacheConfiguration(cacheConfiguration);
                imc.create();

                store = imc;
                logger.info("Defaulting to {} provider", IN_MEMORY);
            }
            storeService = IStoreServiceClass.cast(Proxy.newProxyInstance(IStoreServiceClass.getClassLoader(),
                    new Class<?>[]{IStoreServiceClass}, new StoreWrapper(store)));
        }
        return storeService;

    }

}
