/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.core.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class PassResetViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private LdapService ldapService;

    private boolean passResetEnabled;
    private boolean passResetImpossible;

    public boolean isPassResetEnabled() {
        return passResetEnabled;
    }

    public boolean isPassResetImpossible() {
        return passResetImpossible;
    }

    public void setPassResetEnabled(boolean passResetEnabled) {
        this.passResetEnabled = passResetEnabled;
    }

    @Init//(superclass = true)
    public void init() {
        passResetImpossible = ldapService.isBackendLdapEnabled();
        passResetEnabled = !passResetImpossible && getSettings().isEnablePassReset();
    }

    @Command
    public void change() {
        getSettings().setEnablePassReset(passResetEnabled);
        updateMainSettings();
    }

}
