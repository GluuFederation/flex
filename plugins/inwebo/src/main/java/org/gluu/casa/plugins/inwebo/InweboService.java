package org.gluu.casa.plugins.inwebo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.gluu.casa.core.ldap.oxCustomScript;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.ILdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.zk.ui.Executions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inwebo.api.sample.User;
import com.inwebo.api.sample.UserList;
import com.inwebo.console.ConsoleAdmin;
import com.inwebo.console.ConsoleAdminService;
import com.inwebo.console.LoginCreateResult;
import com.inwebo.console.LoginQueryResult;
import com.inwebo.console.LoginSearchResult;
import com.inwebo.support.Util;

/**
 * Class that holds the logic to list and enroll inwebo devices
 * 
 * @author madhumita
 *
 */
//TODO:check if this should be a singleton class

public class InweboService {

	private static InweboService SINGLE_INSTANCE = null;
	public static Map<String, String> properties;
	private Logger logger = LoggerFactory.getLogger(getClass());
	public static String ACR = "inwebo";

	private static String CERTIFICATE_PATH_PROP = "iw_cert_path";
	private static String CERTIFICATE_PASSPHRASE_JSON_FILE = "iw_creds_file";
	private static String PASSPHRASE_FOR_CERTIFICATE = "CERT_PASSWORD";
	private static String SERVICE_ID = "iw_service_id";

	private ILdapService ldapService;
	private final ConsoleAdminService cas;
	private final ConsoleAdmin consoleAdmin;
	private final long serviceId;
	private final String p12password;
	private final String p12file;

	private InweboService() {
		ldapService = Utils.managedBean(ILdapService.class);
		reloadConfiguration();

		cas = new ConsoleAdminService();
		consoleAdmin = cas.getConsoleAdmin();

		p12file = properties.get(CERTIFICATE_PATH_PROP); // "/etc/certs/Gluu_dev.p12";
		// This is the password to access your certificate file
		p12password = this.getCertificatePassphrase(properties.get(CERTIFICATE_PASSPHRASE_JSON_FILE));
		serviceId = Long.valueOf(properties.get(SERVICE_ID)); // 5686; // This is the id of your service.


		Util.activeSoapLog(false);
		try {
			Util.setHttpsClientCert(p12file, p12password);

		} catch (final Exception e1) {
			e1.printStackTrace();

		}

	}

	public static InweboService getInstance() {
		if (SINGLE_INSTANCE == null) {
			synchronized (InweboService.class) {
				SINGLE_INSTANCE = new InweboService();
			}
		}
		return SINGLE_INSTANCE;
	}

	public void reloadConfiguration() {
		ObjectMapper mapper = new ObjectMapper();
		properties = getCustScriptConfigProperties(ACR);
		if (properties == null) {
			logger.warn(
					"Config. properties for custom script '{}' could not be read. Features related to {} will not be accessible",
					ACR, ACR.toUpperCase());
		} else {
			try {
				logger.info("Inwebo settings found were: {}", mapper.writeValueAsString(properties));
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	public String getScriptPropertyValue(String value) {
		return properties.get(value);
	}

	public List<InweboCredential> getDevices(String userName) {

		User user = getUser(userName);
		if (user == null) {
			return null;
		}
		final LoginQueryResult result = consoleAdmin.loginQuery(0, user.getId());

		if (result != null && "ok".equalsIgnoreCase(result.getErr())) {

			List<InweboCredential> credList = new ArrayList<InweboCredential>();
			for (int i = 0; i < result.getNva(); i++) {
				InweboCredential credential = new InweboCredential(result.getVaname().get(i), 0);
				credential.setCredentialId(result.getVaid().get(i));

				credential.setCredentialType(InweboCredential.VIRTUAL_AUTHENTICATOR);
				credList.add(credential);
			}
			for (int i = 0; i < result.getNma(); i++) {
				InweboCredential credential = new InweboCredential(result.getManame().get(i), 0);
				credential.setCredentialId(result.getMaid().get(i));

				credential.setCredentialType(InweboCredential.MOBILE_AUTHENTICATOR);
				credList.add(credential);
			}
			return credList;
		} else {
			return null;
		}

	}

	public int getDeviceTotal(String userName) {
		List<InweboCredential> credList = getDevices(userName);
		if (credList == null)
			return 0;
		else
			return credList.size();
	}

	public User getUser(String username) {
		int offset = 0;
		int nmax = 1;
		int sort = 1;
		int exactmatch = 1;
		LoginSearchResult result = consoleAdmin.loginSearch(0, serviceId, username, exactmatch, offset, nmax, sort);
		if (result != null && "ok".equalsIgnoreCase(result.getErr())) {
			List<User> userList = new UserList(result);
			if (userList == null || userList.size() == 0)
				return null;
			else
				return (User) userList.get(0);
		} else {
			return null;
		}

	}

	public String getLongCode(long userId) {

		String result = consoleAdmin.loginAddDevice(0, serviceId, userId,
				CodeType.ACTIVATION_LINK_VALID_FOR_3_WEEKS.getCodeType());
		return result;
	}

	public long getUserId(String userName) {
		User user = getUser(userName);
		if (user == null) {
			return 0;
		} else {
			return user.getId();
		}
	}

	public String getActivationCode(String longCode) {
		LoginCreateResult info = consoleAdmin.loginGetInfoFromLink(longCode);
		String err = info.getErr();
		if (!err.equalsIgnoreCase("ok")) {
			return null;
		} else {
			return info.getCode();
		}
	}

	public boolean deleteInWeboDevice(String userName, long deviceId, String tooltype) {
		User user = getUser(userName);
		if (user == null)
			return false;
		String result = consoleAdmin.loginDeleteTool(user.getId(), serviceId, deviceId, tooltype);
		if ("OK".equalsIgnoreCase(result))
			return true;
		else
			return false;
	}

	public boolean updateInWeboDevice(String userName, long deviceId, String tooltype, String newName) {

		// User user = getUser(userName);
		String result = consoleAdmin.loginUpdateTool(0, serviceId, deviceId, tooltype, newName);

		if ("OK".equalsIgnoreCase(result))
			return true;
		else
			return false;
	}

	public boolean sendEmailForLinkActivation(String userName) {
		User user = getUser(userName);
		if (user == null)
			return false;
		// for email to work, you have to call loginAddDevice once more
		String longCode = consoleAdmin.loginAddDevice(0, serviceId, user.getId(),
				CodeType.ACTIVATION_LINK_VALID_FOR_3_WEEKS.getCodeType());
		String result = consoleAdmin.loginSendByMail(0, serviceId, user.getId());

		if (result.equalsIgnoreCase("nok")) {
			return false;
		} else {
			return true;
		}
	}

	

	public Map<String, String> getCustScriptConfigProperties(String displayName) {

		try {
			oxCustomScript script = new oxCustomScript();
			script.setDisplayName(displayName);

			List<oxCustomScript> scripts = ldapService.find(oxCustomScript.class, ldapService.getCustomScriptsDn(),
					null);
			for (oxCustomScript temp : scripts) {
				if (temp.getDisplayName().equalsIgnoreCase(displayName))
					return Utils.scriptConfigPropertiesAsMap(temp);
			}

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return null;
	}

	private String getCertificatePassphrase(String fileName) {
		// converting json to Map
		byte[] mapData;
		try {
			mapData = Files.readAllBytes(Paths.get(fileName));
			Map<String, String> myMap = new HashMap<String, String>();

			ObjectMapper objectMapper = new ObjectMapper();
			myMap = objectMapper.readValue(mapData, HashMap.class);
			return myMap.get(PASSPHRASE_FOR_CERTIFICATE);
		} catch (IOException e) {
			logger.debug("Error parsing the file containing the passphrase for the certificate");
			return null;
		}

	}

	public String getUserName(String id) {
		return ldapService.getPersonDn(id);
	}

	public String buildURLForActivation(String code) {
		StringBuilder url = new StringBuilder().append("https://").append(Executions.getCurrent().getServerName());
		url.append("/casa/pl/inwebo-plugin/add_cred.zul?code=").append(code);
		return url.toString();
	}

}
