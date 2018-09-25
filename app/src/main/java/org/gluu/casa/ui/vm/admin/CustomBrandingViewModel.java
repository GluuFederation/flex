/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.AssetsService;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.ui.vm.admin.branding.BrandingOption;
import org.gluu.casa.ui.vm.admin.branding.CssSnippetHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xdi.util.Pair;
import org.zkoss.bind.BindUtils;
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
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class CustomBrandingViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private AssetsService assetsService;

    private MainSettings settings;

    private BrandingOption previouslySelected;

    private BrandingOption brandingOption;

    private CssSnippetHandler snippetHandler;

    private boolean uiOverrideButtonColors;

    private Pair<String, byte[]> logo;

    private Pair<String, byte[]> favicon;

    public String getBrandingOption() {
        return brandingOption.toString();
    }

    public CssSnippetHandler getSnippetHandler() {
        return snippetHandler;
    }

    public boolean isUiOverrideButtonColors() {
        return uiOverrideButtonColors;
    }

    public Pair<String, byte[]> getLogo() {
        return logo;
    }

    public Pair<String, byte[]> getFavicon() {
        return favicon;
    }

    @Init
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

    @NotifyChange({"brandingOption", "logo", "favicon", "snippetHandler", "uiOverrideButtonColors"})
    @Command
    public void changeBranding(@BindingParam("val") String option) {

        previouslySelected = brandingOption;
        brandingOption = BrandingOption.valueOf(option);
        if (brandingOption.equals(BrandingOption.EXTRA_CSS)) {
            snippetHandler = new CssSnippetHandler(settings.getExtraCssSnippet());
            uiOverrideButtonColors = snippetHandler.getPrimaryButtonColor() != null;
            logo = new Pair<>(assetsService.getLogoUrl() + randomSuffix(), null);
            favicon = new Pair<>(assetsService.getFaviconUrl() + randomSuffix(), null);
            logger.debug("miedr\n {}", logo.getFirst());
        }

    }

    @NotifyChange("logo")
    @Command
    public void logoUploaded(@BindingParam("evt") UploadEvent evt) {
        processUpload(logo, evt.getMedia());
    }

    @NotifyChange("favicon")
    @Command
    public void faviconUploaded(@BindingParam("evt") UploadEvent evt) {
        processUpload(favicon, evt.getMedia());
    }

    @Command
    public void save() {

        switch (brandingOption) {
            case NONE:
                updateSettings(false, null);
                break;
            case EXTERNAL_PATH:
                String brandingPath = AssetsService.CUSTOM_FILEPATH;
                //Check directory exists
                if (!Files.isDirectory(Paths.get(brandingPath, "images")) || !Files.isDirectory(Paths.get(brandingPath, "styles", "gluu"))) {
                    Messagebox.show(Labels.getLabel("adm.branding_no_subdirs", new String[]{brandingPath}), null,
                            Messagebox.YES | Messagebox.NO, Messagebox.QUESTION,
                            event -> {
                                if (Messagebox.ON_YES.equals(event.getName())) {
                                    updateSettings(true, null);
                                    assetsService.reloadUrls();
                                } else {
                                    changeBranding(previouslySelected.toString());
                                    BindUtils.postNotifyChange(null, null, CustomBrandingViewModel.this, "brandingOption");
                                }
                            }
                    );
                } else {
                    updateSettings(true, null);
                }
                break;
            case EXTRA_CSS:
                try {
                    //Write favicon & logo to disk
                    if (favicon.getSecond() == null) {
                        favicon.setSecond(assetsService.getDefaultFaviconBytes());
                    }
                    if (favicon.getSecond() != null) {
                        storeAsset(assetsService.getCustomPathForFavicon(), favicon.getSecond());
                    }
                    if (logo.getSecond() == null) {
                        logo.setSecond(assetsService.getDefaultLogoBytes());
                    }
                    if (logo.getSecond() != null) {
                        storeAsset(assetsService.getCustomPathForLogo(), logo.getSecond());
                    }
                    updateSettings(false, snippetHandler.getSnippet(uiOverrideButtonColors));
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                    UIUtils.showMessageUI(false, e.getMessage());
                }
                break;
            default:
                //Added to pass style check
        }
        //Update application level logo and icon
        assetsService.reloadUrls();

    }

    @NotifyChange({"snippetHandler", "uiOverrideButtonColors"})
    @Command
    public void buttonColorChanging(@BindingParam("override") boolean override) throws Exception {
        uiOverrideButtonColors = override;
        if (override) {
            snippetHandler.assignMissingButtonColors();
        }
    }

    private String processImageMedia(String name, byte[] data) {

        String dataUri = null;
        try {
            dataUri = Utils.getImageDataUriEncoding(data, name);
        } catch (Exception e) {
            logger.debug(e.getMessage(), e);
            UIUtils.showMessageUI(false);
        }
        return dataUri;

    }

    private void updateSettings(boolean useBranding, String cssSnippet) {

        settings.setUseExternalBranding(useBranding);
        settings.setExtraCssSnippet(cssSnippet);
        String msg = brandingOption.equals(BrandingOption.NONE) ? null : Labels.getLabel( "adm.branding_changed");
        updateMainSettings(msg);

    }

    private void processUpload(Pair<String, byte[]> pair, Media media) {

        if (media instanceof Image) {
            logger.info("Processing upload {}", media.getName());
            pair.setFirst(processImageMedia(media.getName(), media.getByteData()));
            pair.setSecond(media.getByteData());
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("adm.branding_quick_noimg"));
        }

    }

    private void storeAsset(Path destination, byte[] data) throws Exception {
        Files.createDirectories(destination.getParent());
        Files.write(destination, data);
    }

    private String randomSuffix() {
        return "?" + Math.random();
    }

}
