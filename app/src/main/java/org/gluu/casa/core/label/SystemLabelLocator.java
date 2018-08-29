/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.label;

import org.zkoss.util.resource.LabelLocator;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;

/**
 * @author jgomer
 */
public class SystemLabelLocator implements LabelLocator {

    private String path;

    public SystemLabelLocator(String path) {
        this.path = path;
    }

    public URL locate(Locale locale) throws MalformedURLException {

        String location = null;

        if (locale == null) {
            if (path.substring(path.lastIndexOf("/")).indexOf("_") == -1) {
                location = path;
            }
        } else {
            if (path.endsWith(locale.toString())) {
                location = path;
            }
        }
        return location == null ? null : new URL(location + ".properties");

    }

}
