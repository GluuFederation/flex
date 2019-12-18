package org.gluu.casa.plugins.clientmanager.service;

import org.gluu.casa.plugins.clientmanager.model.Client;
import org.gluu.casa.plugins.clientmanager.model.Owner;
import org.gluu.casa.service.IPersistenceService;

import java.util.*;
import java.util.stream.Collectors;

public class ClientService {

    private IPersistenceService persistenceService;

    public ClientService() {
        persistenceService = org.gluu.casa.misc.Utils.managedBean(IPersistenceService.class);
    }

    public List<Client> getClients() {
        return persistenceService.find(Client.class, persistenceService.getClientsDn(), null);
    }

    public List<Owner> getOwnersOf(Client cl) {

        List<Owner> owners = new ArrayList<>();
        List<String> dns = Optional.ofNullable(cl.getOwners()).orElse(Collections.emptyList());
        dns.forEach(dn -> owners.add(persistenceService.get(Owner.class, dn)));

        return owners;

    }

    //Here we assume client has at least one owner
    public boolean removeOwnerFrom(Client client, String personDN) {

        //Just doing client.getOwners().remove(personDN) throws UnsupportedOperationException
        List<String> ownersList = new ArrayList<>(client.getOwners());
        ownersList.remove(personDN);
        client.setOwners(ownersList);

        //Persist changes
        return persistenceService.modify(client);

    }

    public boolean addOwnerTo(Client client, Owner owner) {

        Set<String> owners = new HashSet<>(Optional.ofNullable(client.getOwners()).orElse(Collections.emptyList()));
        owners.add(owner.getDn());
        client.setOwners(new ArrayList<>(owners));

        //Persist changes
        return persistenceService.modify(client);

    }

}
