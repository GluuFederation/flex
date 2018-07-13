/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa;

import org.pf4j.Extension;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

/**
 * A <a href="http://www.pf4j.org/" target="_blank">PF4J</a> plugin that defines a single extension. Note this class
 * is referenced in plugin's manifest file (entry <code>Plugin-Class</code>).
 * @author jgomer
 */
public class HelloWorldPlugin extends Plugin {

    public HelloWorldPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    /**
     * An extension. See {@link HelloWorldMenu} class.
     */
    @Extension
    public static class HelloWorldMenuExtension extends HelloWorldMenu { }

}
