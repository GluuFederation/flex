/*
 * client-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.model;

import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.List;

@DataEntry
@ObjectClass("oxAuthClient")
public class Client extends InumEntry {

	@AttributeName
	private String displayName;

	@AttributeName
	private String oxAuthClientIdIssuedAt;

	public String getOxAuthClientIdIssuedAt() {
		return oxAuthClientIdIssuedAt;
	}

	public void setOxAuthClientIdIssuedAt(String oxAuthClientIdIssuedAt) {
		this.oxAuthClientIdIssuedAt = oxAuthClientIdIssuedAt;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

}
