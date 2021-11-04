package org.gluu.casa.core.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;
import io.jans.orm.annotation.JsonObject;
import io.jans.orm.model.base.Entry;

import java.util.Date;

//Using org.gluu.fido2.model.entry.Fido2RegistrationEntry directly from fido2-model artifact
//does not work well, why!!! why!!!
@DataEntry
@ObjectClass(value = "oxFido2RegistrationEntry")
public class Fido2RegistrationEntry extends Entry {

	@AttributeName(name = "displayName")
	private String displayName;

	@AttributeName(name = "creationDate")
	private Date creationDate;

	@AttributeName(name = "oxId")
	private String id;

	
	@JsonObject
	@AttributeName(name = "oxRegistrationData" , ignoreDuringUpdate = true)
	private Fido2RegistrationData registrationData;

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Fido2RegistrationData getRegistrationData() {
		return registrationData;
	}

	public void setRegistrationData(Fido2RegistrationData registrationData) {
		this.registrationData = registrationData;
	}

}
