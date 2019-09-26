/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.rs;

import org.gluu.casa.plugins.authnmethod.OTPTwilioExtension;
import org.gluu.casa.plugins.authnmethod.service.MobilePhoneService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.*;

/**
 * @author jgomer
 */
@ApplicationScoped
@Path("/enrollment/" + OTPTwilioExtension.ACR)
public class TwilioMobilePhoneEnrollingWS extends MobilePhoneEnrollingWS {

    @Inject
    @Named("twilioMobilePhoneService")
    private MobilePhoneService mobilePhoneService;

}
