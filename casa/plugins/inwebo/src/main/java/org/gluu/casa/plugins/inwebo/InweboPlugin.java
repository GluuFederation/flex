package org.gluu.casa.plugins.inwebo;

import org.gluu.casa.core.ITrackable;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

/**
 * A plugin for handling second factor authentication settings for administrators and users.
 * @author jgomer
 */
public class InweboPlugin extends Plugin implements ITrackable {

    public InweboPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }


}
