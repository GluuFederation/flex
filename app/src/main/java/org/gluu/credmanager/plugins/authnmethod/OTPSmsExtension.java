/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.plugins.authnmethod;

import org.gluu.credmanager.credential.BasicCredential;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.plugins.authnmethod.service.MobilePhoneService;
import org.pf4j.Extension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Note: No injection can take place at extensions because instances are handled by p4fj
 * @author jgomer
 */
@Extension
public class OTPSmsExtension implements AuthnMethod {

    public static final String ACR = "twilio_sms";

    private Logger logger = LoggerFactory.getLogger(getClass());

    private MobilePhoneService mobService;

    public OTPSmsExtension() {
        mobService = Utils.managedBean(MobilePhoneService.class);
    }

    public String getUINameKey() {
        return "usr.mobile_label";
    }

    public String getAcr() {
        return ACR;
    }

    public String getPanelTitleKey() {
        return "usr.mobile_title";
    }

    public String getPanelTextKey() {
        return "usr.mobile_text";
    }

    public String getPanelButtonKey() {
        return "usr.mobile_changeadd";
    }

    public String getPageUrl() {
        return "/user/phone-detail.zul";
    }

    public List<BasicCredential> getEnrolledCreds(String id) {

        try {
            return mobService.getVerifiedPhones(id).stream()
                    .map(vphone -> new BasicCredential(vphone.getNickName(), vphone.getAddedOn())).collect(Collectors.toList());

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Collections.emptyList();
        }

    }

    public int getTotalUserCreds(String id) {
        return mobService.getPhonesTotal(id);
    }

    public boolean mayBe2faActivationRequisite() {
        return true;
    }

    public void reloadConfiguration() {
        mobService.reloadConfiguration();
    }

}
