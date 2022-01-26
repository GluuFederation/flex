package org.gluu.casa.plugins.consent.service;

import org.gluu.casa.core.model.BasePerson;
import org.gluu.casa.core.model.Client;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Small utility for OpenID clients
 * @author jgomer
 */
public class ClientService {

    private IPersistenceService persistenceService;

    public ClientService() {
        persistenceService = Utils.managedBean(IPersistenceService.class);
    }

    public List<String> getAssociatedPeople(Client client) {
        List<String> dns = client.getAssociatedPeople();

        return dns.stream().map(dn -> persistenceService.get(BasePerson.class, dn))
                .filter(person -> person != null).map(BasePerson::getUid).collect(Collectors.toList());

    }

}
