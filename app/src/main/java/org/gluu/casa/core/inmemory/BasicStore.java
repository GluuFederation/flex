package org.gluu.casa.core.inmemory;

import org.gluu.service.cache.InMemoryCacheProvider;

import javax.enterprise.inject.Vetoed;

/**
 * @author jgomer
 */
@Vetoed
public class BasicStore extends InMemoryCacheProvider implements IStoreService {

    public void put(String key, Object object) {
        put(Integer.MAX_VALUE, key, object);
    }

}
