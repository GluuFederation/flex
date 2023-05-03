package org.gluu.casa.plugins.credentials.extensions;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.gluu.casa.credential.BasicCredential;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.emailotp.EmailOTPService;
import org.gluu.casa.service.ISessionContext;
import org.pf4j.Extension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Extension
public class EmailOtpAuthnMethod implements AuthnMethod {

	private static Logger logger = LoggerFactory.getLogger(EmailOtpAuthnMethod.class);

	private ISessionContext sessionContext;

	public EmailOtpAuthnMethod() {
		sessionContext = Utils.managedBean(ISessionContext.class);
		reloadConfiguration();
	}

	@Override
	public String getPanelBottomTextKey() {
		return "";
	}

	@Override
	public boolean mayBe2faActivationRequisite() {
		return Boolean.parseBoolean(Optional
				.ofNullable(EmailOTPService.getInstance().getScriptPropertyValue("2fa_requisite")).orElse("false"));

	}

	@Override
	public String getAcr() {
		return EmailOTPService.ACR;
	}

	@Override
	public List<BasicCredential> getEnrolledCreds(String arg0) {
		try {
			return EmailOTPService.getInstance().getCredentials(sessionContext.getLoggedUser().getId())
					.stream().map(dev -> new BasicCredential(dev.getNickName(), 0)).collect(Collectors.toList());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Collections.emptyList();
		}
	}

	@Override
	public String getPageUrl() {
		return "user/cred_details.zul";
	}

	@Override
	public String getPanelButtonKey() {
		return "panel.button";
	}

	@Override
	public String getPanelTextKey() {
		return "panel.text";
	}

	@Override
	public String getPanelTitleKey() {
		return "email.title";
	}

	@Override
	public int getTotalUserCreds(String arg0) {
		return EmailOTPService.getInstance().getCredentialsTotal( sessionContext.getLoggedUser().getId());
	}

	@Override
	public String getUINameKey() {
		return "email.title";
	}

	@Override
	public void reloadConfiguration() {
	    EmailOTPService.getInstance().reloadConfiguration();
	}

}
