package org.gluu.casa.ui.vm.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SecurityKey2Extension;
import org.gluu.casa.plugins.authnmethod.service.Fido2Service;
import org.gluu.casa.ui.UIUtils;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
import org.zkoss.json.JSONObject;
import org.zkoss.json.JavaScriptValue;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.au.out.AuInvoke;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

import java.util.List;
import java.util.Optional;

/**
 * This is the ViewModel of page fido2-detail.zul. It controls the CRUD of security keys
 */
@VariableResolver(DelegatingVariableResolver.class)
public class SecurityKey2ViewModel extends UserViewModel {

    private static final int REGISTRATION_TIMEOUT = 8000;

    private Logger logger = LogManager.getLogger(getClass());

    @WireVariable
    private Fido2Service fido2Service;

    private SecurityKey newDevice;
    private List<SecurityKey> devices;

    private String editingId;
    private boolean uiAwaiting;
    private boolean uiEnrolled;

    private ObjectMapper mapper;

    public SecurityKey getNewDevice() {
        return newDevice;
    }

    public List<SecurityKey> getDevices() {
        return devices;
    }

    public String getEditingId() {
        return editingId;
    }

    public boolean isUiAwaiting() {
        return uiAwaiting;
    }

    public boolean isUiEnrolled() {
        return uiEnrolled;
    }

    @Init(superclass = true)
    public void childInit() throws Exception {
        mapper = new ObjectMapper();
        newDevice = new SecurityKey();
        devices = fido2Service.getDevices(user.getId(), true);
        checkFido2Support();
    }

    @AfterCompose
    public void afterCompose(@ContextParam(ContextType.VIEW) Component view) {
        Selectors.wireEventListeners(view, this);
    }

    @Command
    public void triggerAttestationRequest() {
        try {
            uiAwaiting = true;
            BindUtils.postNotifyChange(null, null, this, "uiAwaiting");

            String uid = user.getUserName();
            String jsonRequest = fido2Service.doRegister(uid, Optional.ofNullable(user.getGivenName()).orElse(uid));
            //Notify browser to exec proper function
            UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_INFO, Labels.getLabel("usr.fido2_touch"));
            Clients.response(new AuInvoke("triggerFido2Attestation", new JavaScriptValue(jsonRequest), REGISTRATION_TIMEOUT));
        } catch (Exception e) {
            UIUtils.showMessageUI(false);
            logger.error(e.getMessage(), e);
        }

    }

    @Listen("onData=#readyButton")
    public void notified(Event event) throws Exception {

        String errMessage = null;
        try {
            if (fido2Service.verifyRegistration(mapper.writeValueAsString(event.getData()))) {
                //pick the most suitable recent entry
                newDevice = fido2Service.getLatestSecurityKey(user.getId(), System.currentTimeMillis());

                if (newDevice != null) {
                    uiEnrolled = true;
                    BindUtils.postNotifyChange(null, null, this, "uiEnrolled");
                } else {
                    errMessage = Labels.getLabel("general.error.general");
                }
            } else {
                errMessage = Labels.getLabel("usr.fido2.error_invalid");
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            errMessage = Labels.getLabel("general.error.detailed", new String[]{e.getMessage()});
        }

        uiAwaiting = false;
        BindUtils.postNotifyChange(null, null, this, "uiAwaiting");
        if (errMessage != null) {
            UIUtils.showMessageUI(false, errMessage);
        }

    }

    @Listen("onError=#readyButton")
    public void notifiedErr(Event event) throws Exception {

        JSONObject jsonObject = (JSONObject) event.getData();
        boolean excludedCredentials = (boolean) jsonObject.get("excludeCredentials");
        String name = Optional.ofNullable(jsonObject.get("name")).map(Object::toString).orElse("");
        String msg = Optional.ofNullable(jsonObject.get("message")).map(Object::toString).orElse("");

        String message;
        logger.error("An error occurred when enrolling fido2 cred for user {}. {}: {}", user.getUserName(), name, msg);

        if (name.equals("NotAllowedError")) {
            message = Labels.getLabel(excludedCredentials ? "usr.fido2.error_exclude" : "general.error.general");
        } else if (name.equals("AbortError")) {
            message = Labels.getLabel("usr.fido2.error_cancel");
        } else {
            message = Labels.getLabel("general.error.detailed", new String[]{msg});
        }
        uiAwaiting = false;
        BindUtils.postNotifyChange(null, null, this, "uiAwaiting");
        UIUtils.showMessageUI(false, message);

    }

    @NotifyChange({"uiEnrolled", "newDevice", "devices"})
    @Command
    public void add() {

        if (Utils.isNotEmpty(newDevice.getNickName())) {
            try {
                fido2Service.updateDevice(newDevice);
                devices.add(newDevice);
                UIUtils.showMessageUI(true, Labels.getLabel("usr.enroll.success"));
            } catch (Exception e) {
                UIUtils.showMessageUI(false, Labels.getLabel("usr.error_updating"));
                logger.error(e.getMessage(), e);
            }
            resetAddSettings();
        }

    }

    @NotifyChange({"uiEnrolled", "newDevice"})
    @Command
    public void cancel() {

        boolean success;
        try {
            /*
             Remove the recently enrolled key. This is so because once the user touches his key button, oxAuth creates the
             corresponding entry in LDAP, and if the user regrets adding the current key by not supplying a nickname
             (and thus pressing cancel), we need to be obliterate the entry
             */
            success = fido2Service.removeDevice(newDevice);
        } catch (Exception e) {
            success = false;
            logger.error(e.getMessage(), e);
        }
        if (!success) {
            UIUtils.showMessageUI(false);
        }
        resetAddSettings();

    }

    @NotifyChange({"editingId", "newDevice"})
    @Command
    public void prepareForUpdate(@BindingParam("device") SecurityKey dev) {
        //This will make the modal window to become visible
        editingId = dev.getId();
        newDevice = new SecurityKey();
        newDevice.setNickName(dev.getNickName());
    }

    @NotifyChange({"editingId", "newDevice"})
    @Command
    public void cancelUpdate(@BindingParam("event") Event event) {
        newDevice.setNickName(null);
        editingId = null;
        if (event != null && event.getName().equals(Events.ON_CLOSE)) {
            event.stopPropagation();
        }
    }

    @NotifyChange({"devices", "editingId", "newDevice"})
    @Command
    public void update() {

        String nick = newDevice.getNickName();
        if (Utils.isNotEmpty(nick)) {
            int i = Utils.firstTrue(devices, dev -> dev.getId().equals(editingId));
            SecurityKey dev = devices.get(i);
            dev.setNickName(nick);
            cancelUpdate(null);

            try {
                fido2Service.updateDevice(dev);
                UIUtils.showMessageUI(true);
            } catch (Exception e) {
                UIUtils.showMessageUI(false);
                logger.error(e.getMessage(), e);
            }
        }

    }

    @Command
    public void delete(@BindingParam("device") SecurityKey device) {

        String resetMessages = resetPreferenceMessage(SecurityKey2Extension.ACR, devices.size());
        boolean reset = resetMessages != null;
        Pair<String, String> delMessages = getDeleteMessages(device.getNickName(), resetMessages);

        Messagebox.show(delMessages.getY(), delMessages.getX(), Messagebox.YES | Messagebox.NO, reset ? Messagebox.EXCLAMATION : Messagebox.QUESTION,
                event -> {
                    if (Messagebox.ON_YES.equals(event.getName())) {
                        try {
                            if (devices.remove(device)) {
                                if (reset) {
                                    userService.turn2faOff(user);
                                }

                                fido2Service.removeDevice(device);
                                //trigger refresh (this method is asynchronous...)
                                BindUtils.postNotifyChange(null, null, SecurityKey2ViewModel.this, "devices");

                                UIUtils.showMessageUI(true);
                            }
                        } catch (Exception e) {
                            UIUtils.showMessageUI(false);
                            logger.error(e.getMessage(), e);
                        }
                    }
                });
    }

    private void resetAddSettings() {
        uiEnrolled = false;
        newDevice = new SecurityKey();
    }

    private void checkFido2Support() {

        boolean probablySupported = false;
        try {
            BrowserInfo binfo = getBrowserInfo();
            String name = binfo.getName().toLowerCase();
            int browserVer = binfo.getMainVersion();

            probablySupported = (name.contains("edge") && browserVer >= 18) || (name.contains("firefox") && browserVer >= 64)
                    || (name.contains("chrome") && browserVer >= 71) || (name.contains("opera") && browserVer >= 54);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        if (!probablySupported) {
            UIUtils.showMessageUI(false, Labels.getLabel("usr.fido2_unsupported_browser"));
        }

    }

}
