package org.gluu.credmanager.ui.vm.user;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.credmanager.core.pojo.VerifiedMobile;
import org.gluu.credmanager.ui.UIUtils;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.plugins.authnmethod.OTPSmsExtension;
import org.gluu.credmanager.plugins.authnmethod.rs.status.sms.SendCode;
import org.gluu.credmanager.plugins.authnmethod.service.MobilePhoneService;
import org.gluu.credmanager.core.LdapService;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.util.Date;
import java.util.List;

/**
 * Created by jgomer on 2018-06-18.
 * This is the ViewModel of page phone-detail.zul. It controls the CRUD of verified phones
 */
@VariableResolver(DelegatingVariableResolver.class)
public class VerifiedPhoneViewModel extends UserViewModel {

    private Logger logger = LogManager.getLogger(getClass());

    @WireVariable
    private LdapService ldapService;

    @WireVariable("mobilePhoneService")
    private MobilePhoneService mpService;

    private boolean uiCodesMatch;
    private boolean uiPanelOpened;

    private List<VerifiedMobile> phones;
    private VerifiedMobile newPhone;
    private String code;
    private String realCode;
    private String editingNumber;

    public String getEditingNumber() {
        return editingNumber;
    }

    public boolean isUiPanelOpened() {
        return uiPanelOpened;
    }

    public VerifiedMobile getNewPhone() {
        return newPhone;
    }

    public List<VerifiedMobile> getPhones() {
        return phones;
    }

    public String getCode() {
        return code;
    }

    public boolean isUiCodesMatch() {
        return uiCodesMatch;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setNewPhone(VerifiedMobile newPhone) {
        this.newPhone = newPhone;
    }

    public void setUiPanelOpened(boolean uiPanelOpened) {
        this.uiPanelOpened = uiPanelOpened;
    }

    @Init(superclass = true)
    public void childInit() throws Exception {
        newPhone = new VerifiedMobile(null);
        phones = mpService.getVerifiedPhones(user.getId());
        uiPanelOpened=true;
    }

    @Command
    public void sendCode(){

        //Note similar logic exists at REST service MobilePhoneEnrollingWS
        String numb = newPhone.getNumber();
        if (Utils.isNotEmpty(numb)) {   //Did user fill out the phone text box?
            //Check for uniquess throughout all phones in LDAP. Only new numbers are accepted
            try {
                if (mpService.isNumberRegistered(numb) || mpService.isNumberRegistered(numb.replaceAll("[-\\+\\s]", ""))) {
                    Messagebox.show(Labels.getLabel("usr.mobile_already_exists"),
                            Labels.getLabel("general.warning"), Messagebox.OK, Messagebox.INFORMATION);
                } else {
                    //Generate random in [100000, 999999]
                    realCode = Integer.toString(new Double(100000 + Math.random() * 899999).intValue());
                    //Compose SMS body
                    String body = ldapService.getOrganization().getDisplayName();
                    body = Labels.getLabel("usr.mobile_sms_body", new String[] { body, realCode });
                    logger.trace("sendCode. code={}", realCode);

                    //Send message (service bean already knows all settings to perform this step)
                    if (mpService.sendSMS(numb, body).equals(SendCode.SUCCESS)) {
                        Messagebox.show(Labels.getLabel("usr.mobile_sms_sent", new String[]{ numb }), null, Messagebox.OK, Messagebox.INFORMATION);
                    } else {
                        UIUtils.showMessageUI(false);
                    }
                }
            } catch (Exception e) {
                UIUtils.showMessageUI(false);
                logger.error(e.getMessage(), e);
            }
        }
    }

    @NotifyChange("uiCodesMatch")
    @Command
    public void checkCode(){
        uiCodesMatch=Utils.isNotEmpty(code) && Utils.isNotEmpty(realCode) && realCode.equals(code.trim());
    }

    @NotifyChange({"uiCodesMatch", "code", "phones", "uiPanelOpened", "newPhone"})
    @Command
    public void add(){

        if (Utils.isNotEmpty(newPhone.getNickName())) {
            try {
                newPhone.setAddedOn(new Date().getTime());
                mpService.updateMobilePhonesAdd(user.getId(), phones, newPhone);
                UIUtils.showMessageUI(true, Labels.getLabel("usr.enroll.success"));
            } catch (Exception e) {
                UIUtils.showMessageUI(false, Labels.getLabel("usr.enroll.error"));
                logger.error(e.getMessage(), e);
            }
            cancel();
        }

    }
    @NotifyChange({"uiCodesMatch", "code", "uiPanelOpened", "newPhone"})
    @Command
    public void cancel(){
        resetAddPhoneSettings();
        uiPanelOpened = false;
    }

    private void resetAddPhoneSettings(){
        uiCodesMatch = false;
        realCode = null;
        code = null;
        newPhone = new VerifiedMobile();
    }

    @NotifyChange({"newPhone", "editingNumber"})
    @Command
    public void cancelUpdate(){
        newPhone.setNickName(null);
        editingNumber = null;
    }

    @NotifyChange({"newPhone", "editingNumber"})
    @Command
    public void prepareForUpdate(@BindingParam("phone") VerifiedMobile phone) {
        //This will make the modal window to become visible
        editingNumber = phone.getNumber();
        newPhone = new VerifiedMobile("");
        newPhone.setNickName(phone.getNickName());
    }

    @NotifyChange({"newPhone", "phones", "editingNumber"})
    @Command
    public void update() {

        String nick = newPhone.getNickName();
        if (Utils.isNotEmpty(nick)) {
            int i = Utils.firstTrue(phones, p -> p.getNumber().equals(editingNumber));
            VerifiedMobile ph = phones.get(i);
            ph.setNickName(nick);
            cancelUpdate();

            try {
                mpService.updateMobilePhonesAdd(user.getId(), phones, null);
                UIUtils.showMessageUI(true);
            } catch (Exception e) {
                UIUtils.showMessageUI(false);
                logger.error(e.getMessage(), e);
            }
        }

    }

    @Command
    public void delete(@BindingParam("device") VerifiedMobile phone) {

        String resetMessages = resetPreferenceMessage(OTPSmsExtension.ACR, phones.size());
        boolean reset = resetMessages != null;
        Pair<String, String> delMessages = getDeleteMessages(phone.getNickName(), resetMessages);

        Messagebox.show(delMessages.getY(), delMessages.getX(), Messagebox.YES | Messagebox.NO, reset ? Messagebox.EXCLAMATION : Messagebox.QUESTION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        try {
                            if (phones.remove(phone)) {
                                if (reset) {
                                    userService.setPreferredMethod(user, null);
                                }

                                mpService.updateMobilePhonesAdd(user.getId(), phones, null);
                                //trigger refresh (this method is asynchronous...)
                                BindUtils.postNotifyChange(null, null, VerifiedPhoneViewModel.this, "devices");

                                UIUtils.showMessageUI(true);
                            }
                        } catch (Exception e) {
                            UIUtils.showMessageUI(false);
                            logger.error(e.getMessage(), e);
                        }
                    }
                });
    }

}
