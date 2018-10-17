/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.extension;

import org.pf4j.ExtensionPoint;

/**
 * @author jgomer
 */
public interface PreferredMethodFragment extends ExtensionPoint {

    /**
     * The URL of (potentially zul) content that will be included when 2fa is enabled in users home page (when a method
     * other than password is selected)
     * @return A string representing a relative URL.
     */
    String getUrl();

}
