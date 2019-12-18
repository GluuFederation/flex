package org.gluu.casa.ui.vm.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.casa.core.pojo.BrowserInfo;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.ui.UIUtils;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.SecurityKeyExtension;
import org.gluu.casa.plugins.authnmethod.service.U2fService;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
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

/**
 * Created by jgomer on 2017-07-23.
 * This is the ViewModel of page u2f-detail.zul. It controls the CRUD of security keys
 */
@VariableResolver(DelegatingVariableResolver.class)
public class SecurityKeyViewModel extends UserViewModel {

    private static final int REGISTRATION_TIMEOUT = 8000;

    private Logger logger = LogManager.getLogger(getClass());

    @WireVariable
    private U2fService u2fService;

    private ObjectMapper mapper;
    private SecurityKey newDevice;
    private List<SecurityKey> devices;

    private boolean uiAwaiting;
    private boolean uiEnrolled;
    private String editingId;

    private String u2fSupportMessage;
    private boolean u2fMayBeSupported;
    private boolean requiresU2f_v1_1;

    public boolean isUiAwaiting() {
        return uiAwaiting;
    }

    public boolean isUiEnrolled() {
        return uiEnrolled;
    }

    public String getEditingId() {
        return editingId;
    }

    public String getU2fSupportMessage() {
        return u2fSupportMessage;
    }

    public boolean isU2fMayBeSupported() {
        return u2fMayBeSupported;
    }

    public boolean isRequiresU2f_v1_1() {
        return requiresU2f_v1_1;
    }

    public SecurityKey getNewDevice() {
        return newDevice;
    }

    public List<SecurityKey> getDevices() {
        return devices;
    }

    public void setEditingId(String editingId) {
        this.editingId = editingId;
    }

    public void setNewDevice(SecurityKey newDevice) {
        this.newDevice = newDevice;
    }

    @Init(superclass = true)
    public void childInit() throws Exception {
        mapper = new ObjectMapper();
        newDevice = new SecurityKey();
        devices = u2fService.getDevices(user.getId(), true);
        checkU2fSupport();
    }

    @AfterCompose
    public void afterCompose(@ContextParam(ContextType.VIEW) Component view) {
        Selectors.wireEventListeners(view, this);
    }

    @Command
    public void triggerU2fRegisterRequest() {
        try {
            uiAwaiting = true;
            BindUtils.postNotifyChange(null, null, this, "uiAwaiting");

            String jsonRequest = u2fService.generateJsonRegisterMessage(user.getUserName(), userService.generateRandEnrollmentCode(user.getId()));

            //Notify browser to exec proper function
            UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_INFO, Labels.getLabel("usr.u2f_touch"));
            Clients.response(new AuInvoke("triggerU2fRegistration", new JavaScriptValue(jsonRequest), REGISTRATION_TIMEOUT, requiresU2f_v1_1));
        } catch (Exception e) {
            UIUtils.showMessageUI(false);
            logger.error(e.getMessage(), e);
        }

    }

    @Listen("onData=#readyButton")
    public void notified(Event event) throws Exception {

        String jsonStr = mapper.writeValueAsString(event.getData());
        String error = u2fService.getRegistrationResult(jsonStr);

        if (error == null) {
            u2fService.finishRegistration(user.getUserName(), jsonStr);
            //To know exactly which entry is, we pass the current timestamp so we can pick the most suitable
            //entry by inspecting the creationDate attribute among all existing entries
            newDevice = u2fService.getLatestSecurityKey(user.getId(), System.currentTimeMillis());

            if (newDevice != null) {
                uiEnrolled = true;
                BindUtils.postNotifyChange(null, null, this, "uiEnrolled");
            } else {
                UIUtils.showMessageUI(false);
                logger.error(Labels.getLabel("app.finish_registration_error"));
            }
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("general.error.detailed", new String[] { error }));
        }

        uiAwaiting = false;
        BindUtils.postNotifyChange(null, null, this, "uiAwaiting");
        userService.cleanRandEnrollmentCode(user.getId());

    }

    @NotifyChange({"uiEnrolled", "newDevice", "devices"})
    @Command
    public void add() {

        if (Utils.isNotEmpty(newDevice.getNickName())) {
            try {
                u2fService.updateDevice(newDevice);
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
            success = u2fService.removeDevice(newDevice);
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
                u2fService.updateDevice(dev);
                UIUtils.showMessageUI(true);
            } catch (Exception e) {
                UIUtils.showMessageUI(false);
                logger.error(e.getMessage(), e);
            }
        }

    }

    @Command
    public void delete(@BindingParam("device") SecurityKey device) {

        String resetMessages = resetPreferenceMessage(SecurityKeyExtension.ACR, devices.size());
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

                                u2fService.removeDevice(device);
                                //trigger refresh (this method is asynchronous...)
                                BindUtils.postNotifyChange(null, null, SecurityKeyViewModel.this, "devices");

                                UIUtils.showMessageUI(true);
                            }
                        } catch (Exception e) {
                            UIUtils.showMessageUI(false);
                            logger.error(e.getMessage(), e);
                        }
                    }
                });
    }

    private void checkU2fSupport() {
        //Assume u2f is not supported
        u2fMayBeSupported = false;
        try {
            BrowserInfo binfo = getBrowserInfo();
            String name = binfo.getName().toLowerCase();
            int browserVer = binfo.getMainVersion();

            u2fMayBeSupported =  (name.contains("chrome") && browserVer >= 41) || (name.contains("opera") && browserVer >= 41)
                    || (name.contains("safari") && browserVer > 10) || name.contains("firefox");

            if (u2fMayBeSupported) {
                if (name.contains("firefox")) {
                    if (browserVer >= 57) {
                        u2fSupportMessage = Labels.getLabel("usr.u2f_enabled_u2f_ff");
                        requiresU2f_v1_1 = true;
                    } else {
                        u2fSupportMessage = Labels.getLabel("usr.u2f_unsupported_ff", new Integer[]{ browserVer });
                    }
                } else if (name.contains("safari")){
                    u2fSupportMessage = Labels.getLabel("usr.u2f_unsupported_safari");
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    private void resetAddSettings() {
        uiEnrolled = false;
        newDevice = new SecurityKey();
    }

}
