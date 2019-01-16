package org.gluu.casa.core;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ldap.IdentityPerson;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;

@Named
@SessionScoped
public class PasswordStatusService implements Serializable {

    private static final String EXTERNAL_IDENTITIES_PREFIX = "passport-";

    @Inject
    private Logger logger;

    @Inject
    private LdapService ldapService;

    @Inject
    private MainSettings confSettings;

    @Inject
    private SessionContext asco;

    private boolean passSetAvailable;
    private boolean passResetAvailable;
    private boolean password2faRequisite;

    public boolean isPassword2faRequisite() {
        return password2faRequisite;
    }

    public boolean isPassSetAvailable() {
        return passSetAvailable;
    }

    public boolean isPassResetAvailable() {
        return passResetAvailable;
    }

    public void reloadStatus() {
        /*
         offer pass set if
          - user has no password and
          - has oxExternalUid like passport-*
         offer pass reset if
          - user has password and
          - app config allows this
         offer 2fa when
          - user has password or
          - backend ldap detected
         */
        passResetAvailable = false;
        passSetAvailable = false;
        IdentityPerson p = ldapService.get(IdentityPerson.class, ldapService.getPersonDn(asco.getUser().getId()));

        if (p.hasPassword()) {
            passResetAvailable = confSettings.isEnablePassReset();
        } else {
            passSetAvailable = hasPassportPrefix(p.getOxExternalUid()) || hasPassportPrefix(p.getOxUnlinkedExternalUids());
        }
        password2faRequisite = p.hasPassword() || ldapService.isBackendLdapEnabled();

    }

    public boolean passwordMatch(String userName, String password) {

        boolean match = false;
        try {
            match = ldapService.authenticate(userName, password);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return match;

    }

    public boolean changePassword(String userId, String newPassword) {

        boolean success = false;
        try {
            if (Utils.isNotEmpty(newPassword)) {
                IdentityPerson person = ldapService.get(IdentityPerson.class, ldapService.getPersonDn(userId));
                person.setPassword(newPassword);
                success = ldapService.modify(person, IdentityPerson.class);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    private boolean hasPassportPrefix(String[] externalUids) {
        return Utils.listfromArray(externalUids).stream().anyMatch(uid -> uid.startsWith(EXTERNAL_IDENTITIES_PREFIX));
    }

}
