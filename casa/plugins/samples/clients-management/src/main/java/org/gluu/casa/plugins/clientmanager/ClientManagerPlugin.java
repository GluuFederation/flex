package org.gluu.casa.plugins.clientmanager;

import org.gluu.casa.plugins.clientmanager.model.Client;
import org.gluu.casa.plugins.clientmanager.service.ClientService;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.stream.Collectors;

/**
 * Main class of this project. Note this class is referenced in plugin's manifest file (entry <code>Plugin-Class</code>).
 * <p>See <a href="http://www.pf4j.org/" target="_blank">PF4J</a> plugin framework.</p>
 * @author jgomer
 */
public class ClientManagerPlugin extends Plugin {

    private Logger logger = LoggerFactory.getLogger(getClass());

    public ClientManagerPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {

        /*
        ClientService clientService = new ClientService();
        logger.info("{}", clientService.getClients().stream().map(Client::getDisplayName)
                .collect(Collectors.toList()).toString());
        */
    }

}
