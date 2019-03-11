package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.PasswordStatusService;
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
    private PersistenceService persistenceService;

    @WireVariable("passwordStatusService")
    private PasswordStatusService pst;

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

    @Init
    public void init() {
        passResetImpossible = persistenceService.isBackendLdapEnabled();
        passResetEnabled = !passResetImpossible && getSettings().isEnablePassReset();
    }

    @Command
    public void change() {
        getSettings().setEnablePassReset(passResetEnabled);
        updateMainSettings();
        pst.reloadStatus();
    }

}
