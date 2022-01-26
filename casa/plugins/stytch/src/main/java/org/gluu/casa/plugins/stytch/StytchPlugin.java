package org.gluu.casa.plugins.stytch;

import org.gluu.casa.core.ITrackable;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

/**
 * A plugin for handling second factor authentication settings for
 * administrators and users.
 * 
 * @author madhumitas
 *
 */
public class StytchPlugin extends Plugin implements ITrackable {

	public StytchPlugin(PluginWrapper wrapper) {
		super(wrapper);
	}

}
