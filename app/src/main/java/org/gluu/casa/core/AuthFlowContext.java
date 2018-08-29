/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.inject.Named;
import java.io.Serializable;

/**
 * @author jgomer
 */
@Named
@SessionScoped
public class AuthFlowContext implements Serializable {

    //Inner enums are static
    public enum RedirectStage {NONE, INITIAL, BYPASS};

    private RedirectStage stage;

    private String idToken;

    public RedirectStage getStage() {
        return stage;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setStage(RedirectStage stage) {
        this.stage = stage;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    @PostConstruct
    private void init() {
        stage = RedirectStage.NONE;
    }

}
