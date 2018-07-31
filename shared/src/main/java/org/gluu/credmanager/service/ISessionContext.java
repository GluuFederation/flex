/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.service;

import org.gluu.credmanager.core.pojo.BrowserInfo;
import org.gluu.credmanager.core.pojo.User;

/**
 * An interface providing methods with basic descriptive information about the current user's session.
 * @author jgomer
 */
public interface ISessionContext {

    /**
     * Returns an object representing the current logged user.
     * @return An instance of {@link User} class or null if there is no user logged currently
     */
    User getLoggedUser();

    /**
     * Provides descriptive information about the current browser session. See {@link BrowserInfo} class.
     * @return A non-null {@link BrowserInfo} instance
     */
    BrowserInfo getBrowser();

}
