/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.model;

import org.gluu.casa.core.pojo.User;

/**
 * @author jgomer
 */
public class PersonSearchMatch extends User {

    private boolean alreadyReset;
    //Used to associate with checkboxes of the grid
    private boolean checked;

    public boolean isAlreadyReset() {
        return alreadyReset;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public void setAlreadyReset(boolean alreadyReset) {
        this.alreadyReset = alreadyReset;
    }

}
