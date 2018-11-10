/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.core.UserService;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.ui.model.AuthnMethodStatus;
import org.pf4j.DefaultPluginDescriptor;
import org.pf4j.PluginDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class AuthnMethodsViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("configurationHandler")
    private ConfigurationHandler confHandler;

    @WireVariable("extensionsManager")
    private ExtensionsManager extManager;

    @WireVariable
    private UserService userService;

    private List<AuthnMethodStatus> methods;

    public List<AuthnMethodStatus> getMethods() {
        return methods;
    }

    @Init
    public void init() {

        List<PluginDescriptor> currentPlugins = extManager.authnMethodPluginImplementers();
        //Add "null" (allows to account for system extensions)
        currentPlugins.add(0, new DefaultPluginDescriptor(null, null, null, "1.0", null, null, null));

        Map<String, String> mappedAcrs = getSettings().getAcrPluginMap();

        //This set contains entries associated to active acr methods in oxauth
        Set<String> serverAcrs = Optional.ofNullable(confHandler.retrieveAcrs()).orElse(Collections.emptySet());

        //These are authn methods belonging to a started plugin or system extension with a corresponding custom script enabled
        Set<String> uniqueAcrs = extManager.getAuthnMethodExts(currentPlugins.stream().map(PluginDescriptor::getPluginId).collect(Collectors.toSet()))
                .stream().map(AuthnMethod::getAcr).distinct().filter(serverAcrs::contains).collect(Collectors.toSet());

        logger.info("The following acrs have a corresponding plugin or system extension: {}", uniqueAcrs);
        methods = new ArrayList<>();

        for (String acr : uniqueAcrs) {
            AuthnMethodStatus ams = new AuthnMethodStatus();
            ams.setAcr(acr);
            ams.setEnabled(mappedAcrs.keySet().contains(acr));
            ams.setDeactivable(!ams.isEnabled() || userService.zeroPreferences(acr));

            List<Pair<String, String>> plugins = new ArrayList<>();
            //After this loop, plugins variable should not be empty
            for (PluginDescriptor de : currentPlugins) {
                String id = de.getPluginId();

                if (extManager.pluginImplementsAuthnMethod(acr, id)) {
                    String displayName = id == null ? Labels.getLabel("adm.method_sysextension")
                            : Labels.getLabel("adm.method_plugin_template", new String[] {id, de.getVersion()});
                    plugins.add(new Pair<>(id, displayName));
                }
            }

            ams.setPlugins(plugins);
            //Use as selected the one already in the acr/plugin mapping, or if missing, the first plugin known to
            //implement the behavior
            ams.setSelectedPlugin(mappedAcrs.getOrDefault(acr, plugins.get(0).getX()));

            //Pick the name for it
            AuthnMethod aMethod = extManager.getAuthnMethodExts(Collections.singleton(ams.getSelectedPlugin()))
                    .stream().filter(am -> am.getAcr().equals(acr)).findFirst().get();
            ams.setName(Labels.getLabel(aMethod.getUINameKey()));

            methods.add(ams);
        }

    }

    @Command
    public void selectionChanged(@BindingParam("acr") String acr, @BindingParam("index") int index) {
        //Finds the right entry in methods and update selectedPlugin member
        AuthnMethodStatus authnMethodStatus = methods.stream().filter(ams -> ams.getAcr().equals(acr)).findAny().get();
        Pair<String, String> pair = authnMethodStatus.getPlugins().get(index);
        logger.trace("Plugin '{}' has been selected for handling acr '{}'", pair.getY(), acr);
        authnMethodStatus.setSelectedPlugin(pair.getX());
    }

    @Command
    public void save() {

        Map<String, String> pluginMapping = new HashMap<>();
        methods.stream().filter(AuthnMethodStatus::isEnabled).forEach(ams -> pluginMapping.put(ams.getAcr(), ams.getSelectedPlugin()));

        logger.info("New plugin mapping will be: {}", pluginMapping);
        getSettings().setAcrPluginMap(pluginMapping);
        updateMainSettings();

    }

}
