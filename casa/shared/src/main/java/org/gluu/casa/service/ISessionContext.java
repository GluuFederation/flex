package org.gluu.casa.service;

import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.User;

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
