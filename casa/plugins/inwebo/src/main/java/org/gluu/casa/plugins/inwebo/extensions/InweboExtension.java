package org.gluu.casa.plugins.inwebo.extensions;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.gluu.casa.credential.BasicCredential;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.inwebo.InweboService;
import org.gluu.casa.service.ISessionContext;
import org.pf4j.Extension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Extension
public class InweboExtension implements AuthnMethod {

	public static final String ACR = "inwebo";
	

	private Logger logger = LoggerFactory.getLogger(getClass());
	private ISessionContext sessionContext;

	public InweboExtension() {
sessionContext = 	Utils.managedBean(ISessionContext.class);
	}

	public String getUINameKey() {

		return "inwebo_label";
	}

	public String getAcr() {
		return ACR;
	}

	public String getPanelTitleKey() {
		return "inwebo_title";
	}

	public String getPanelTextKey() {
		return "inwebo_text";
	}

	public String getPanelButtonKey() {
	
		return "inwebo_manage";
	}

	public String getPanelBottomTextKey() {
		return "inwebo_download";
	}

	public String getPageUrl() {
		return "cred_details.zul";
	
	}

	public List<BasicCredential> getEnrolledCreds(String id) {
		
		String userName = sessionContext.getLoggedUser().getUserName();
		
		try {
			return InweboService.getInstance().getDevices(userName).stream()
					.map(dev -> new BasicCredential(dev.getNickName(), 0)).collect(Collectors.toList());

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Collections.emptyList();
		}

	}

	public int getTotalUserCreds(String id) {
		String userName = sessionContext.getLoggedUser().getUserName();
		
		return InweboService.getInstance().getDeviceTotal(userName);
	}

	public void reloadConfiguration() {
		InweboService.getInstance().reloadConfiguration();

	}

	public boolean mayBe2faActivationRequisite() {
		return false;//Boolean.parseBoolean(InweboService.getInstance().getScriptPropertyValue("2fa_requisite"));
	}
}
