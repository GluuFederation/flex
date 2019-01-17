/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.core.AssetsService;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xdi.util.Pair;
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

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class CustomBrandingViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private AssetsService assetsService;

    private Pair<String, byte[]> logo;

    private Pair<String, byte[]> favicon;

    public Pair<String, byte[]> getLogo() {
        return logo;
    }

    public Pair<String, byte[]> getFavicon() {
        return favicon;
    }

    @Init
    public void init() {
        logo = new Pair<>(assetsService.getLogoUrl() + randomSuffix(), null);
        favicon = new Pair<>(assetsService.getFaviconUrl() + randomSuffix(), null);
    }

    @Command
    public void save() {
        try {
            if (favicon.getSecond() != null) {
                assetsService.setFaviconContent(favicon.getSecond());
            }
            if (logo.getSecond() != null) {
                assetsService.setLogoContent(logo.getSecond());
            }
            assetsService.useExtraCss(AssetsService.EMPTY_SNIPPET);
            Messagebox.show(Labels.getLabel( "adm.branding_changed"), null, Messagebox.OK, Messagebox.INFORMATION);
        } catch (Exception e) {
            UIUtils.showMessageUI(false, e.getMessage());
        }

    }

    @NotifyChange("*")
    @Command
    public void revert() {

        try {
            assetsService.factoryReset();
            init();
            UIUtils.showMessageUI(true);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            UIUtils.showMessageUI(false, e.getMessage());
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

    private String randomSuffix() {
        return "?" + Math.random();
    }

    private void processUpload(Pair<String, byte[]> pair, Media media) {

        if (media instanceof Image) {
            logger.info("Processing upload {}", media.getName());
            pair.setFirst(processImageMedia(media.getName(), media.getByteData()));
            pair.setSecond(media.getByteData());
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("adm.branding_noimg"));
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

}
