package org.gluu.casa.plugins.accounts.pojo;

import org.apache.commons.beanutils.BeanUtils;
import org.gluu.casa.plugins.accounts.service.enrollment.ProviderEnrollmentManager;
import org.gluu.casa.plugins.accounts.service.enrollment.SamlEnrollmentManager;
import org.gluu.casa.plugins.accounts.service.enrollment.SocialEnrollmentManager;

/**
 * @author jgomer
 */
public class Provider extends org.gluu.model.passport.Provider {

    public Provider(org.gluu.model.passport.Provider pd) {

        try {
            BeanUtils.copyProperties(this, pd);
        } catch (Exception e) {
            //No need to handle here
        }

    }

    public ProviderType getScriptType() {
        return getType().equals("saml") ? ProviderType.SAML : ProviderType.SOCIAL;
    }

    public ProviderEnrollmentManager getEnrollmentManager() {

        switch (getScriptType()) {
            case SAML:
                return new SamlEnrollmentManager(this);
            case SOCIAL:
                return new SocialEnrollmentManager(this);
            default:
                return null;
        }

    }

}
