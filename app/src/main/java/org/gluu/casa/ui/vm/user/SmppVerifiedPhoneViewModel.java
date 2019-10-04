package org.gluu.casa.ui.vm.user;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.service.SmppMobilePhoneService;
import org.gluu.casa.plugins.authnmethod.OTPSmppExtension;
import org.zkoss.bind.annotation.Init;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;


/**
 * This is the ViewModel of page smpp-phone-detail.zul. It controls the CRUD of verified phones
 */
@VariableResolver(DelegatingVariableResolver.class)
public class SmppVerifiedPhoneViewModel extends VerifiedPhoneViewModel {

    @Init
    public void childInit() throws Exception {
        mpService = Utils.managedBean(SmppMobilePhoneService.class);
        ACR = OTPSmppExtension.ACR;
        super.childInit();
    }

}
