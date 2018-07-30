/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.plugins.authnmethod;

import org.gluu.credmanager.credential.BasicCredential;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.plugins.authnmethod.service.U2fService;
import org.pf4j.Extension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author jgomer
 */
@Extension
public class SecurityKeyExtension implements AuthnMethod {

    public static final String ACR = "u2f";

    private Logger logger = LoggerFactory.getLogger(getClass());

    private U2fService u2fService;

    public SecurityKeyExtension() {
        u2fService = Utils.managedBean(U2fService.class);
    }

    public String getUINameKey() {
        return "usr.u2f_label";
    }

    public String getAcr() {
        return ACR;
    }

    public String getPanelTitleKey() {
        return "usr.u2f_title";
    }

    public String getPanelTextKey() {
        return "usr.u2f_text";
    }

    public String getPanelButtonKey() {
        return "usr.u2f_changeadd";
    }

    public String getPanelBottomTextKey() {
        return "usr.u2f_buy_title";
    }

    public String getPageUrl() {
        return "/user/u2f-detail.zul";
    }

    public List<BasicCredential> getEnrolledCreds(String id) {

        try {
            return u2fService.getDevices(id, true).stream()
                    .map(dev -> new BasicCredential(dev.getNickName(), dev.getCreationDate().getTime())).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public int getTotalUserCreds(String id) {
        return u2fService.getDevicesTotal(id, true);
    }

    public void reloadConfiguration() {
        u2fService.reloadConfiguration();
    }

}
