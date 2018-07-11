/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.misc;

import org.gluu.credmanager.service.IExtensionsManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.lang.ContextClassLoaderFactory;

import java.util.Arrays;

/**
 * @author jgomer
 */
public class CustomClassLoader implements ContextClassLoaderFactory {

    private static final String[] DEFAULT_PACKAGES = {"org.zkoss", "java", "javax"};

    private Logger logger = LoggerFactory.getLogger(getClass());
    private IExtensionsManager extManager;

    public CustomClassLoader() {
        extManager = Utils.managedBean(IExtensionsManager.class);
        if (extManager == null) {
            logger.error("Could not obtain a reference to ExtensionsManager bean");
        }
    }

    //what senses does this method have?
    public ClassLoader getContextClassLoader(Class<?> reference) {
        return reference.getClassLoader();
        //return Thread.currentThread().getContextClassLoader();
    }

    public ClassLoader getContextClassLoaderForName(String className) {

        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        //Filter out uninteresting classes
        if (Arrays.stream(DEFAULT_PACKAGES).anyMatch(pkg -> className.startsWith(pkg + "."))
                || !Character.isLetter(className.charAt(0))) {
            return loader;
        }

        try {
            loader.loadClass(className);
            //The following ends up being to noisy
            //logger.trace("Class '{}' found in current thread's context class loader", className);
            return loader;
        } catch (ClassNotFoundException e) {

            //logger.warn("Class not found in current thread's context class loader");
            if (extManager != null) {
                loader = extManager.getPluginClassLoader(className);

                if (loader == null) {
                    logger.error("Could not find a plugin class loader for class '{}'", className);
                } else {
                    logger.trace("Class '{}' found in one of the plugins class loaders", className);
                }
            }
        }
        return loader;

    }

}
