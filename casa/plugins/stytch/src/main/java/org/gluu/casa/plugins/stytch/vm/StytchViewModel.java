package org.gluu.casa.plugins.stytch.vm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.stytch.StytchService;
import org.gluu.casa.plugins.stytch.model.StytchPhoneCredential;
import org.gluu.casa.service.ISessionContext;
import org.gluu.casa.service.SndFactorAuthenticationUtils;
import org.gluu.casa.ui.UIUtils;
import org.gluu.util.Pair;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.au.out.AuInvoke;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.HtmlBasedComponent;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zul.Messagebox;

/**
 * This is the ViewModel of page stytch-phone-detail.zul. It controls the CRUD
 * of verified phones
 */
public class StytchViewModel {

	public StytchViewModel() {
		stytchService = stytchService = StytchService.getInstance();
		ACR = StytchService.ACR;
	}

	private Logger logger = LogManager.getLogger(getClass());

	String ACR;
	StytchService stytchService;
	@WireVariable
	private ISessionContext sessionContext;
	private boolean uiCodesMatch;
	private boolean uiSmsDelivered;

	private List<StytchPhoneCredential> phones;
	private StytchPhoneCredential newPhone;
	private String code;
	private String editingNumber;
	private SndFactorAuthenticationUtils sndFactorUtils;

	public String getEditingNumber() {
		return editingNumber;
	}

	public StytchPhoneCredential getNewPhone() {
		return newPhone;
	}

	public List<StytchPhoneCredential> getPhones() {
		return phones;
	}

	public String getCode() {
		return code;
	}

	public boolean isUiCodesMatch() {
		return uiCodesMatch;
	}

	public boolean isUiSmsDelivered() {
		return uiSmsDelivered;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void setNewPhone(StytchPhoneCredential newPhone) {
		this.newPhone = newPhone;
	}

	User user;

	Pair<String, String> getDeleteMessages(String nick, String extraMessage) {

		StringBuilder text = new StringBuilder();
		if (extraMessage != null) {
			text.append(extraMessage).append("\n\n");
		}
		text.append(Labels.getLabel("stytch_del_confirm",
				new String[] { nick == null ? Labels.getLabel("general.no_named") : nick }));
		if (extraMessage != null) {
			text.append("\n");
		}

		return new Pair<>(Labels.getLabel("stytch_del_title"), text.toString());

	}

	@Init(superclass = true)
	public void childInit() throws Exception {
		newPhone = new StytchPhoneCredential();
		sessionContext = Utils.managedBean(ISessionContext.class);
		user = sessionContext.getLoggedUser();
		phones = stytchService.getMobileDevices(user.getId());
		sndFactorUtils = Utils.managedBean(SndFactorAuthenticationUtils.class);
	}

	@NotifyChange("uiSmsDelivered")
	public void sendCode(HtmlBasedComponent toFocus) {

		// Note similar logic exists at REST service MobilePhoneEnrollingWS
		String numb = newPhone.getNumber();
		if (Utils.isNotEmpty(numb)) { // Did user fill out the phone text box?
			// Check for uniquess throughout all phones in LDAP. Only new numbers are
			// accepted
			try {
				if (stytchService.isNumberRegistered(numb)
						|| stytchService.isNumberRegistered(numb.replaceAll("[-\\+\\s]", ""))) {
					UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_WARNING,
							Labels.getLabel("usr.mobile_already_exists"));
				} else {
					// Send request to Stytch
					StytchPhoneCredential temp = stytchService.sendSMS(numb, user.getId());
					if (temp != null) {
						uiSmsDelivered = true;
						newPhone.setStytchPhoneId(temp.getStytchPhoneId());
						newPhone.setStytchUserId(temp.getStytchUserId());
						if (toFocus != null) {
							toFocus.focus();
						}
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

	@NotifyChange({ "uiCodesMatch", "uiSmsDelivered" })
	public void checkCode(HtmlBasedComponent toFocus) {
		
		
		uiCodesMatch =Utils.isNotEmpty(code) &&  stytchService.verifyCode(newPhone.getStytchPhoneId(), code);
		if (uiCodesMatch) {
			if (toFocus != null) {
				toFocus.focus();
			}
			uiSmsDelivered = false;
		} else {
			UIUtils.showMessageUI(Clients.NOTIFICATION_TYPE_WARNING, Labels.getLabel("usr.mobile_code_wrong"));
		}
	}

	@NotifyChange({ "uiCodesMatch", "code", "phones", "newPhone" })
	public void add() {

		if (Utils.isNotEmpty(newPhone.getNickName())) {
			newPhone.setAddedOn(new Date().getTime());
			
			if (stytchService.updateMobilePhonesAdd(user.getId(), phones == null ? new ArrayList<StytchPhoneCredential>() : phones, newPhone)) {
				Clients.response(new AuInvoke("resetPhoneValue"));
				Utils.managedBean(SndFactorAuthenticationUtils.class).notifyEnrollment(user, stytchService.ACR);
				UIUtils.showMessageUI(true);
			} else {
				UIUtils.showMessageUI(false, Labels.getLabel("usr.enroll.error"));
			}
			cancel();
		}

	}

	@NotifyChange({ "uiCodesMatch", "code", "newPhone", "uiSmsDelivered" })
	public void cancel() {
		uiCodesMatch = false;
		code = null;
		uiSmsDelivered = false;
		newPhone = new StytchPhoneCredential();
	}

	@NotifyChange({ "newPhone", "editingNumber" })
	public void cancelUpdate(Event event) {
		newPhone.setNickName(null);
		editingNumber = null;
		if (event != null && event.getName().equals(Events.ON_CLOSE)) {
			event.stopPropagation();
		}
	}

	@NotifyChange({ "newPhone", "editingNumber" })
	public void prepareForUpdate(StytchPhoneCredential phone) {
		// This will make the modal window to become visible
		editingNumber = phone.getNumber();
		newPhone = new StytchPhoneCredential();
		newPhone.setNickName(phone.getNickName());
	}

	@NotifyChange({ "newPhone", "phones", "editingNumber" })
	public void update() {
		logger.debug("update invoked");
		String nick = newPhone.getNickName();
		if (Utils.isNotEmpty(nick)) {
			int i = Utils.firstTrue(phones, p -> p.getNumber().equals(editingNumber));
			StytchPhoneCredential ph = phones.get(i);
			ph.setNickName(nick);
			cancelUpdate(null);

			try {
				stytchService.updateMobilePhonesAdd(user.getId(), phones, null);
				UIUtils.showMessageUI(true);
			} catch (Exception e) {
				UIUtils.showMessageUI(false);
				logger.error(e.getMessage(), e);
			}
		}

	}

	public void delete(StytchPhoneCredential phone) {

		String resetMessages = sndFactorUtils.removalConflict(StytchService.ACR, 1, user).getY();
		boolean reset = resetMessages != null;
		Pair<String, String> delMessages = getDeleteMessages(phone.getNickName(), resetMessages);

		Messagebox.show(delMessages.getSecond(), delMessages.getFirst(), Messagebox.YES | Messagebox.NO,
				reset ? Messagebox.EXCLAMATION : Messagebox.QUESTION, event -> {
					if (Messagebox.ON_YES.equals(event.getName())) {
						try {
							// delete from stytch server
							boolean deletedFromStytch = stytchService.deleteUser(phone.getStytchUserId());
							if (deletedFromStytch) {
								// remove traces from Glue persistence
								phones.remove(phone);
								boolean success = stytchService.updateMobilePhonesAdd(user.getId(), phones, null);

								if (success) {
									if (reset) {
										sndFactorUtils.turn2faOff(user);
									}
									// trigger refresh (this method is asynchronous...)
									BindUtils.postNotifyChange(StytchViewModel.this, "phones");
								} else {
									phones.add(phone);
								}
								UIUtils.showMessageUI(success);
							} else {
								logger.error("Unable to delete from Stytch Server, stytchUserId- "
										+ phone.getStytchUserId());
								UIUtils.showMessageUI(false);
							}

						} catch (Exception e) {
							UIUtils.showMessageUI(false);
							logger.error(e.getMessage(), e);
						}
					}
				});
	}

}
