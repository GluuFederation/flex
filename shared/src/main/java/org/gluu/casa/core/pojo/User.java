/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.core.pojo;

/**
 * A java bean representing an end-user. It contains the most common attributes such as id, username, preferred
 * authentication method, etc. Use the setter and getters to manipulate values.
 * @author jgomer
 */
public class User {

    private String userName;
    private String givenName;
    private String lastName;
    private String email;
    private boolean admin;
    private String id;
    private String preferredMethod;
    private String pictureURL;
    // this variable roleAdmin has been introduced to avoid a call to persistenceService
    // the boolean variable admin is true if the user has admin role + if administration is enabled on casa node by virtue of .administrable file + if the license file is valid
    // the roleAdmin variable - only indicates if the user has admin role 
    private boolean roleAdmin;

    public boolean isRoleAdmin() {
		return roleAdmin;
	}

	public void setRoleAdmin(boolean roleAdmin) {
		this.roleAdmin = roleAdmin;
	}

	public String getUserName() {
        return userName;
    }

    public String getGivenName() {
        return givenName;
    }

    public boolean isAdmin() {
        return admin;
    }

    public String getPreferredMethod() {
        return preferredMethod;
    }

    public String getId() {
        return id;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPictureURL() {
        return pictureURL;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPreferredMethod(String preferredMethod) {
        this.preferredMethod = preferredMethod;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPictureURL(String pictureURL) {
        this.pictureURL = pictureURL;
    }

}
