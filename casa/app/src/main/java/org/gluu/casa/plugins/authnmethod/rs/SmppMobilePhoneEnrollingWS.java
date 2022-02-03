package org.gluu.casa.plugins.authnmethod.rs;

import org.gluu.casa.plugins.authnmethod.OTPSmppExtension;
import org.gluu.casa.plugins.authnmethod.service.SmppMobilePhoneService;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;

/**
 * @author Stefan Andersson
 */
@ApplicationScoped
@Path("/enrollment/" + OTPSmppExtension.ACR)
public class SmppMobilePhoneEnrollingWS extends MobilePhoneEnrollingWS {

    @Inject
    private SmppMobilePhoneService smppService;

    @PostConstruct
    private void init() {
        mobilePhoneService = smppService;
    }

}
