package org.gluu.casa.service;

import org.gluu.casa.core.pojo.User;
import org.gluu.casa.credential.CredentialRemovalConflict;
import org.zkoss.util.Pair;

/**
 * Contains methods to facilitate certain operations related to strong authentication
 */
public interface SndFactorAuthenticationUtils {

    /**
     * Turns second factor authentication on for a user. A call to this method provokes changes in the underlying database.
     * @param user Object representing the user. It is altered if the operation outcome is true: member preferredMethod is
     *             set to a non-null value. Formerly, in version 3.1.x, preferredMethod used to be an ACR value.
     * @return Whether the operation was successful or not
     */
    boolean turn2faOn(User user);

    /**
     * Turns second factor authentication off for a user. A call to this method provokes changes in the underlying database.
     * @param user Object representing the user. It is altered if the operation outcome is true: member preferredMethod is
     *             set to null.
     * @return Whether the operation was successful or not
     */
    boolean turn2faOff(User user);

    /**
     * Method to support removal of credentials for a user. It helps simulate what would happen in case a credential of
     * a certain type is removed. This method does not change any actual data.
     * @param credentialType The type of credential to be removed (an ACR value)
     * @param nCredsOfType Number of credentials of this type the user has already enrolled
     * @param user Object representing the user upon which the operation would take place
     * @return A 2-tuple. The first, a value from {@link CredentialRemovalConflict} (null if there would not be
     * any conflict in case of removal). The second, a String containing a suitable end-user message to be displayed so
     * the user can easily understand the effect of the removal operation (null if there is no conflict)
     */
    Pair<CredentialRemovalConflict, String> removalConflict(String credentialType, int nCredsOfType, User user);

}
