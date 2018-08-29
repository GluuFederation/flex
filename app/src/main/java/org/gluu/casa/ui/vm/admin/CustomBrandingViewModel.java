/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ZKService;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.ui.vm.admin.branding.BrandingOption;
import org.gluu.casa.ui.vm.admin.branding.CssSnippetHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.image.Image;
import org.zkoss.util.media.Media;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.UploadEvent;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class CustomBrandingViewModel extends MainViewModel {

    private static final String GLUU_LOGO_URL = "/images/default_logo.png";

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("zkService")
    private ZKService zkService;

    private MainSettings settings;

    private BrandingOption brandingOption;

    private CssSnippetHandler snippetHandler;

    private boolean uiOverrideButtonColors;

    public String getBrandingOption() {
        return brandingOption.toString();
    }

    public CssSnippetHandler getSnippetHandler() {
        return snippetHandler;
    }

    public boolean isUiOverrideButtonColors() {
        return uiOverrideButtonColors;
    }

    @Init//(superclass = true)
    public void init() {
        settings = getSettings();
        boolean pathPresent = settings.isUseExternalBranding();
        boolean cssSnippetPresent = Utils.isNotEmpty(settings.getExtraCssSnippet());

        if (pathPresent) {
            brandingOption = BrandingOption.EXTERNAL_PATH;
        } else if (cssSnippetPresent) {
            brandingOption = BrandingOption.EXTRA_CSS;
        } else {
            brandingOption = BrandingOption.NONE;
        }
        changeBranding(brandingOption.toString());

    }

    @NotifyChange({"brandingOption", "snippetHandler", "brandingPath", "uiOverrideButtonColors"})
    @Command
    public void changeBranding(@BindingParam("val") String option) {

        brandingOption = BrandingOption.valueOf(option);
        if (brandingOption.equals(BrandingOption.EXTRA_CSS)) {
            snippetHandler = new CssSnippetHandler(settings.getExtraCssSnippet());
            if (snippetHandler.getFaviconDataUri() == null) {
                snippetHandler.setFaviconDataUri(zkService.getFaviconDataUri());
            }
            if (snippetHandler.getLogoDataUri() == null) {
                snippetHandler.setLogoDataUri(zkService.getLogoDataUri());
            }
            snippetHandler.assignMissingHeaderColors();
            uiOverrideButtonColors = snippetHandler.getMainButtonColor() != null;
        }

    }

    @NotifyChange({"snippetHandler"})
    @Command
    public void logoUploaded(@BindingParam("evt") UploadEvent evt) {

        String dataUri = processImageMedia(evt.getMedia());
        if (dataUri != null) {
            snippetHandler.setLogoDataUri(dataUri);
        }

    }

    @NotifyChange({"snippetHandler"})
    @Command
    public void faviconUploaded(@BindingParam("evt") UploadEvent evt) {

        String dataUri = processImageMedia(evt.getMedia());
        if (dataUri != null) {
            snippetHandler.setFaviconDataUri(dataUri);
        }

    }

    @Command
    public void save() {

        switch (brandingOption) {
            case NONE:
                //Revert to original Gluu images in disk
                zkService.resetLogoDataUriEncoding(null);
                zkService.resetFaviconDataUriEncoding(null);
                updateSettings(false, null);
                break;
            case EXTERNAL_PATH:
                String brandingPath = ZKService.STATIC_FILEPATH.toString();
                //Check directory exists
                if (!Files.isDirectory(Paths.get(brandingPath, "images")) || !Files.isDirectory(Paths.get(brandingPath, "styles"))) {
                    Messagebox.show(Labels.getLabel("adm.branding_no_subdirs", new String[]{brandingPath}), null,
                            Messagebox.YES | Messagebox.NO, Messagebox.QUESTION,
                            event -> {
                                if (Messagebox.ON_YES.equals(event.getName())) {
                                    updateSettings(true, null);
                                }
                            }
                    );
                } else {
                    updateSettings(true, null);
                }
                break;
            case EXTRA_CSS:
                //Update application level logo and icon
                zkService.setLogoDataUri(snippetHandler.getLogoDataUri());
                zkService.setFaviconDataUri(snippetHandler.getFaviconDataUri());

                updateSettings(false, snippetHandler.getSnippet(uiOverrideButtonColors));
                break;
            default:
                //Added to pass style check
        }
    }

    @NotifyChange({"snippetHandler", "uiOverrideButtonColors"})
    @Command
    public void buttonColorChanging(@BindingParam("override") boolean override) throws Exception {
        uiOverrideButtonColors = override;
        if (override) {
            snippetHandler.assignMissingButtonColors();
        }
    }

    private String processImageMedia(Media media) {

        String dataUri = null;
        if (media instanceof Image) {
            try {
                logger.debug("Got file {}", media.getName());
                dataUri = Utils.getImageDataUriEncoding(media.getByteData(), media.getName());
            } catch (Exception e) {
                logger.debug(e.getMessage(), e);
                UIUtils.showMessageUI(false);
            }
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("adm.branding_quick_noimg"));
        }
        return dataUri;

    }

    private void updateSettings(boolean useBranding, String cssSnippet) {

        settings.setUseExternalBranding(useBranding);
        settings.setExtraCssSnippet(cssSnippet);
        String msg = Labels.getLabel(brandingOption.equals(BrandingOption.NONE) ? "adm.branding_defaulted" : "adm.branding_changed");
        updateMainSettings(msg);

    }

}
