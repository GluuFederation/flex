package org.gluu.casa.license;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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
			String currentTimeInMilliseconds = String.valueOf(System.currentTimeMillis());

			LicenseContent c = LicenseValidator.validate(licenseInfo.getPublicKey(), licenseInfo.getPublicPassword(),
					licenseInfo.getLicensePassword(), licenseInfo.getLicense(), Product.CASA,
					new Date(Long.parseLong(currentTimeInMilliseconds)));
			return c.isValid();
		} catch (InvalidLicenseException e) {
			LOG.error("License not valid - {} - {}", e.getClass().getSimpleName(), e.getMessage());
			return false;
		} catch (IOException e) {
			LOG.warn("License verification failed - {} - {}", e.getClass().getSimpleName(), e.getMessage());
			return false;
		}
	}

	private static LicenseInfo readLicenseFile() throws IOException {
		ObjectMapper mapper = new ObjectMapper();

		File file = new File(LICENSE_FILE_PATH);

		LicenseInfo licenseInfo = mapper.readValue(file, LicenseInfo.class);
		return licenseInfo;
	}

	public static LocalDateTime getTrialExpiryDate() {
		LocalDateTime installDate = getInstallDate();
		LocalDateTime trialExpiryDate = installDate.plusDays(EXPIRY_PERIOD_IN_DAYS);
		return trialExpiryDate;
	}

	public static boolean isTrialPeriod(LocalDateTime trialExpiryDate) {
		return LocalDateTime.now().isBefore(trialExpiryDate);
	}

	private static LocalDateTime getInstallDate() {
		String SETUP_CASA_LOG_LOCATION = "/install/community-edition-setup/setup_casa.log";
		
		try (Stream<String> lines = Files.lines(Paths.get(SETUP_CASA_LOG_LOCATION), Charset.defaultCharset())) {

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss MM/dd/yy");
			String line1 = lines.findFirst().get();
			
			  LocalDateTime installDate = LocalDateTime.parse(line1.substring(0, line1.indexOf("Installing Gluu Casa")-1), formatter);
			return installDate;
		}
		catch (Exception e) {
			LOG.error("ParseException in setup_casa.log - " + e.getMessage());
			return null;
		}
	}
	
}
