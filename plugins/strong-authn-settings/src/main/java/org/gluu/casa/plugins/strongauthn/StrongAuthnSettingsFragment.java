/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.strongauthn;

import org.gluu.casa.extension.PreferredMethodFragment;
import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.pf4j.Extension;

/**
 * An extension class implementing the {@link PreferredMethodFragment} extension point.
 * @author jgomer
 */
@Extension
public class StrongAuthnSettingsFragment implements PreferredMethodFragment {

    public String getUrl() {
        return "index.zul";
    }

}
