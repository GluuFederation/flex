package org.gluu.casa.plugins.consent.service;

import org.gluu.casa.plugins.consent.model.Client;
import org.gluu.casa.plugins.consent.model.ClientAuthorization;
import org.gluu.casa.plugins.consent.model.Scope;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.consent.model.Token;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.search.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Handles client authorizations for a user
 * @author jgomer
 */
public class ClientAuthorizationsService {

    private Logger logger = LoggerFactory.getLogger(getClass());
    private IPersistenceService persistenceService;

    public ClientAuthorizationsService() {
        persistenceService = Utils.managedBean(IPersistenceService.class);
    }

    public Map<Client, Set<Scope>> getUserClientPermissions(String userId) {

        List<ClientAuthorization> authorizations = persistenceService.find(ClientAuthorization.class, authorizationDNOf(userId), null);

        //Obtain client ids from all this user's client authorizations
        Set<String> clientIds = authorizations.stream().map(ClientAuthorization::getOxAuthClientId).collect(Collectors.toSet());

        //Create a filter based on client Ids, alternatively one can make n queries to obtain client references one by one
        Filter[] filters = clientIds.stream().map(id -> Filter.createEqualityFilter("inum", id))
                .collect(Collectors.toList()).toArray(new Filter[]{});
        List<Client> clients = persistenceService.find(Client.class, persistenceService.getClientsDn(), Filter.createORFilter(filters));

        //Obtain all scope ids ... displayNames :(
        Set<String> scopeNames = authorizations.stream().map(ClientAuthorization::getScopes).flatMap(List::stream)
                .collect(Collectors.toSet());

        //Do the analog for scopes
        filters = scopeNames.stream().map(id -> Filter.createEqualityFilter("displayName", id))
                .collect(Collectors.toList()).toArray(new Filter[]{});
        List<Scope> scopes = persistenceService.find(Scope.class, persistenceService.getScopesDn(), Filter.createORFilter(filters));

        logger.info("Found {} client authorizations for user {}", clients.size(), userId);
        Map<Client, Set<Scope>> perms = new HashMap<>();

        for (Client client : clients) {
            Set<Scope> clientScopes = new HashSet<>();

            for (ClientAuthorization auth : authorizations) {
                if (auth.getOxAuthClientId().equals(client.getInum())) {
                    for (String scopeName : auth.getScopes()) {
                        scopes.stream().filter(sc -> sc.getDisplayName().equals(scopeName)).findAny().ifPresent(clientScopes::add);
                    }
                }
            }
            perms.put(client, clientScopes);
        }

        return perms;

    }

    public void removeClientAuthorizations(String userId, String userName, String clientId) {

        ClientAuthorization sampleAuth = new ClientAuthorization();
        sampleAuth.setOxAuthClientId(clientId);
        sampleAuth.setDn(authorizationDNOf(userId));

        logger.info("Removing client authorizations for user {}", userName);
        //Here we ignore the return value of deletion
        persistenceService.find(sampleAuth).forEach(auth -> persistenceService.delete(auth));

        Token sampleToken = new Token();
        sampleToken.setBaseDn(persistenceService.getClientsDn());
        sampleToken.setOxAuthClientId(clientId);
        sampleToken.setOxAuthTokenType("refresh_token");
        sampleToken.setOxAuthUserId(userName);

        logger.info("Removing refresh tokens associated to this user/client pair");
        //Here we ignore the return value of deletion
        persistenceService.find(sampleToken).forEach(token -> {
                    logger.debug("Deleting token {}", token.getUniqueIdentifier());
                    persistenceService.delete(token);
                });

    }

    private String authorizationDNOf(String userId) {
        return "ou=clientAuthorizations," + persistenceService.getPersonDn(userId);
    }

}
