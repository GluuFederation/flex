/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.credmanager.core.pojo;

/**
 * An object of this class represents an end-user, contains the most important things such as username, preferred authn
 * method, and set of enrolled credentials. This class is NOT being serialized or annotated to make it persist to LDAP
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

    public String getUserName() {
        return userName;
    }

    public String getGivenName() {
        return givenName;
    }

    public String getEmail() {
        return email;
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

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public void setEmail(String email) {
        this.email = email;
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

}
