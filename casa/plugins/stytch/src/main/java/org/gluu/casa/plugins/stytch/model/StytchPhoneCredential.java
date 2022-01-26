package org.gluu.casa.plugins.stytch.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.JsonObject;
import org.gluu.persist.annotation.ObjectClass;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents a registered stytch credential corresponding to a verified mobile
 * number
 * 
 * @author maduvena
 */
@DataEntry
@ObjectClass(value = "oxMobileDevices")
public class StytchPhoneCredential {

	private String number;
	private long addedOn;
	@JsonProperty("nickname")
	private String nickName;
	@JsonProperty("stytch_phone_id")
	private String stytchPhoneId;
	@JsonProperty("stytch_user_id")
	private String stytchUserId;

	public String getStytchPhoneId() {
		return stytchPhoneId;
	}

	public void setStytchPhoneId(String stytchPhoneId) {
		this.stytchPhoneId = stytchPhoneId;
	}

	public String getStytchUserId() {
		return stytchUserId;
	}

	public void setStytchUserId(String stytchUserId) {
		this.stytchUserId = stytchUserId;
	}

	public StytchPhoneCredential() {
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickname) {
		this.nickName = nickname;
	}

	public int compareTo(StytchPhoneCredential ph) {
		long date1 = getAddedOn();
		long date2 = ph.getAddedOn();
		return (date1 < date2) ? -1 : (date1 > date2 ? 1 : 0);
	}

	public long getAddedOn() {
		return addedOn;
	}

	public String getNumber() {
		return number;
	}

	public void setAddedOn(long addedOn) {
		this.addedOn = addedOn;
	}

	public void setNumber(String number) {
		this.number = number;
	}

}
