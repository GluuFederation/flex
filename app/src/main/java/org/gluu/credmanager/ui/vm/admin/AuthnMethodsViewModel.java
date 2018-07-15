/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.ui.vm.admin;

import org.gluu.credmanager.core.ConfigurationHandler;
import org.gluu.credmanager.core.ExtensionsManager;
import org.gluu.credmanager.core.UserService;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.ui.model.AuthnMethodStatus;
import org.pf4j.PluginDescriptor;
import org.pf4j.PluginState;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Listitem;
import org.zkoss.zul.Messagebox;

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

    @Init//(superclass = true)
    public void init() {

        List<PluginDescriptor> currentPlugins = extManager.authnMethodPluginImplementersStarted();
        Map<String, String> mappedAcrs = getSettings().getAcrPluginMap();
        //The following map contains entries associated to active acr methods in oxauth
        Map<String, Integer> authnMethodLevels = confHandler.getAcrLevelMapping();
        //These are the acrs which have a corresponding plugin or system extension implemented for it
        List<AuthnMethod> list = extManager.getAuthnMethodExts().stream().filter(aMethod -> authnMethodLevels.containsKey(aMethod.getAcr()))
                .sorted(Comparator.comparing(aMethod -> -authnMethodLevels.get(aMethod.getAcr()))).collect(Collectors.toList());

        methods = new ArrayList<>();
        for (AuthnMethod aMethod : list) {
            String acr = aMethod.getAcr();
            AuthnMethodStatus ams = new AuthnMethodStatus();
            ams.setAcr(acr);
            ams.setName(Labels.getLabel(aMethod.getUINameKey()));
            ams.setEnabled(mappedAcrs.keySet().contains(acr));

            List<Pair<String, String>> plugins = new ArrayList<>();
            for (PluginDescriptor de : currentPlugins) {
                String id = de.getPluginId();
                if (extManager.pluginImplementsAuthnMethod(id, acr)) {
                    plugins.add(new Pair<>(id, Labels.getLabel("adm.method_plugin_template", new String[] {id, de.getVersion()})));
                }
            }
            if (plugins.size() == 0) {
                plugins.add(new Pair<>(null, Labels.getLabel("adm.method_sysextension")));
            }
            ams.setPlugins(plugins);
            ams.setSelectedPugin(mappedAcrs.get(acr));

            methods.add(ams);
        }

    }

    @Command
    public void selectionChanged(@BindingParam("evt") SelectEvent<Listitem, Pair<String, String>> event, @BindingParam("acr") String acr) {
        String pluginId = event.getSelectedObjects().stream().map(Pair::getX).findAny().get();
        //Finds the right entry in methods and updates selectedPlugin member
        methods.stream().filter(ams -> ams.getAcr().equals(acr)).findAny().get().setSelectedPugin(pluginId);
    }

    @NotifyChange("methods")
    @Command
    public void checkMethod(@BindingParam("acr") String acr, @BindingParam("checked") boolean checked){

        AuthnMethodStatus methodStatus = methods.stream().filter(ams -> ams.getAcr().equals(acr)).findAny().get();
        methodStatus.setEnabled(checked);

        if (!checked && !userService.zeroPreferences(acr)) {    //Was it disabled and still there are people with such preference?
            Messagebox.show(Labels.getLabel("adm.methods_existing_credentials", new String[]{ acr }), null,
                    Messagebox.OK, Messagebox.EXCLAMATION);
            //revert it to enabled
            methodStatus.setEnabled(true);
        }
    }

    @Command
    public void save() {

        Map<String, String> pluginMapping = methods.stream().filter(AuthnMethodStatus::isEnabled)
                .collect(Collectors.toMap(AuthnMethodStatus::getAcr, AuthnMethodStatus::getSelectedPugin));
        getSettings().setAcrPluginMap(pluginMapping);
        updateMainSettings();

    }

}
