/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.pojo;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * The superclass for all type of credentials
 * @author jgomer
 */
public class RegisteredCredential {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String nickName;

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickname) {
        this.nickName = nickname;
    }

}
