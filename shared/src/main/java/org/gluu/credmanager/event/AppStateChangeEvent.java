/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.event;

import org.gluu.credmanager.misc.AppStateEnum;

/**
 * @author jgomer
 */
public class AppStateChangeEvent {

    private AppStateEnum state;

    public AppStateChangeEvent(AppStateEnum state) {
        this.state = state;
    }

    public AppStateEnum getState() {
        return state;
    }

}
