/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by jgomer on 2018-09-24.
 */
@Named
@ApplicationScoped
public class AssetsService {

    public static final String CUSTOM_FILEPATH = System.getProperty("server.base") + File.separator + "static";

    private static final String DEFAULT_LOGO_URL = "/images/logo.png";
    private static final String DEFAULT_FAVICON_URL = "/images/favicon.ico";
    private static final String DEFAULT_CUSTOM_PATH = "/custom";

    @Inject
    private Logger logger;

    @Inject
    private ZKService zkService;

    @Inject
    private ConfigurationHandler confHandler;

    private MainSettings mainSettings;

    private String logoUrl;

    private String faviconUrl;

    private String originalLogoDataUri;

    private String originalFaviconDataUri;

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getFaviconUrl() {
        return faviconUrl;
    }
/*
TODO remove commented code
    public String getOriginalLogoDataUri() {
        return originalLogoDataUri;
    }

    public String getOriginalFaviconDataUri() {
        return originalFaviconDataUri;
    }
*/
    public String getPrefix() {
        return mainSettings.isUseExternalBranding() ? DEFAULT_CUSTOM_PATH : "";
    }

    public void reloadUrls() {

        logoUrl = DEFAULT_LOGO_URL;
        faviconUrl = DEFAULT_FAVICON_URL;
        String customLogoUrl = DEFAULT_CUSTOM_PATH + DEFAULT_LOGO_URL;
        String customFaviconUrl = DEFAULT_CUSTOM_PATH + DEFAULT_FAVICON_URL;

        if (Utils.isNotEmpty(mainSettings.getExtraCssSnippet())) {
            if (Files.isRegularFile(getCustomPathForLogo())) {
                logoUrl = customLogoUrl;
            }
            if (Files.isRegularFile(getCustomPathForFavicon())) {
                faviconUrl = customFaviconUrl;
            }
        } else if (mainSettings.isUseExternalBranding()) {
            logoUrl = customLogoUrl;
            faviconUrl = customFaviconUrl;
        }

    }

    public Path getCustomPathForLogo() {
        return Paths.get(CUSTOM_FILEPATH, DEFAULT_LOGO_URL.split("/"));
    }

    public Path getCustomPathForFavicon() {
        return Paths.get(CUSTOM_FILEPATH, DEFAULT_FAVICON_URL.split("/"));
    }

    public byte[] getDefaultLogoBytes() {
        return getBytesOf(DEFAULT_LOGO_URL);
    }

    public byte[] getDefaultFaviconBytes() {
        return getBytesOf(DEFAULT_FAVICON_URL);
    }

    private byte[] getBytesOf(String relativePath) {

        try {
            logger.info("Getting bytes of {}", relativePath);
            return zkService.getResourceBytes(relativePath);
        } catch (Exception e){
            logger.error(e.getMessage(), e);
            return null;
        }

    }

    @PostConstruct
    private void init() {
        mainSettings = confHandler.getSettings();
        reloadUrls();
/*
        String root = zkService.getAppFileSystemRoot() + File.separator;
        originalLogoDataUri = getDataUriFor(DEFAULT_LOGO_URL, root);
        originalFaviconDataUri = getDataUriFor(DEFAULT_FAVICON_URL, root);*/

    }

}
