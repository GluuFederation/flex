package org.gluu.casa.plugins.cert.vm;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.cert.CertAuthenticationExtension;
import org.gluu.casa.plugins.cert.model.Certificate;
import org.gluu.casa.plugins.cert.service.CertService;
import org.gluu.casa.service.ISessionContext;
import org.gluu.casa.service.SndFactorAuthenticationUtils;
import org.gluu.casa.ui.UIUtils;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zul.Messagebox;

import java.util.List;

/**
 * This is the ViewModel of page cert-detail.zul. It controls the display of user certs
 */
public class CertAuthenticationSummaryViewModel {

    private Logger logger = LogManager.getLogger(getClass());

    @WireVariable
    private ISessionContext sessionContext;

    private User user;
    private List<Certificate> certificates;
    private CertService certService;
    private SndFactorAuthenticationUtils sndFactorUtils;

    public List<Certificate> getCertificates() {
        return certificates;
    }

    @Init
    public void init() {
        certService = CertService.getInstance();
        user = sessionContext.getLoggedUser();
        sndFactorUtils = Utils.managedBean(SndFactorAuthenticationUtils.class);
        certificates = certService.getUserCerts(user.getId());
    }

    public void delete(Certificate certificate) {

        String resetMessages = sndFactorUtils.removalConflict(CertAuthenticationExtension.ACR, certificates.size(), user).getY();
        boolean reset = resetMessages != null;
        Pair<String, String> delMessages = getDeleteMessages(resetMessages);

        Messagebox.show(delMessages.getY(), delMessages.getX(), Messagebox.YES | Messagebox.NO,
                reset ? Messagebox.EXCLAMATION : Messagebox.QUESTION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        try {
                            boolean success = certService.removeFromUser(certificate.getFingerPrint(), user.getId());
                            if (success) {
                                if (reset) {
                                    sndFactorUtils.turn2faOff(user);
                                }
                                certificates.remove(certificate);

                                BindUtils.postNotifyChange(CertAuthenticationSummaryViewModel.this, "certificates");
                            }
                            UIUtils.showMessageUI(success);
                        } catch (Exception e) {
                            UIUtils.showMessageUI(false);
                            logger.error(e.getMessage(), e);
                        }
                    }
                });

    }

    private Pair<String, String> getDeleteMessages(String msg){

        StringBuilder text=new StringBuilder();
        if (msg != null) {
            text.append(msg).append("\n\n");
        }
        text.append(Labels.getLabel("usercert.del_confirm"));
        if (msg != null) {
            text.append("\n");
        }

        return new Pair<>(null, text.toString());

    }

}
