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

    private boolean hasSessionAtOP;

    public RedirectStage getStage() {
        return stage;
    }

    public String getIdToken() {
        return idToken;
    }

    public boolean isHasSessionAtOP() {
        return hasSessionAtOP;
    }

    public void setStage(RedirectStage stage) {
        this.stage = stage;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public void setHasSessionAtOP(boolean hasSessionAtOP) {
        this.hasSessionAtOP = hasSessionAtOP;
    }

    @PostConstruct
    private void init() {
        stage = RedirectStage.NONE;
    }

}
