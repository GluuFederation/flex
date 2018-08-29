/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.service;

/**
 * This interface contains methods related to plugin extensions management.
 * @author jgomer
 */
public interface IExtensionsManager {

    /**
     * Gets the Java class loader associated to one of the plugins already loaded in Gluu Casa to which the class whose
     * name given by <code>clsName</code> belongs to.
     * @param clsName A fully qualified name for a Class
     * @return A ClassLoader or null if the class is not found to be loaded by any already existing plugin
     */
    ClassLoader getPluginClassLoader(String clsName);

}
