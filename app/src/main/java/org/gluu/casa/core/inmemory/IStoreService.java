package org.gluu.casa.core.inmemory;

import org.gluu.service.cache.CacheInterface;

/**
 * @author jgomer
 */
public interface IStoreService extends CacheInterface {

    void destroy();

}
