package org.gluu.casa.plugins.clientmanager;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.clientmanager.model.Client;
import org.gluu.casa.plugins.clientmanager.model.Owner;
import org.gluu.casa.plugins.clientmanager.service.ClientService;
import org.gluu.casa.service.IPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ClientManagerVM {

    private Logger logger = LoggerFactory.getLogger(getClass());
    private IPersistenceService persistenceService;

    private ClientService cs;
    private Map<String, String> people;
    private List<Client> clients;

    private Client addingTo;
    private String searchMessage;
    private String searchPattern;

    public List<Client> getClients() {
        return clients;
    }

    public Map<String, String> getPeople() {
        return people;
    }

    public Client getAddingTo() {
        return addingTo;
    }

    public String getSearchMessage() {
        return searchMessage;
    }

    public String getSearchPattern() {
        return searchPattern;
    }

    //This setter is needed due to the @bind found in index.zul (it allows 2-way sync of this field)
    public void setSearchPattern(String searchPattern) {
        this.searchPattern = searchPattern;
    }

    //This method is called just before the page is rendered
    @Init
    public void init() {

        cs = new ClientService();
        clients = cs.getClients();

        people = new HashMap<>();
        for (Client client : clients) {
            cs.getOwnersOf(client).forEach(owner -> people.put(owner.getDn(), owner.getFormattedName()));
        }
        persistenceService = Utils.managedBean(IPersistenceService.class);

    }

    @NotifyChange("addingTo")
    public void prepareForAdd(Client client) {
        addingTo = client;
    }

    @NotifyChange({"addingTo", "searchMessage"})
    public void cancelAdd() {
        addingTo = null;
        searchPattern = null;
        searchMessage = null;
    }

    @NotifyChange({"people", "clients"})
    //clients member field does not change per se (but its owners), so we put it in the annotation to refresh
    //the form appropriately when removing someone
    public void remove(Client client, String personDN) {

        logger.info("Removing person {} from client '{}'", personDN, client.getDisplayName());
        if (cs.removeOwnerFrom(client, personDN)) {
            //This is not really necessary. We could let the map DN vs. name grow indefinitely. "people" in @NotifyChange could be dropped too
            people.remove(personDN);
        }

    }

    @NotifyChange("*")
    public void search() {

        if (Utils.isNotEmpty(searchPattern)) {
            Owner sampleOwner = new Owner();
            sampleOwner.setBaseDn(persistenceService.getPeopleDn());
            sampleOwner.setUid(searchPattern);

            sampleOwner = persistenceService.find(sampleOwner).stream().findFirst().orElse(null);
            if (sampleOwner == null) {
                searchMessage = Labels.getLabel("clientsM.not_found", new String[]{searchPattern});
            } else if (cs.addOwnerTo(addingTo, sampleOwner)) {

                String dn = sampleOwner.getDn();
                logger.info("Adding person {} to client '{}'", dn, addingTo.getDisplayName());
                people.put(dn, sampleOwner.getFormattedName());
                //Simulate a click on cancel button to close the window
                cancelAdd();
            }
        }

    }

}
