/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.ui.model;

import org.zkoss.util.Pair;

import java.util.List;

/**
 * @author jgomer
 */
public class AuthnMethodStatus {

    private boolean enabled;
    private String acr;
    private String name;
    private String selectedPugin;
    private List<Pair<String, String>> plugins;

    public boolean isEnabled() {
        return enabled;
    }

    public String getAcr() {
        return acr;
    }

    public String getName() {
        return name;
    }

    public String getSelectedPugin() {
        return selectedPugin;
    }

    public List<Pair<String, String>> getPlugins() {
        return plugins;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAcr(String acr) {
        this.acr = acr;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSelectedPugin(String selectedPugin) {
        this.selectedPugin = selectedPugin;
    }

    public void setPlugins(List<Pair<String, String>> plugins) {
        this.plugins = plugins;
    }

}
