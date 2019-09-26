package org.gluu.casa.ui.vm.user;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.service.TwilioMobilePhoneService;
import org.gluu.casa.plugins.authnmethod.OTPTwilioExtension;
import org.zkoss.bind.annotation.Init;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;


/**
 * This is the ViewModel of page twilio-phone-detail.zul. It controls the CRUD of verified phones
 */
@VariableResolver(DelegatingVariableResolver.class)
public class TwilioVerifiedPhoneViewModel extends VerifiedPhoneViewModel {

    @Init
    public void childInit() throws Exception {
        mpService = Utils.managedBean(TwilioMobilePhoneService.class);
        ACR = OTPTwilioExtension.ACR;
        super.childInit();
    }

}
