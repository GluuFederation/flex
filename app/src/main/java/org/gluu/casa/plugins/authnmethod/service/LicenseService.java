package org.gluu.casa.plugins.authnmethod.service;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.TimeZone;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.model.Client;
import org.gluu.casa.ui.model.LicenseInfo;
import org.gluu.oxd.license.client.js.Product;
import org.gluu.oxd.license.validator.LicenseContent;
import org.gluu.oxd.license.validator.LicenseValidator;
import org.gluu.search.filter.Filter;
import org.slf4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.util.StaticUtils;

import net.nicholaswilliams.java.licensing.exception.InvalidLicenseException;

@Named
@ApplicationScoped
public class LicenseService {
	private String CLIENT_DISPLAY_NAME = "displayName";
	private String CASA_CLIENT_NAME_PREFIX = "gluu-casa_";
	@Inject
	private PersistenceService persistenceService;
	private static final String LICENSE_FILE_PATH = System.getProperty("server.base") + File.separator
			+ "casa-license.json";
	private static final int EXPIRY_PERIOD_IN_DAYS = 30;
	@Inject
	private Logger logger;
	private Client casaClient;

	public boolean verifyLicense() {

		try {
			LicenseInfo licenseInfo = readLicenseFile();

			LicenseContent c = LicenseValidator.validate(licenseInfo.getPublicKey(), licenseInfo.getPublicPassword(),
					licenseInfo.getLicensePassword(), licenseInfo.getLicense(), Product.CASA, new Date());
			return c.isValid();
		} catch (InvalidLicenseException e) {
			logger.error("License not valid - {} - {}", e.getClass().getSimpleName(), e.getMessage());
		} catch (IOException e) {
			logger.warn("License verification failed - {} - {}", e.getClass().getSimpleName(), e.getMessage());
		}
		return false;

	}

	private LicenseInfo readLicenseFile() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		File file = new File(LICENSE_FILE_PATH);
		return mapper.readValue(file, LicenseInfo.class);
	}

	public LocalDateTime getTrialExpiryDate() {
		LocalDateTime installDate = getInstallDate();
		return installDate.plusDays(EXPIRY_PERIOD_IN_DAYS);
	}

	public boolean isTrialPeriod() {
		
		return LocalDateTime.now().isBefore(getInstallDate());
	}

	private LocalDateTime getInstallDate() {

		Filter filter = Filter.createSubstringFilter(CLIENT_DISPLAY_NAME, CASA_CLIENT_NAME_PREFIX, null, null);

		// get(0) will never be null
		casaClient = persistenceService.find(Client.class, persistenceService.getClientsDn(), filter).get(0);
		try {
			Date d = StaticUtils.decodeGeneralizedTime(casaClient.getOxAuthClientIdIssuedAt());
			return LocalDateTime.ofInstant(Instant.ofEpochMilli(d.getTime()),
					TimeZone.getDefault().toZoneId());
		} catch (ParseException e) {
			// this will never occur
			logger.error("Unable to get install data - " + e.getMessage());
			return null;
		}

	}
	
	

}
