/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.plugin;

import org.pf4j.DefaultExtensionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * @author jgomer
 */
public class SingletonExtensionFactory extends DefaultExtensionFactory {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private Map<String, Object> singletons = new HashMap<>();

    @Override
    public Object create(Class<?> extensionClass) {

        String className = extensionClass.getName();
        Object obj = singletons.get(className);

        if (obj == null) {
            obj = super.create(extensionClass);
            if (obj != null) {
                singletons.put(className, obj);
            }
        }
        return obj;

    }

    void removeSingleton(String extensionClassName) {
        logger.info("Removing extension for {}", extensionClassName);
        singletons.remove(extensionClassName);
    }

}
