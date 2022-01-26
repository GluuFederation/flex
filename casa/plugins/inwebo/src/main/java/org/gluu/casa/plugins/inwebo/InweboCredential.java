package org.gluu.casa.plugins.inwebo;

import org.gluu.casa.credential.BasicCredential;

/**
 * Represents an inwebo credential
 * 
 * @author madhumita
 *
 */
public class InweboCredential extends BasicCredential {

	public InweboCredential(String nickName, long addedOn) {
		super(nickName, addedOn);

	}

	public static final String VIRTUAL_AUTHENTICATOR = "va";
	public static final String MOBILE_AUTHENTICATOR = "ma";
	public static final String HELIUM_AUTHENTICATOR = "ca";
	public static final String M_ACCESS_AUTHENTICATOR = "mac";

	private long credentialId;
	private String credentialType;
	private String credentialName;

	public String getCredentialName() {
		return credentialName;
	}

	public void setCredentialName(String credentialName) {
		this.credentialName = credentialName;
	}

	public long getCredentialId() {
		return credentialId;
	}

	public void setCredentialId(long credentialId) {
		this.credentialId = credentialId;
	}

	public String getCredentialType() {
		return credentialType;
	}

	public void setCredentialType(String credentialType) {
		this.credentialType = credentialType;
	}
	
	public String getNickName()
	{
		return super.getNickName();
	}
}
