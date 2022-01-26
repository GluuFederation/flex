package org.gluu.casa.plugins.accounts.service.enrollment;

import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;

/**
 * @author jgomer
 */
public interface ProviderEnrollmentManager {

    IPersistenceService persistenceService = Utils.managedBean(IPersistenceService.class);

    String getUid(IdentityPerson p, boolean linked);
    boolean link(IdentityPerson p, String externalId);
    boolean remove(IdentityPerson p);
    boolean unlink(IdentityPerson p);
    boolean enable(IdentityPerson p);
    boolean isAssigned(String uid);

}
