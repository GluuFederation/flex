/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui.vm.user;

import org.gluu.casa.core.pojo.OTPDevice;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.OTPExtension;
import org.gluu.casa.plugins.authnmethod.conf.OTPConfig;
import org.gluu.casa.plugins.authnmethod.service.OTPService;
import org.gluu.casa.plugins.authnmethod.service.otp.IOTPAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
import org.zkoss.json.JavaScriptValue;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.au.out.AuInvoke;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.HtmlBasedComponent;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import static com.lochbridge.oath.otp.keyprovisioning.OTPKey.OTPType;

import java.util.Date;
import java.util.List;

/**
 * This is the ViewModel of page otp-detail.zul. It controls the CRUD of HOTP/TOTP devices
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class OTPViewModel extends UserViewModel {

    private static final int QR_SCAN_TIMEOUT = 60;

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable("oTPService")
    private OTPService otpService;

    private String code;
    private List<OTPDevice> devices;
    private OTPDevice newDevice;
    private int editingId;
    private String secretKeyString;
    private byte[] secretKey;
    private OTPConfig otpConfig;

    private String tokenType;
    private OTPType hardTokenType;

    private boolean uiQRShown;
    private boolean uiCorrectCode;
    private boolean uiTokenPressing;

    public boolean isUiCorrectCode() {
        return uiCorrectCode;
    }

    public boolean isUiQRShown() {
        return uiQRShown;
    }

    public boolean isUiTokenPressing() {
        return uiTokenPressing;
    }

    public int getEditingId() {
        return editingId;
    }

    @DependsOn({"tokenType", "hardTokenType"})
    public int getDigitLength() {

        int len;
        switch (getApplicableAlgorithmType()) {
            case TOTP:
                len = otpConfig.getTotp().getDigits();
                break;
            case HOTP:
                len = otpConfig.getHotp().getDigits();
                break;
            default:
                len = 0;
        }
        return len;

    }

    public String getTokenType() {
        return tokenType;
    }

    public OTPType getHardTokenType() {
        return hardTokenType;
    }

    public String getCode() {
        return code;
    }

    public OTPDevice getNewDevice() {
        return newDevice;
    }

    public List<OTPDevice> getDevices() {
        return devices;
    }

    public String getSecretKeyString() {
        return secretKeyString;
    }

    public void setSecretKeyString(String secretKeyString) {
        this.secretKeyString = secretKeyString;
    }

    public void setNewDevice(OTPDevice newDevice) {
        this.newDevice = newDevice;
    }

    public void setCode(String code) {
        this.code = code;
    }

    private OTPType getApplicableAlgorithmType() {
        //Assume TOTP if no selections have been made
        return tokenType != null && tokenType.equals("HARD") && hardTokenType != null
                && hardTokenType.equals(OTPType.HOTP) ? OTPType.HOTP : OTPType.TOTP;
    }

    @Init(superclass = true)
    public void childInit() throws Exception {
        newDevice = new OTPDevice();
        devices = otpService.getDevices(user.getId());
        otpConfig = otpService.getConf();
    }

    @NotifyChange("*")
    @Command
    public void chooseType(@BindingParam("type") String type, @BindingParam("component") HtmlBasedComponent comp) {
        cancel();
        tokenType = type;
        if (comp != null) {
            comp.focus();
        }
    }

    @NotifyChange({"uiQRShown", "uiCorrectCode"})
    @Command
    public void showQR() {

        uiQRShown = true;
        uiCorrectCode = false;
        code = null;

        //For QR scan TOTP is used
        IOTPAlgorithm totpService = otpService.getAlgorithmService(OTPType.TOTP);
        secretKey = totpService.generateSecretKey();
        String request = totpService.generateSecretKeyUri(secretKey, user.getGivenName());

        JavaScriptValue jvalue = new JavaScriptValue(otpConfig.getFormattedQROptions(getScreenWidth()));

        //Calls the startQR javascript function supplying suitable params
        Clients.response(new AuInvoke("startQR", request, otpConfig.getLabel(), jvalue, QR_SCAN_TIMEOUT));

    }

    @AfterCompose
    public void afterCompose(@ContextParam(ContextType.VIEW) Component view){
        Selectors.wireEventListeners(view, this);
    }

    @Listen("onData=#readyButton")
    public void timedOut(Event event) throws Exception {
        if (uiQRShown) {
            //Restore UI because user did not scan code
            uiQRShown = false;
            BindUtils.postNotifyChange(null, null, this, "uiQRShown");
        }
    }

    @NotifyChange("*")
    @Command
    public void cancel() {

        if (uiQRShown) {
            Clients.response(new AuInvoke("clean"));
            uiQRShown = false;
        }
        uiCorrectCode = false;
        uiTokenPressing = false;
        code = null;
        tokenType = null;
        secretKeyString = null;
        hardTokenType = null;
        newDevice = new OTPDevice();

    }

    @NotifyChange({"hardTokenType"})
    @Command
    public void changeHardType(@BindingParam("time") boolean timeBased) {
        hardTokenType = timeBased ? OTPType.TOTP : OTPType.HOTP;
    }

    @NotifyChange({"uiTokenPressing"})
    @Command
    public void changeTokenPressing(@BindingParam("component") HtmlBasedComponent comp) {

        try {
            //Generate the binary key based on user input
            logger.trace("Computing key based on key typed for hard token");
            String skey = secretKeyString.replaceAll("\\s", "");

            secretKey = new byte[skey.length() / 2];
            for (int i = 0; i < secretKey.length; i++) {
                secretKey[i] = (byte) (Integer.valueOf(skey.substring(i * 2, (i + 1) * 2), 16).intValue());
            }

            if (comp != null) {
                comp.focus();
            }
            uiTokenPressing = !uiTokenPressing;

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_ERROR, Labels.getLabel("usr.otp_entered_key_wrong"));
        }

    }

    @NotifyChange("uiCorrectCode")
    @Command
    public void validateCode() {

        String uid = null;
        if (code != null) {
            logger.trace("Validating code entered");
            //Determines if numeric code is valid with respect to secret key
            IOTPAlgorithm service = otpService.getAlgorithmService(getApplicableAlgorithmType());
            uid = service.getExternalUid(secretKey, code);
            if (uid != null) {

                //User may have entered the same key manually in the past
                int semicolon = uid.indexOf(";");
                final String shorterUid = semicolon == -1 ? uid : uid.substring(0, semicolon);

                if (devices.stream().anyMatch(dev -> dev.getUid().startsWith(shorterUid))) {
                    UIUtils.showMessageUI(false, Labels.getLabel("usr.otp_duplicated_device"));
                } else {
                    newDevice.setUid(uid);
                    uiCorrectCode = true;
                }
            }
        }
        if (uid == null) {
            UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_WARNING, Labels.getLabel("usr.code_wrong"));
        }

    }

    @Command
    @NotifyChange("*")
    public void add() {

        //Adds the new device if user typed a nickname in the text box
        if (Utils.isNotEmpty(newDevice.getNickName())) {
            if (enroll()) {
                UIUtils.showMessageUI(true, Labels.getLabel("usr.enroll.success"));
                cancel();
            } else {
                UIUtils.showMessageUI(false, Labels.getLabel("usr.enroll.error"));
            }
        }
    }

    @NotifyChange({"newDevice", "editingId"})
    @Command
    public void prepareForUpdate(@BindingParam("device") OTPDevice dev) {
        //This will make the modal window to become visible
        editingId = dev.getId();
        newDevice = new OTPDevice();
        newDevice.setNickName(dev.getNickName());
    }

    @NotifyChange({"editingId", "newDevice"})
    @Command
    public void cancelUpdate() {
        newDevice.setNickName(null);
        editingId = 0;
    }

    @NotifyChange({"devices", "editingId", "newDevice"})
    @Command
    public void update() {

        String nick = newDevice.getNickName();
        if (Utils.isNotEmpty(nick)) {
            //Find the index of the current device in the device list
            int i = Utils.firstTrue(devices, dev -> dev.getId() == editingId);
            OTPDevice dev = devices.get(i);
            //Updates its nickname
            dev.setNickName(nick);
            cancelUpdate();     //This doesn't undo anything we already did (just controls UI aspects)

            try {
                otpService.updateDevicesAdd(user.getId(), devices, null);
                UIUtils.showMessageUI(true);
            } catch (Exception e) {
                UIUtils.showMessageUI(false);
                logger.error(e.getMessage(), e);
            }
        }

    }

    private boolean enroll() {

        boolean success = false;
        try {
            logger.trace("Updating/adding device {} for user {}", newDevice.getNickName(), user.getId());
            newDevice.setAddedOn(new Date().getTime());
            newDevice.setSoft(tokenType.equals("SOFT"));
            newDevice.setTimeBased(newDevice.getSoft() || OTPType.TOTP.equals(hardTokenType));
            otpService.updateDevicesAdd(user.getId(), devices, newDevice);
            success = true;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    @Command
    public void delete(@BindingParam("device") OTPDevice device) {

        String resetMessages = resetPreferenceMessage(OTPExtension.ACR, devices.size());
        boolean reset = resetMessages != null;
        Pair<String, String> delMessages = getDeleteMessages(device.getNickName(), resetMessages);

        Messagebox.show(delMessages.getY(), delMessages.getX(), Messagebox.YES | Messagebox.NO, reset ? Messagebox.EXCLAMATION : Messagebox.QUESTION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        try {
                            if (devices.remove(device)) {
                                if (reset) {
                                    userService.setPreferredMethod(user, null);
                                }

                                otpService.updateDevicesAdd(user.getId(), devices, null);
                                //trigger refresh (this method is asynchronous...)
                                BindUtils.postNotifyChange(null, null, OTPViewModel.this, "devices");

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
