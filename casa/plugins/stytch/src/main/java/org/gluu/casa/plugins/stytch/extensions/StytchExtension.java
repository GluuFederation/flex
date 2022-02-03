package org.gluu.casa.plugins.stytch.extensions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.gluu.casa.credential.BasicCredential;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.stytch.StytchService;
import org.gluu.casa.plugins.stytch.model.StytchPhoneCredential;
import org.gluu.casa.service.ISessionContext;
import org.pf4j.Extension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author madhumita
 *
 */
@Extension
public class StytchExtension implements AuthnMethod {

	private StytchService stytchService;

	private Logger logger = LoggerFactory.getLogger(getClass());
	private ISessionContext sessionContext;

	public StytchExtension() {
		sessionContext = Utils.managedBean(ISessionContext.class);
		stytchService = StytchService.getInstance();
	}

	public String getUINameKey() {

		return "stytch_label";
	}

	public String getAcr() {
		return StytchService.getInstance().ACR;
	}

	public String getPanelTitleKey() {
		return "stytch_title";
	}

	public String getPanelTextKey() {
		return "stytch_text";
	}

	public String getPanelButtonKey() {

		return "stytch_manage";
	}

	public String getPanelBottomTextKey() {
		return "stytch_download";
	}

	public String getPageUrl() {
		return "user/cred_details.zul";

	}

	public List<BasicCredential> getEnrolledCreds(String id) {
		// pass user name or anything that uniquely identifies a user
		List<BasicCredential> creds = new ArrayList<BasicCredential>();
		try {
			List<StytchPhoneCredential> devices = StytchService.getInstance()
					.getMobileDevices(sessionContext.getLoggedUser().getId());

			if (devices != null)
				creds = devices.stream().filter(p -> p.getStytchUserId() != null)
						.map(p -> new BasicCredential(p.getNickName(), p.getAddedOn())).collect(Collectors.toList());

			return creds;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Collections.emptyList();
		}

	}

	public int getTotalUserCreds(String id) {
		// pass user name or anything that uniquely identifies a user
		return StytchService.getInstance().getDeviceTotal(sessionContext.getLoggedUser());
	}

	public void reloadConfiguration() {
		StytchService.getInstance().reloadConfiguration();

	}

	public boolean mayBe2faActivationRequisite() {
		return Boolean.parseBoolean(Optional
				.ofNullable(StytchService.getInstance().getScriptPropertyValue("2fa_requisite")).orElse("false"));
	}

}
