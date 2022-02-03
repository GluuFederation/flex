package org.gluu.casa.plugins.strongauthn;

import org.gluu.casa.extension.PreferredMethodFragment;
import org.pf4j.Extension;

/**
 * An extension class implementing the {@link PreferredMethodFragment} extension point. It allows to insert extra markup
 * when users have enabled 2fa in their accounts.
 * @author jgomer
 */
@Extension
public class StrongAuthnSettingsFragment implements PreferredMethodFragment {

    public String getUrl() {
        return "index.zul";
    }

}
