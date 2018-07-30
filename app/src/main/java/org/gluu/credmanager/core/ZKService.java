/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core;

import org.gluu.credmanager.core.label.PluginLabelLocator;
import org.gluu.credmanager.core.label.SystemLabelLocator;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.ui.vm.admin.branding.CssSnippetHandler;
import org.slf4j.Logger;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.WebApp;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.ServletContext;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @author jgomer
 */
@Named("zkService")
@ApplicationScoped
public class ZKService {

    public static final String EXTERNAL_LABELS_DIR = "labels";
    public static final String DEFAULT_CUSTOM_PATH = "/custom";

    private static final String DEFAULT_LOGO_URL = "/images/logo.png";
    private static final String DEFAULT_FAVICON_URL = "/images/favicon.ico";
    private static final String SYS_LABELS_LOCATION = "/WEB-INF/classes/labels/";

    @Inject
    private Logger logger;

    @Inject
    private ConfigurationHandler confHandler;

    @Inject
    private RSRegistryHandler registryHandler;

    private String logoDataUri;

    private String faviconDataUri;

    private WebApp app;

    private Map<String, PluginLabelLocator> labelLocators;

    @PostConstruct
    private void inited() {
        labelLocators = new HashMap<>();
        logger.info("ZK initialized");
    }

    public void init(WebApp app) {

        try {
            this.app = app;
            confHandler.init();
            //This attribute is stored here for future use inside zul templates
            app.setAttribute("appName", app.getAppName());

            String cssSnippet = confHandler.getSettings().getExtraCssSnippet();
            if (Utils.isNotEmpty(cssSnippet)) {
                CssSnippetHandler snippetHandler = new CssSnippetHandler(cssSnippet);
                setFaviconDataUri(snippetHandler.getFaviconDataUri());
                setLogoDataUri(snippetHandler.getLogoDataUri());
            } else {
                String prefix = getAssetsPrefix();
                resetLogoDataUriEncoding(prefix);
                resetFaviconDataUriEncoding(prefix);
            }
            readSystemLabels();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    public String getAssetsPrefix() {
        return Utils.isEmpty(confHandler.getSettings().getBrandingPath()) ? "" : DEFAULT_CUSTOM_PATH;
    }

    public String getLogoDataUri() {
        return logoDataUri;
    }

    public void setLogoDataUri(String logoDataUri) {
        this.logoDataUri = logoDataUri;
    }

    public String getFaviconDataUri() {
        return faviconDataUri;
    }

    public void setFaviconDataUri(String faviconDataUri) {
        this.faviconDataUri = faviconDataUri;
    }

    public void resetLogoDataUriEncoding(String prefix) {
        prefix = Utils.isEmpty(prefix) ? "" : prefix + "/";
        logoDataUri = getDataUriEncoding(prefix + DEFAULT_LOGO_URL);
    }

    public void resetFaviconDataUriEncoding(String prefix) {
        prefix = Utils.isEmpty(prefix) ? "" : prefix + "/";
        faviconDataUri = getDataUriEncoding(prefix + DEFAULT_FAVICON_URL);
    }

    private String getDataUriEncoding(String url) {

        String encoded = null;
        try {
            int i = url.lastIndexOf("/");
            String fileName = i == -1 ? null : url.substring(i + 1);

            byte[] bytes = Files.readAllBytes(Paths.get(getAppFileSystemRoot(), url.split("/")));
            encoded = Utils.getImageDataUriEncoding(bytes, fileName);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return encoded;

    }

    private void readSystemLabels() {

        ServletContext context = app.getServletContext();
        Set<String> labelsListing = context.getResourcePaths(SYS_LABELS_LOCATION);

        if (labelsListing == null) {
            logger.warn("No application labels will be available. Check '{}' contains properties files", SYS_LABELS_LOCATION);
        } else {
            logger.info("Loading application labels");
            labelsListing.stream().filter(path -> path.endsWith(".properties"))
                    .map(path -> {
                        try {
                            return context.getResource(path).toString();
                        } catch (MalformedURLException e) {
                            logger.error("Error converting path {} to URL", path);
                            return null;
                        }
                    })
                    .filter(Utils::isNotEmpty)
                    .map(strUrl -> new SystemLabelLocator(strUrl.substring(0, strUrl.lastIndexOf("."))))
                    .forEach(Labels::register);
        }

    }

    String getAppFileSystemRoot() {
        return app.getServletContext().getRealPath("/");
    }

    void readPluginLabels(String id, Path path) {
        logger.info("Registering labels of plugin {}", id);
        PluginLabelLocator pll = new PluginLabelLocator(path, EXTERNAL_LABELS_DIR);
        labelLocators.put(id, pll);
        Labels.register(pll);
    }

    void removePluginLabels(String id) {
        try {
            PluginLabelLocator locator = labelLocators.get(id);
            if (locator != null) {
                logger.debug("Closing label locator {}", id);
                labelLocators.remove(id);
                locator.close();
            }
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }

    }

    void refreshLabels() {
        logger.info("Refreshing labels");
        //labelLocators.values().forEach(Labels::register);
        Labels.reset();
    }

}
