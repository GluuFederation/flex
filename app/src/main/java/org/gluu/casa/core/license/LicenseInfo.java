package org.gluu.casa.license;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;


@JsonIgnoreProperties(ignoreUnknown = true)
public class LicenseInfo  {

	@JsonProperty(value = "license")
	private String license;
	@JsonProperty(value = "license-id")
	private String licenseId;
	@JsonProperty(value = "public-password")
	private String publicPassword;
	@JsonProperty(value = "public-key")
	private String publicKey;

	@JsonProperty(value = "license-password")
	private String licensePassword;

	@JsonProperty(value = "license-hash")
	private String licenseHash;

	public String getLicense() {
		return license;
	}

	public void setLicense(String license) {
		this.license = license;
	}

	public String getLicenseId() {
		return licenseId;
	}

	public void setLicenseId(String licenseId) {
		this.licenseId = licenseId;
	}

	public String getPublicPassword() {
		return publicPassword;
	}

	public void setPublicPassword(String publicPassword) {
		this.publicPassword = publicPassword;
	}

	public String getPublicKey() {
		return publicKey;
	}

	public void setPublicKey(String publicKey) {
		this.publicKey = publicKey;
	}

	public String getLicensePassword() {
		return licensePassword;
	}

	public void setLicensePassword(String licensePassword) {
		this.licensePassword = licensePassword;
	}

	public String getLicenseHash() {
		return licenseHash;
	}

	public void setLicenseHash(String licenseHash) {
		this.licenseHash = licenseHash;
	}

}