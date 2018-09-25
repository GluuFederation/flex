/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import org.gluu.casa.core.label.PluginLabelLocator;
import org.gluu.casa.core.label.SystemLabelLocator;
import org.gluu.casa.misc.CssRulesResolver;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.WebApp;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.*;

/**
 * @author jgomer
 */
@Named("zkService")
@ApplicationScoped
public class ZKService {

    public static final String EXTERNAL_LABELS_DIR = "labels";
    private static final String SYS_LABELS_LOCATION = "/WEB-INF/classes/labels/";

    @Inject
    private Logger logger;

    @Inject
    private ConfigurationHandler confHandler;

    private String contextPath;

    private String appName;

    private Map<String, PluginLabelLocator> labelLocators;

    private ServletContext servletContext;

    @PostConstruct
    private void inited() {
        labelLocators = new HashMap<>();
        logger.info("ZK initialized");
    }

    public void init(WebApp app) {

        try {
            confHandler.init();

            appName = app.getAppName();
            servletContext = app.getServletContext();
            contextPath = servletContext.getContextPath();
            CssRulesResolver.init(servletContext);

            readSystemLabels();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    public String getAppName() {
        return appName;
    }

    public String getContextPath() {
        return contextPath;
    }

    private void readSystemLabels() {

        Set<String> labelsListing = servletContext.getResourcePaths(SYS_LABELS_LOCATION);

        if (labelsListing == null) {
            logger.warn("No application labels will be available. Check '{}' contains properties files", SYS_LABELS_LOCATION);
        } else {
            logger.info("Loading application labels");
            labelsListing.stream().filter(path -> path.endsWith(".properties"))
                    .map(path -> {
                        try {
                            return servletContext.getResource(path).toString();
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
        return servletContext.getRealPath("/");
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

    byte[] getResourceBytes(String path) throws Exception {

        InputStream stream = servletContext.getResourceAsStream(path);
        List<byte[]> list = new ArrayList<>();
        int l = 0;

        int chunkSize = 8192;
        byte[] b = new byte[chunkSize];
        int read = stream.read(b);

        while (read > 0) {
            l += read;
            list.add(b);
            b = new byte[chunkSize];
            read = stream.read(b);
        }

        int k = 0;
        b = new byte[l];
        for (int i = 0; i < list.size() - 1; i++) {
            for (int j = 0; j < chunkSize; j++) {
                b[k++] = list.get(i)[j];
            }
        }

        int j = 0;
        while (k < l) {
            b[k++] = list.get(list.size() - 1)[j++];
        }
        return b;

    }

}
