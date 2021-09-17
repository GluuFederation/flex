package org.gluu.casa.plugins.stytch;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpHeaders;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.stytch.model.PersonMobile;
import org.gluu.casa.plugins.stytch.model.StytchPhoneCredential;
import org.gluu.casa.service.IPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.okhttp.Call;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

/**
 * Class that holds the logic to list and enroll duo creds
 * 
 * @author madhumita
 *
 */

public class StytchService {

	public static final int DEFAULT_TIMEOUT_SECS = 6000;
	private static StytchService SINGLE_INSTANCE = null;
	public static Map<String, String> properties;
	private Logger logger = LoggerFactory.getLogger(getClass());
	public static String ACR = "stytch";
	private static ObjectMapper mapper;
	private IPersistenceService persistenceService;

	private StytchService() {
		persistenceService = Utils.managedBean(IPersistenceService.class);
		reloadConfiguration();
		mapper = new ObjectMapper();

	}

	public static StytchService getInstance() {
		if (SINGLE_INSTANCE == null) {
			synchronized (StytchService.class) {
				SINGLE_INSTANCE = new StytchService();
			}
		}
		return SINGLE_INSTANCE;
	}

	public void reloadConfiguration() {
		properties = persistenceService.getCustScriptConfigProperties(ACR);

		if (properties == null) {
			logger.warn(
					"Config. properties for custom script '{}' could not be read. Features related to {} will not be accessible",
					ACR, ACR.toUpperCase());
		}
	}

	public String getScriptPropertyValue(String value) {
		return properties.get(value);
	}

	public int getDeviceTotal(User user) {

		return (getMobileDevices(user.getId()) == null) ? 0 : 1;
	}

	public List<StytchPhoneCredential> getMobileDevices(String userId) {

		List<StytchPhoneCredential> phones = new ArrayList<>();
		try {
			PersonMobile person = persistenceService.get(PersonMobile.class, persistenceService.getPersonDn(userId));
			String json = person.getMobileDevices();
			json = Utils.isEmpty(json) ? "[]" : mapper.readTree(json).get("phones").toString();
			logger.debug("json - " + json);
			List<StytchPhoneCredential> vphones = mapper.readValue(json,
					new TypeReference<List<StytchPhoneCredential>>() {
					});
			phones = person.getMobile().stream().map(str -> getExtraPhoneInfo(str, vphones)).sorted()
					.collect(Collectors.toList());
			logger.trace("getVerifiedPhones. User '{}' has {}", userId,
					phones.stream().map(StytchPhoneCredential::getNumber).collect(Collectors.toList()));
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return (phones != null && phones.size() > 0) ? phones : null;

	}

	public boolean writeToPersistence(String number, String stytchPhoneId, String stytchUserId, String inum)
			throws JsonProcessingException {
		// add an entry to persistence
		/*
		 * {"phones":[{"nickName":"MotoG6","number":"12345645665",
		 * "stytch_phone_id":"phone-number-test-065bcf8c-c03d-4341-a07d-2c09a5e901a1",
		 * "stytch_user_id" :"user-test-34e117d5-758a-4650-b056-1c19e1056a7f",
		 * "addedOn":1625401486407}]}
		 */
		StytchPhoneCredential cred = new StytchPhoneCredential();
		cred.setNickName("Stytch credentials");
		cred.setAddedOn(System.currentTimeMillis());
		cred.setNumber(number);
		cred.setStytchUserId(stytchUserId);
		cred.setStytchPhoneId(stytchPhoneId);
		String json = mapper.writeValueAsString(cred);

		PersonMobile person = persistenceService.get(PersonMobile.class, persistenceService.getPersonDn(inum));
		person.setMobileDevices(json);

		boolean success = persistenceService.modify(person);
		return success;
	}

	/**
	 * Creates an instance of VerifiedMobile by looking up in the list of
	 * VerifiedPhones passed. If the item is not found in the list, it means the
	 * user had already that phone added by means of another application, ie.
	 * oxTrust. In this case the resulting object will not have properties like
	 * nickname, etc. Just the phone number
	 * 
	 * @param number Phone number (LDAP attribute "mobile" inside a user entry)
	 * @param list   List of existing phones enrolled. Ideally, there is an item
	 *               here corresponding to the uid number passed
	 * @return VerifiedMobile object
	 */
	private StytchPhoneCredential getExtraPhoneInfo(String number, List<StytchPhoneCredential> list) {
		// Complements current phone with extra info in the list if any
		StytchPhoneCredential phone = new StytchPhoneCredential();

		Optional<StytchPhoneCredential> extraInfoPhone = list.stream().filter(ph -> number.equals(ph.getNumber()))
				.findFirst();
		if (extraInfoPhone.isPresent()) {
			phone.setAddedOn(extraInfoPhone.get().getAddedOn());
			phone.setNickName(extraInfoPhone.get().getNickName());
			phone.setStytchUserId(extraInfoPhone.get().getStytchUserId());
			phone.setStytchPhoneId(extraInfoPhone.get().getStytchPhoneId());
		}
		return phone;
	}

	public boolean isNumberRegistered(String number) {

		PersonMobile person = new PersonMobile();
		person.setMobile(Collections.singletonList(number));
		person.setBaseDn(persistenceService.getPeopleDn());
		return persistenceService.count(person) > 0;

	}

	public boolean updateMobilePhonesAdd(String userId, List<StytchPhoneCredential> mobiles,
			StytchPhoneCredential newPhone) {

		boolean success = false;
		try {
			List<StytchPhoneCredential> vphones = new ArrayList<>(mobiles);
			if (newPhone != null) {
				vphones.add(newPhone);
			}

			List<String> numbers = vphones.stream().map(StytchPhoneCredential::getNumber).collect(Collectors.toList());
			String json = numbers.size() > 0 ? mapper.writeValueAsString(Collections.singletonMap("phones", vphones))
					: null;

			logger.debug("Updating phones for user '{}'", userId);
			PersonMobile person = persistenceService.get(PersonMobile.class, persistenceService.getPersonDn(userId));
			person.setMobileDevices(json);
			person.setMobile(numbers);

			success = persistenceService.modify(person);

			if (success && newPhone != null) {
				// modify list only if LDAP update took place
				mobiles.add(newPhone);
				logger.debug("Added {}", newPhone.getNumber());
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return success;

	}

	public boolean addPhone(String userId, StytchPhoneCredential newPhone) {
		return updateMobilePhonesAdd(userId, getMobileDevices(userId), newPhone);
	}

	public StytchPhoneCredential sendSMS(String phoneNumber, String userId) {
		OkHttpClient httpClient = new OkHttpClient();
		String data = "{ \"phone_number\": \"+" + phoneNumber + "\"}";

		RequestBody body = RequestBody.create(MediaType.parse("application/json"), data);

		String asB64 = new String(new Base64().encode(
				(properties.get("PROJECT_ID") + ":" + properties.get("SECRET")).getBytes(StandardCharsets.UTF_8)),
				StandardCharsets.UTF_8);

		String authHeader = "Basic " + new String(asB64);

		Request request = new Request.Builder().url(getScriptPropertyValue("ENROLL_ENDPOINT")).post(body)
				.addHeader(HttpHeaders.AUTHORIZATION, authHeader).addHeader("Content-Type", "application/json").build();

		Call call = httpClient.newCall(request);
		logger.debug(request.toString() + "-" + request.headers() + "-" + request.body().toString());
		try {
			Response response = call.execute();
			if (response.code() == 200 || response.code() == 201) {
				String responseBody = response.body().string();
				Map<String, String> map = mapper.readValue(responseBody, Map.class);
				StytchPhoneCredential stytchPhoneCred = new StytchPhoneCredential();
				stytchPhoneCred.setStytchUserId(map.get("user_id"));
				stytchPhoneCred.setStytchPhoneId(map.get("phone_id"));
				return stytchPhoneCred;

			} else {
				logger.debug("Response for enrolling user was : " + response.code() + "---" + response.message());

				return null;
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			return null;
		}
	}

	// curl --request DELETE --url
	// https://test.stytch.com/v1/users/user-test-2a80900ef -u
	// 'project-test-918d-74cde970a61e:secret-test-N6SYPKrD6RdEk8KJis=' -H
	// 'Content-Type: application/json'
	public boolean deleteUser(String stytchUserId) {
		OkHttpClient httpClient = new OkHttpClient();
		String asB64 = new String(new Base64().encode(
				(properties.get("PROJECT_ID") + ":" + properties.get("SECRET")).getBytes(StandardCharsets.UTF_8)),
				StandardCharsets.UTF_8);
		String authHeader = "Basic " + new String(asB64);
		Request request = new Request.Builder().url(getScriptPropertyValue("DELETE_USER_ENDPOINT") + stytchUserId)
				.delete().addHeader(HttpHeaders.AUTHORIZATION, authHeader).addHeader("Content-Type", "application/json")
				.build();

		Call call = httpClient.newCall(request);
		logger.debug(request.toString() + "-" + request.headers() + "-" + request.body().toString());
		try {
			Response response = call.execute();
			if (response.code() == 200 || response.code() == 201) {
				return true;

			} else {
				logger.debug("Response for enrolling user was : " + response.code() + "---" + response.message());
				return false;
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			return false;
		}
	}

	public boolean verifyCode(String methodId, String code) {
		OkHttpClient httpClient = new OkHttpClient();
		String data = "{\"method_id\": \"" + methodId + "\", \"code\": \"" + code + "\" }";
		logger.debug("method_id -" + methodId + "-code " + code);
		RequestBody body = RequestBody.create(MediaType.parse("application/json"), data);
		String asB64 = new String(new Base64().encode(
				(properties.get("PROJECT_ID") + ":" + properties.get("SECRET")).getBytes(StandardCharsets.UTF_8)),
				StandardCharsets.UTF_8);
		String authHeader = "Basic " + new String(asB64);
		Request request = new Request.Builder().url(getScriptPropertyValue("AUTH_ENDPOINT")).post(body)
				.addHeader(HttpHeaders.AUTHORIZATION, authHeader).addHeader("Content-Type", "application/json").build();

		Call call = httpClient.newCall(request);
		logger.debug(request.toString() + "-" + request.headers() + "-" + request.body().toString());
		try {
			Response response = call.execute();
			if (response.code() == 200 || response.code() == 201) {
				return true;

			} else {
				String responseBody = response.body().string();
				Map<String, String> map = mapper.readValue(responseBody, Map.class);
				logger.debug("Response for verifyCode user was : " + response.code() + "---" + response.message()
						+ "Error details:" + map);

				// if code is incorrect, even if the record from Stytch Server is not deleted,
				// the subsequent call to login_or_create will return the same user_id, which
				// should be ok.
				return false;
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			return true;
		}
	}
}
