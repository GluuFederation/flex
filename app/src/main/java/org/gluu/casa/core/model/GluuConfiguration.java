package org.gluu.casa.core.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.JsonObject;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.Entry;
import org.gluu.service.cache.CacheConfiguration;

/**
 * @author jgomer
 */
@DataEntry
@ObjectClass(values = { "top", "gluuConfiguration" })
public class GluuConfiguration extends Entry {

    @AttributeName(name = "oxCacheConfiguration")
    @JsonObject
    private CacheConfiguration cacheConfiguration;

    public CacheConfiguration getCacheConfiguration() {
        return cacheConfiguration;
    }

    public void setCacheConfiguration(CacheConfiguration cacheConfiguration) {
        this.cacheConfiguration = cacheConfiguration;
    }

}
