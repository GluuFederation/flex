package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.conf.LdapSettings;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;
import org.zkoss.zul.Messagebox;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class LdapSettingsViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());
    
    // to use constants inside a zul page, use static final property with a non static getter
    private static final String databaseTypeLdap = LdapSettings.BACKEND.LDAP.getValue();
    
    private static final String databaseTypeCouchbase = LdapSettings.BACKEND.COUCHBASE.getValue();

    private boolean isLdapType =false;

    public boolean isLdapType() {
		return isLdapType;
	}

	public void setLdapType(boolean isLdapType) {
		this.isLdapType = isLdapType;
	}

	@WireVariable
    private PersistenceService persistenceService;

    private LdapSettings ldapSettings;
    
	public LdapSettings getLdapSettings() {
        return ldapSettings;
    }

    public void setLdapSettings(LdapSettings ldapSettings) {
        this.ldapSettings = ldapSettings;
    }

    public String getDatabaseTypeLdap() {
    	return databaseTypeLdap;
    }
    
    public String getDatabaseTypeCouchbase() {
    	return databaseTypeCouchbase;
    }

	@Init//(superclass = true)
    public void init() {
        reloadConfig();
    }

    @NotifyChange({"ldapSettings"})
    @Command
    public void save() {

        //salt is optional
        if (Utils.isNotEmpty(ldapSettings.getConfigurationFile()) && ldapSettings.getConfigurationFile().trim().length() > 0) {
            String msg = updateLdapSettings();
            if (msg != null) {
                reloadConfig();
                Messagebox.show(msg, null, Messagebox.OK, Messagebox.EXCLAMATION);
            } else {
                getSettings().setLdapSettings(ldapSettings);
                updateMainSettings();
            }
        } else {
            UIUtils.showMessageUI(false, Labels.getLabel("adm.ldap_nonempty"));
        }

    }

    private void reloadConfig() {
        ldapSettings = (LdapSettings) Utils.cloneObject(getSettings().getLdapSettings());
        isLdapType = getDatabaseTypeLdap().equalsIgnoreCase(ldapSettings.getType());
    }

    //This method does not change application level settings
    private String updateLdapSettings() {

        boolean success = false;
        String msg = null;
        try {
            logger.info("Testing newer LDAP settings");
            success = persistenceService.setup(ldapSettings);
        } catch (Exception e) {
            msg = e.getMessage();
        }
        if (!success && msg == null) {
            msg = Labels.getLabel("adm.ldap_novalid");
        }
        if (!success) {
            try {
                //Revert to good settings
                logger.warn("Reverting to previously working LDAP settings");
                if (persistenceService.setup(getSettings().getLdapSettings())) {
                    msg += "\n" + Labels.getLabel("admin.reverted");
                } else {
                    msg += "\n" + Labels.getLabel("admin.error_reverting");
                }
            } catch (Exception e) {
                msg += "\n" + Labels.getLabel("admin.error_reverting");
                logger.error(e.getMessage(), e);
            }
        }
        return msg;

    }

    @NotifyChange("ldapSettings")
    @Command
    public void setType(@BindingParam("type") String type) {
    	
    	if (getDatabaseTypeLdap().equalsIgnoreCase(type)) {
            ldapSettings.setType(LdapSettings.BACKEND.LDAP.getValue());
        } else if (getDatabaseTypeCouchbase().equalsIgnoreCase(type)) {
            ldapSettings.setType(LdapSettings.BACKEND.COUCHBASE.getValue());
        }
    
    }

}
