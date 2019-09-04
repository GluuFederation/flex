package org.gluu.casa.license;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.TimeZone;
import java.util.stream.Stream;

import org.gluu.oxd.license.client.js.Product;
import org.gluu.oxd.license.validator.LicenseContent;
import org.gluu.oxd.license.validator.LicenseValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.nicholaswilliams.java.licensing.exception.InvalidLicenseException;

public class LicenseUtils {

	private static final String LICENSE_FILE_PATH = System.getProperty("server.base") + File.separator
			+ "casa-license.json";
	private static final int EXPIRY_PERIOD_IN_DAYS = 30;
	private static Logger LOG = LoggerFactory.getLogger(LicenseUtils.class);

	public static boolean verifyLicense() {

		try {
			LicenseInfo licenseInfo = readLicenseFile();

			LicenseContent c = LicenseValidator.validate(licenseInfo.getPublicKey(), licenseInfo.getPublicPassword(),
					licenseInfo.getLicensePassword(), licenseInfo.getLicense(), Product.CASA, new Date());
			return c.isValid();
		} catch (InvalidLicenseException e) {
			LOG.error("License not valid - {} - {}", e.getClass().getSimpleName(), e.getMessage());
		} catch (IOException e) {
			LOG.warn("License verification failed - {} - {}", e.getClass().getSimpleName(), e.getMessage());
		}
        return false;

	}

	private static LicenseInfo readLicenseFile() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		File file = new File(LICENSE_FILE_PATH);
		return mapper.readValue(file, LicenseInfo.class);
	}

	public static LocalDateTime getTrialExpiryDate() {
		LocalDateTime installDate = getInstallDate();
		return installDate.plusDays(EXPIRY_PERIOD_IN_DAYS);
	}

	public static boolean isTrialPeriod(LocalDateTime trialExpiryDate) {
		return LocalDateTime.now().isBefore(trialExpiryDate);
	}

	private static LocalDateTime getInstallDate() {
		File file = new File("/install/community-edition-setup/setup_casa.log");
		return LocalDateTime.ofInstant(Instant.ofEpochMilli(file.lastModified()), TimeZone.getDefault().toZoneId());
	}
	
}
