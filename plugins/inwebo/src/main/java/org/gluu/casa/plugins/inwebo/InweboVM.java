package org.gluu.casa.plugins.inwebo;

import java.util.ArrayList;
import java.util.List;
import org.gluu.casa.plugins.inwebo.InweboCredential;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.ISessionContext;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.AfterCompose;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.ContextParam;
import org.zkoss.bind.annotation.ContextType;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.json.JavaScriptValue;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.au.out.AuInvoke;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zul.Messagebox;

import com.inwebo.api.sample.User;


/**
 * @author madhumita
 *
 */

public class InweboVM {

	private Logger logger = LoggerFactory.getLogger(getClass());
	private static final int QR_SCAN_TIMEOUT = 60;
	@WireVariable
	private ISessionContext sessionContext;

	private List<InweboCredential> devices;

	public List<InweboCredential> getDevices() {
		return devices;
	}

	private InweboCredential newDevice;
	private boolean uiQRShown;

	private String editingId;
	private String longCode; // 20 digits
	private String activationCode; // also called the Secure Site ID 9 digits
	private String activationURL;

	public String getActivationURL() {
		return activationURL;
	}

	public void setActivationURL(String activationURL) {
		this.activationURL = activationURL;
	}

	public String getActivationCode() {
		return activationCode;
	}

	public void setActivationCode(String activationCode) {
		this.activationCode = activationCode;
	}

	public String getlongCode() {
		return longCode;
	}

	public void setlongCode(String longCode) {
		this.longCode = longCode;
	}

	

	public String getEditingId() {
		return editingId;
	}

	public void setEditingId(String editingId) {
		this.editingId = editingId;
	}

	public InweboCredential getNewDevice() {
		return newDevice;
	}

	public void setNewDevice(InweboCredential newDevice) {
		this.newDevice = newDevice;
	}

	public boolean isUiQRShown() {
		return uiQRShown;
	}

	public void setUiQRShown(boolean uiQRShown) {
		this.uiQRShown = uiQRShown;
	}

	public void setDevices(List<InweboCredential> devices) {
		this.devices = devices;
	}

	/**
	 * Initialization method for this ViewModel.
	 */
	@Init
	public void init() {

		sessionContext = Utils.managedBean(ISessionContext.class);
		devices = InweboService.getInstance().getDevices(sessionContext.getLoggedUser().getUserName());
		newDevice = new InweboCredential(null, 0);
	}

	@Command
	public void delete(@BindingParam("device") InweboCredential device) {
		
		Pair<String, String> delMessages = getDeleteMessages(device.getNickName(), null);

		Messagebox.show(delMessages.getY(), delMessages.getX(), Messagebox.YES | Messagebox.NO,
				true ? Messagebox.EXCLAMATION : Messagebox.QUESTION, event -> {
					if (Messagebox.ON_YES.equals(event.getName())) {
						try {

							boolean result = InweboService.getInstance().deleteInWeboDevice(sessionContext.getLoggedUser().getUserName(),
									device.getCredentialId(), device.getCredentialType());
							if(result == false)
			                {
			                	 UIUtils.showMessageUI(false);
			                }
							else
							{
								devices.remove(device);
								// trigger refresh (this method is asynchronous...)
								BindUtils.postNotifyChange(null, null, InweboVM.this, "devices");
								UIUtils.showMessageUI(true);
							}
							
						} catch (Exception e) {
							UIUtils.showMessageUI(false);
							logger.error(e.getMessage(), e);
						}
					}
				});
	}

	Pair<String, String> getDeleteMessages(String nick, String extraMessage) {

		StringBuilder text = new StringBuilder();
		if (extraMessage != null) {
			text.append(extraMessage).append("\n\n");
		}
		text.append(Labels.getLabel("inwebo_del_confirm",
				new String[] { nick == null ? Labels.getLabel("general.no_named") : nick }));
		if (extraMessage != null) {
			text.append("\n");
		}

		return new Pair<>(Labels.getLabel("inwebo_del_title"), text.toString());

	}

	@Command
	public void showQR() {

		try {
			long inWeboUserId = InweboService.getInstance().getUserId(sessionContext.getLoggedUser().getUserName());
			longCode = InweboService.getInstance().getLongCode(inWeboUserId);
			activationCode = InweboService.getInstance().getActivationCode(longCode);
			uiQRShown = true;
			activationURL = InweboService.getInstance().buildURLForActivation(activationCode);
			BindUtils.postNotifyChange(null, null, this, "uiQRShown");
			BindUtils.postNotifyChange(null, null, this, "longCode");
			BindUtils.postNotifyChange(null, null, this, "activationCode");
			BindUtils.postNotifyChange(null, null, this, "activationURL");
			
			// Passing screen width as max allowed size for QR code allows showing QRs even
			// in small mobile devices
			// TODO:remove hardcoding  (screen width)
			JavaScriptValue jvalue = new JavaScriptValue(getFormattedQROptions(30));
			// Calls the startQR javascript function supplying suitable params
			Clients.response(new AuInvoke("startQR", activationCode, "", jvalue));
			Clients.scrollBy(0, 10);

		} catch (Exception e) {
			UIUtils.showMessageUI(false);
			logger.error(e.getMessage(), e);
		}

	}

	@Command
	public void sendEmail() {
		
		InweboService.getInstance().sendEmailForLinkActivation(sessionContext.getLoggedUser().getUserName());
		Executions.sendRedirect(null);
	}

	public String generateRequest(String code) {
		return code;
	}

	@AfterCompose
	public void afterCompose(@ContextParam(ContextType.VIEW) Component view) {
		Selectors.wireEventListeners(view, this);
	}

	private void stopPolling() {
		Clients.response(new AuInvoke("stopPolling"));
		
	}

	public String getFormattedQROptions(int maxWidth) {

		List<String> list = new ArrayList<>();
		int size = 20;// getQrSize();
		int ival = maxWidth > 0 ? Math.min(size, maxWidth - 30) : size;

		if (ival > 0) {
			list.add("size:" + ival);
		}

		double dval = 0.05; // getQrMSize();
		if (dval > 0) {
			list.add("mSize: " + dval);
		}

		return list.toString().replaceFirst("\\[", "{").replaceFirst("\\]", "}");

	}

	@Listen("onData=#readyButton")
	public void qrScanResult(Event event) {

		logger.debug("qrScanResult. Event value is {}", event.getData().toString());
		if (uiQRShown) {
			switch (event.getData().toString()) {
			case "timeout":
				// Indicates progress bar reached 100%
				stopPolling();
				break;
			case "poll":
				// 
				break;
			default:
				// Added to pass checkstyler
			}
		}

	}

	private void resetAddSettings() {
		newDevice = new InweboCredential(null, 0);
	}

	@Command
	@NotifyChange({ "uiQRShown", "uiEnrolled", "newDevice", "devices" })
	public void add() {

		if (Utils.isNotEmpty(newDevice.getNickName())) {
			try {
				devices.add(newDevice);
				UIUtils.showMessageUI(true, Labels.getLabel("usr.enroll.success"));
			} catch (Exception e) {
				UIUtils.showMessageUI(false, Labels.getLabel("usr.error_updating"));
				logger.error(e.getMessage(), e);
			}
			resetAddSettings();
		}

	}

	@NotifyChange("*")
	@Command
	public void cancel() {

		if (uiQRShown) {
			Clients.response(new AuInvoke("clean"));
			uiQRShown = false;
		}

	}
	
	 @NotifyChange({"newDevice", "editingId"})
	    @Command
	    public void prepareForUpdate(@BindingParam("device") InweboCredential dev) {
	        //This will make the modal window to become visible
	        editingId = String.valueOf(dev.getCredentialId());
	        newDevice = new InweboCredential(dev.getNickName(),0);
	        newDevice.setCredentialName(dev.getNickName());
	        
	    }

	    @NotifyChange({"editingId", "newDevice"})
	    @Command
	    public void cancelUpdate() {
	        newDevice.setCredentialId(0);
	        editingId = null;
	    }

	    @NotifyChange({"devices", "editingId", "newDevice"})
	    @Command
	    public void update() {

	    	String newName = newDevice.getCredentialName();
	        if (Utils.isNotEmpty(newName)) {
	            //Find the index of the current device in the device list
	            int i = Utils.firstTrue(devices, dev -> String.valueOf(dev.getCredentialId()).equalsIgnoreCase(editingId));
	            InweboCredential dev = devices.get(i);
	            dev.setCredentialName(newName);
	            cancelUpdate();     //This doesn't undo anything we already did (just controls UI aspects)

	            try {
	                boolean result = InweboService.getInstance().updateInWeboDevice(sessionContext.getLoggedUser().getUserName(), dev.getCredentialId(), dev.getCredentialType(), newName);
	                if(result == false)
	                {
	                	 UIUtils.showMessageUI(false);
	                }
	                else
	                {
	                	UIUtils.showMessageUI(true);
	                	devices = InweboService.getInstance().getDevices(sessionContext.getLoggedUser().getUserName());
	                	//devices.remove(i);
	                	//devices.add( dev);
	                	// trigger for refresh
						BindUtils.postNotifyChange(null, null, InweboVM.this, "devices");
						UIUtils.showMessageUI(true);
	                }
	            } catch (Exception e) {
	                UIUtils.showMessageUI(false);
	                logger.error(e.getMessage(), e);
	            }
	        }

	    }
}
