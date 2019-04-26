package org.gluu.casa.plugins.accounts.service;

import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.accounts.pojo.ExternalAccount;
import org.gluu.casa.plugins.accounts.pojo.Provider;
import org.gluu.casa.service.IPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * @author jgomer
 */
public class AccountLinkingService {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private IPersistenceService persistenceService;

    public AccountLinkingService() {
        persistenceService = Utils.managedBean(IPersistenceService.class);
    }

    public List<ExternalAccount> getAccounts(String id, boolean linked) {

        List<ExternalAccount> externalAccts = new ArrayList<>();
        IdentityPerson p = getPerson(id);

        for (Provider provider : AvailableProviders.get()) {
            String uid = provider.getEnrollmentManager().getUid(p, linked);
            //A null value indicates this provider isn't linked/unlinked for this user
            if (uid != null) {

                ExternalAccount acc = new ExternalAccount();
                acc.setProvider(provider);
                acc.setUid(uid);
                externalAccts.add(acc);
            }
        }
        return externalAccts;

    }

    public boolean link(String id, String provider, String externalId) {
        IdentityPerson p = getPerson(id);
        Provider op = AvailableProviders.getByName(provider).get(); //Assume it exists
        return op.getEnrollmentManager().link(p, externalId);
    }

    public boolean unlink(String id, Provider provider) {
        return provider.getEnrollmentManager().unlink(getPerson(id));
    }

    public boolean enableLink(String id, Provider provider) {
        return provider.getEnrollmentManager().enable(getPerson(id));
    }

    public boolean delete(String id, Provider provider) {
        return provider.getEnrollmentManager().remove(getPerson(id));
    }

    public boolean hasPassword(String id) {
        return getPerson(id).hasPassword();
    }
    
    private IdentityPerson getPerson(String id) {
        return persistenceService.get(IdentityPerson.class, persistenceService.getPersonDn(id));   
    }
    
}
