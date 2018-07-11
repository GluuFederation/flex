/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.credential;

/**
 * @author jgomer
 */
public class BasicCredential {

    private String nickName;
    private long addedOn;

    public BasicCredential(String nickName, long addedOn) {
        this.nickName = nickName;
        this.addedOn = addedOn;
    }

    public String getNickName() {
        return nickName;
    }

    public long getAddedOn() {
        return addedOn;
    }

}
