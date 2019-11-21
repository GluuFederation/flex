package org.gluu.casa.ui.vm.admin;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.gluu.casa.core.SessionContext;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.plugins.authnmethod.service.LicenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Init;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.WireVariable;

/**
 * @author madhumita
 *
 */
public class AdminMainViewModel {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private String licenseRelatedMessage;

	@WireVariable
	private LicenseService licenseService;
	
	@WireVariable
	private SessionContext sessionContext;

	User user;

	public String getLicenseRelatedMessage() {
		return licenseRelatedMessage;
	}

	@Init(superclass = true)
	public void childInit() {

		user = sessionContext.getUser();
		if (user.isRoleAdmin()) {
			LocalDateTime expiryDate = licenseService.getTrialExpiryDate();
			String daysUntilExpiry = String.valueOf(LocalDateTime.now().until( expiryDate,ChronoUnit.DAYS));
			boolean verified = licenseService.verifyLicense();
			
			if (licenseService.isTrialPeriod() && !verified) {
				licenseRelatedMessage = Labels.getLabel("adm.casa.trial.period", new String[] { daysUntilExpiry });
			} else if (!verified) {
				licenseRelatedMessage = Labels.getLabel("adm.casa.invalid.license");
			}
		}
	}

}
