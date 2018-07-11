package org.gluu.casa;

import org.pf4j.Extension;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

/**
 * Created by jgomer on 2018-07-10.
 */
public class HelloWorldPlugin extends Plugin {

    public HelloWorldPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Extension
    public static class HelloWorldMenuExtension extends HelloWorldMenu { }

}
