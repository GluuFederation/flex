/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.PluginInfo;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.ui.model.PluginData;
import org.pf4j.PluginDescriptor;
import org.pf4j.PluginManager;
import org.pf4j.PluginState;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.UploadEvent;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class PluginViewModel extends MainViewModel {

    private static final Class<AuthnMethod> AUTHN_METHOD = AuthnMethod.class;

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("extensionsManager")
    private ExtensionsManager extManager;

    private List<PluginData> pluginList;

    private PluginData pluginToShow;

    private boolean uiAdding;

    public List<PluginData> getPluginList() {
        return pluginList;
    }

    public PluginData getPluginToShow() {
        return pluginToShow;
    }

    public boolean isUiAdding() {
        return uiAdding;
    }

    @Init//(superclass = true)
    public void init() {
        //a grid row might look like this: id version (details), state, implements, and control buttons
        pluginList = new ArrayList<>();
        extManager.getPlugins().forEach(wrapper -> pluginList.add(buildPluginData(wrapper)));
    }

    @NotifyChange({"pluginToShow", "uiAdding"})
    @Command
    public void showPlugin(@BindingParam("id") String pluginId) {
        pluginToShow = pluginList.stream().filter(pl -> pl.getDescriptor().getPluginId().equals(pluginId)).findAny().orElse(null);
        uiAdding = false;
    }

    @NotifyChange({"pluginToShow", "uiAdding"})
    @Command
    public void hidePluginDetails() {
        pluginToShow = null;
        uiAdding = false;
    }

    @NotifyChange({"pluginToShow", "uiAdding"})
    @Command
    public void uploaded(@BindingParam("uplEvent") UploadEvent evt) {

        try {
            pluginToShow = null;
            byte[] blob = evt.getMedia().getByteData();
            logger.debug("Size of blob received: {} bytes", blob.length);

            try (JarInputStream jis = new JarInputStream(new ByteArrayInputStream(blob), false)) {

                Manifest m = jis.getManifest();
                if (m != null) {
                    String id = m.getMainAttributes().getValue("Plugin-Id");
                    String version = m.getMainAttributes().getValue("Plugin-Version");
                    String deps = m.getMainAttributes().getValue("Plugin-Dependencies");

                    if (pluginList.stream().anyMatch(pl -> pl.getDescriptor().getPluginId().equals(id))) {
                        UIUtils.showMessageUI(false, Labels.getLabel("adm.plugins_already_existing", new String[] { id }));
                    } else if (Stream.of(id, version).allMatch(Utils::isNotEmpty)) {
                        try {
                            if (Utils.isNotEmpty(deps)) {
                                logger.warn("This plugin reports dependencies. This feature is not available in Gluu Casa");
                                logger.warn("Your plugin may not work properly");
                            }
                            //Copy the jar to plugins dir
                            Path path = Files.write(getPluginDestinationPath(evt.getMedia().getName()), blob, StandardOpenOption.CREATE_NEW);
                            logger.info("Plugin jar file copied to app plugins directory");
                            String pluginId = extManager.loadPlugin(path);

                            if (pluginId == null) {
                                logger.warn("Loading plugin from {} returned no pluginId.", path.toString());
                                //Files.delete(path); //IMPORTANT: See note at method getPluginDestinationPath
                                UIUtils.showMessageUI(false);
                            } else {
                                Optional<PluginWrapper> owrp = extManager.getPlugins().stream()
                                        .filter(wrapper -> wrapper.getPluginId().equals(pluginId)).findAny();
                                if (owrp.isPresent()) {
                                    pluginToShow = buildPluginData(owrp.get());
                                    uiAdding = true;

                                    logger.info("Adding plugin to list of known plugins in settings");
                                    PluginInfo info = new PluginInfo();
                                    info.setId(id);
                                    info.setRelativePath(Paths.get(pluginToShow.getPath()).getFileName().toString());
                                    info.setState(PluginState.STOPPED.toString());

                                    List<PluginInfo> list = Optional.ofNullable(getSettings().getKnownPlugins()).orElse(new ArrayList<>());
                                    list.add(info);
                                    getSettings().setKnownPlugins(list);
                                    getSettings().save();
                                } else {
                                    UIUtils.showMessageUI(false);
                                }
                            }
                        } catch (Exception e) {
                            logger.error(e.getMessage(), e);
                            UIUtils.showMessageUI(false);
                        }
                    } else {
                        UIUtils.showMessageUI(false, Labels.getLabel("adm.plugins_invalid_plugin"));
                        logger.error("Plugin's manifest file missing ID and/or Version");
                    }

                } else {
                    UIUtils.showMessageUI(false, Labels.getLabel("adm.plugins_invalid_plugin"));
                    logger.error("Jar file with no manifest file");
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    @Command
    public void deletePlugin(@BindingParam("id") String pluginId, @BindingParam("provider") String provider) {

        logger.info("Attempting to remove plugin {}", pluginId);
        provider = Utils.isEmpty(provider) ? Labels.getLabel("adm.plugins_nodata") : provider;
        String msg = Labels.getLabel("adm.plugins_confirm_del", new String[] {pluginId, provider});

        Messagebox.show(msg, null, Messagebox.YES | Messagebox.NO, Messagebox.QUESTION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        //IMPORTANT: See note at method getPluginDestinationPath
                        boolean success = extManager.deletePlugin(pluginId);

                        if (success) {
                            PluginData pluginData = pluginList.stream()
                                    .filter(pl -> pl.getDescriptor().getPluginId().equals(pluginId)).findAny().get();
                            logger.trace("Removing plugin from UI list");
                            pluginList.remove(pluginData);

                            removeFromKnownPlugins(pluginId);
                            updateMainSettings();
                            BindUtils.postNotifyChange(null, null, PluginViewModel.this, "pluginList");
                        } else {
                            UIUtils.showMessageUI(false);
                        }
                        hidePluginDetails();
                        BindUtils.postNotifyChange(null, null, PluginViewModel.this, "pluginToShow");
                        BindUtils.postNotifyChange(null, null, PluginViewModel.this, "uiAdding");
                    }
                }
        );
    }

    @NotifyChange({"pluginList", "pluginToShow", "uiAdding"})
    @Command
    public void addPlugin() {

        String id = pluginToShow.getDescriptor().getPluginId();
        boolean success = extManager.startPlugin(id);

        if (success) {
            String started = PluginState.STARTED.toString();
            pluginToShow.setState(Labels.getLabel("adm.plugins_state." + started));
            //populate extension data
            pluginToShow.setExtensions(buildExtensionList(extManager.getPlugin(id)));

            logger.trace("Adding plugin to UI list");
            pluginList.add(pluginToShow);

            PluginInfo pl = getSettings().getKnownPlugins().stream().filter(apl -> apl.getId().equals(id)).findAny().get();
            pl.setState(started);

            updateMainSettings();
            hidePluginDetails();
        } else {
            UIUtils.showMessageUI(false);
            cancelAdd();
        }

    }

    @NotifyChange({"pluginToShow", "uiAdding"})
    @Command
    public void cancelAdd() {

        String plugId = pluginToShow.getDescriptor().getPluginId();
        hidePluginDetails();
        try {
            //IMPORTANT: See note at method getPluginDestinationPath
            if (extManager.deletePlugin(plugId)) {
                removeFromKnownPlugins(plugId);
                getSettings().save();
            } else {
                UIUtils.showMessageUI(false, Labels.getLabel("adm.plugins_error_unloaded"));
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            UIUtils.showMessageUI(false, e.getMessage());
        }

    }

    @NotifyChange({"pluginList", "pluginToShow", "uiAdding"})
    @Command
    public void startPlugin(@BindingParam("id") String pluginId) {

        boolean success = extManager.startPlugin(pluginId);
        if (success) {
            if (pluginToShow!=null && pluginToShow.getExtensions() == null) {
                //This can happen if the plugin was uploaded, but the add button was not pressed
                pluginToShow.setExtensions(buildExtensionList(extManager.getPlugin(pluginId)));
            }

            String started = PluginState.STARTED.toString();
            logger.info("Updating plugin status");

            PluginData pluginData = pluginList.stream().filter(pl -> pl.getDescriptor().getPluginId().equals(pluginId))
                    .findAny().get();
            pluginData.setState(Labels.getLabel("adm.plugins_state." + started));

            PluginInfo pl = getSettings().getKnownPlugins().stream().filter(apl -> apl.getId().equals(pluginId)).findAny().get();
            pl.setState(started);
            updateMainSettings();
        } else {
            UIUtils.showMessageUI(false);
        }
        hidePluginDetails();

    }

    @NotifyChange({"pluginList", "pluginToShow", "uiAdding"})
    @Command
    public void stopPlugin(@BindingParam("id") String pluginId) {

        if (getSettings().getAcrPluginMap().values().contains(pluginId)) {
            Messagebox.show(Labels.getLabel("adm.plugin_plugin_bound_method"), null, Messagebox.OK, Messagebox.EXCLAMATION);
        } else {
            boolean success = extManager.stopPlugin(pluginId);
            if (success) {
                String stopped = PluginState.STOPPED.toString();
                logger.info("Updating plugin status");

                PluginData pluginData = pluginList.stream().filter(pl -> pl.getDescriptor().getPluginId().equals(pluginId))
                        .findAny().get();
                pluginData.setState(Labels.getLabel("adm.plugins_state." + stopped));

                PluginInfo pl = getSettings().getKnownPlugins().stream().filter(apl -> apl.getId().equals(pluginId)).findAny().get();
                pl.setState(stopped);
                updateMainSettings();
            } else {
                UIUtils.showMessageUI(false);
            }
        }
        hidePluginDetails();

    }

    private PluginData buildPluginData(PluginWrapper pw) {

        PluginDescriptor pluginDescriptor = pw.getDescriptor();
        logger.debug("Building a PluginData instance for plugin {}", pw.getPluginId());
        PluginData pl = new PluginData();

        PluginState plState = pw.getPluginState();
        //In practice resolved (that is, just loaded not started) could be seen as stopped
        plState = plState.equals(PluginState.RESOLVED) ? PluginState.STOPPED : plState;

        pl.setState(Labels.getLabel("adm.plugins_state." + plState.toString()));
        pl.setPath(pw.getPluginPath().toString());
        pl.setDescriptor(pluginDescriptor);

        if (PluginState.STARTED.equals(plState)) {
            //pf4j doesn't give any info if not in started state
            pl.setExtensions(buildExtensionList(pw));
        }

        return pl;

    }

    private List<String> buildExtensionList(PluginWrapper wrapper) {

        List<String> extList = new ArrayList<>();
        PluginManager manager = wrapper.getPluginManager();
        String pluginId = wrapper.getPluginId();
        logger.trace("Building human-readable extensions list for plugin {}", pluginId);

        //plugin manager's getExtension methods outputs data only when the plugin is already started! (not simply loaded)
        for (Object obj : manager.getExtensions(pluginId)) {
            Class cls = obj.getClass();

            if (!AUTHN_METHOD.isAssignableFrom(cls)) {
                extList.add(getExtensionLabel(
                        Stream.of(cls.getInterfaces()).findFirst().map(Class::getName).orElse(""),
                        cls.getSimpleName()));
            }
        }

        for (AuthnMethod method : manager.getExtensions(AUTHN_METHOD, pluginId)) {
            String text = Labels.getLabel(method.getUINameKey());
            String acr = method.getAcr();

            if (Optional.ofNullable(getSettings().getAcrPluginMap().get(acr)).map(id -> pluginId.equals(id)).orElse(false)) {
                text += Labels.getLabel("adm.plugins_acr_handler", new String[]{ acr });
            }
            extList.add(getExtensionLabel(AUTHN_METHOD.getName(), text));
        }

        return extList;

    }

    private String getExtensionLabel(String clsName, Object ...args) {
        String text = Labels.getLabel("adm.plugins_extension." + clsName, args);
        return text == null ? clsName.substring(clsName.lastIndexOf(".") + 1) : text;
    }

    private Path getPluginDestinationPath(String fileName) {

        if (Utils.onWindows()) {
            /*
            Add some "random" suffix since the same file can be uploaded multiples because as explained at
            https://github.com/pf4j/pf4j/issues/217, there is no effective means to delete a plugin jar file
            */
            String suffix = Long.toString(System.currentTimeMillis());
            int aux = suffix.length();
            suffix = "_" + suffix.substring(aux - 5, aux);

            aux = fileName.lastIndexOf(".");
            aux = aux == -1 ? fileName.length() : aux;
            fileName = fileName.substring(0, aux) + suffix + ".jar";
        }
        return Paths.get(extManager.getPluginsRoot().toString(), fileName);

    }

    private void removeFromKnownPlugins(String pluginId) {
        //This list is not null here and there has to be such plugin in the list
        List<PluginInfo> list = getSettings().getKnownPlugins();
        PluginInfo pl = list.stream().filter(apl -> apl.getId().equals(pluginId)).findAny().get();
        list.remove(pl);

    }

}
