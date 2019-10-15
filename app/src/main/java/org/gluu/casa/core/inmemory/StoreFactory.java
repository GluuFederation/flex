package org.gluu.casa.core.inmemory;

import org.gluu.casa.misc.Utils;
import org.gluu.service.cache.*;
import org.gluu.util.security.StringEncrypter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import java.lang.reflect.Proxy;

import static org.gluu.service.cache.CacheProviderType.IN_MEMORY;
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

            if (cacheConfiguration == null) {
                logger.warn("In-memory store configuration missing. Defaulting to {} config", IN_MEMORY);
                cacheConfiguration = new CacheConfiguration();
                cacheConfiguration.setInMemoryConfiguration(new InMemoryConfiguration());
                cacheConfiguration.setCacheProviderType(IN_MEMORY);
            }

            CacheProviderType type = cacheConfiguration.getCacheProviderType();
            logger.info("Using In-memory store of type = {}", type);

            if (!type.equals(REDIS) && !type.equals(IN_MEMORY)) {
                logger.warn("Casa does not support this cache provider. Defaulting to {}", IN_MEMORY);
                type = IN_MEMORY;
            }

            logger.info("Initializing memory store...");
            if (type.equals(IN_MEMORY)) {
                BasicStore imc = new BasicStore();
                imc.setCacheConfiguration(cacheConfiguration);
                imc.create();
                storeService = imc;

            } else if (type.equals(REDIS)){
                //Reusing some lines from org.gluu.service.cache.RedisProvider: it cannot be used here since it's a managed
                //bean. There were problems importing artifact oxcore-service (see pom.xml)

                RedisConfiguration redisConfiguration = cacheConfiguration.getRedisConfiguration();
                if (Utils.isNotEmpty(redisConfiguration.getPassword())) {
                    logger.debug("Decrypting password for Redis Connection...");
                    redisConfiguration.setDecryptedPassword(stringEncrypter.decrypt(redisConfiguration.getPassword()));
                }

                AbstractRedisProvider arp = RedisProviderFactory.create(redisConfiguration);
                arp.create();
                logger.info("Redis provider created");

                storeService = IStoreServiceClass.cast(Proxy.newProxyInstance(IStoreServiceClass.getClassLoader(),
                        new Class<?>[]{IStoreServiceClass}, new RedisStoreWrapper(arp)));
            }
        }
        return storeService;

    }

}
