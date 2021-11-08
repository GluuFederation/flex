package org.gluu.casa.plugins.accounts.service.enrollment;

import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.casa.plugins.accounts.pojo.Provider;

import java.util.*;

/**
 * @author jgomer
 */
public class SamlEnrollmentManager extends AbstractEnrollmentManager {

    private static final String OXEXTERNALUID_PREFIX = "passport-saml:";

    public SamlEnrollmentManager(Provider provider) {
        super(provider);
    }

    public String getUid(IdentityPerson p, boolean linked) {

        List<String> list = linked ? p.getJansExtUid() : p.getJansUnlinkedExternalUids();
        for (String externalUid : list) {
            if (externalUid.startsWith(OXEXTERNALUID_PREFIX)) {

                int i = externalUid.lastIndexOf(":");
                if (i > OXEXTERNALUID_PREFIX.length() && i < externalUid.length() - 1) {
                    String providerId = externalUid.substring(OXEXTERNALUID_PREFIX.length(), i);
                    if (provider.getId().equals(providerId)) {
                        return externalUid.substring(i+1);
                    }
                }
            }
        }
        return null;

    }

    public boolean link(IdentityPerson p, String externalId) {

        List<String> list = new ArrayList<>(p.getJansExtUid());
        list.add(getFormattedAttributeVal(externalId));

        logger.info("Linked accounts for {} will be {}", p.getUid(), list);
        p.setJansExtUid(list);
        return updatePerson(p);

    }

    public boolean remove(IdentityPerson p) {
        removeProvider(p);
        return updatePerson(p);
    }

    public boolean unlink(IdentityPerson p) {

        String uid = removeProvider(p);
        if (uid == null) {
            return false;
        }

        List<String> list = new ArrayList<>(p.getJansUnlinkedExternalUids());
        list.add(getFormattedAttributeVal(uid));
        p.setJansUnlinkedExternalUids(list);
        return updatePerson(p);

    }

    public boolean enable(IdentityPerson p) {

        String uid = removeProvider(p);
        if (uid == null) {
            return false;
        }

        List<String> list = new ArrayList<>(p.getJansExtUid());
        list.add(getFormattedAttributeVal(uid));
        p.setJansExtUid(list);
        return updatePerson(p);

    }

    public boolean isAssigned(String uid) {
        IdentityPerson p = new IdentityPerson();
        p.setJansExtUid(Collections.singletonList(getFormattedAttributeVal(uid)));
        p.setBaseDn(persistenceService.getPeopleDn());
        return persistenceService.count(p) > 0;
    }

    private String removeProvider(IdentityPerson p) {

        String pattern = String.format("%s%s:",OXEXTERNALUID_PREFIX, provider.getId());

        Set<String> externalUids = new HashSet<>(p.getJansExtUid());
        Set<String> unlinkedUids = new HashSet<>(p.getJansUnlinkedExternalUids());

        String externalUid = externalUids.stream().filter(str -> str.startsWith(pattern)).findFirst()
                .map(str -> str.substring(pattern.length())).orElse("");
        if (externalUid.length() == 0) {
            externalUid = unlinkedUids.stream().filter(str -> str.startsWith(pattern)).findFirst()
                    .map(str -> str.substring(pattern.length())).orElse("");
        }

        if (externalUid.length() > 0) {
            String str = getFormattedAttributeVal(externalUid);
            externalUids.remove(str);
            unlinkedUids.remove(str);
        } else {
            externalUid = null;
        }

        p.setJansExtUid(new ArrayList<>(externalUids));
        p.setJansUnlinkedExternalUids(new ArrayList<>(unlinkedUids));
        return externalUid;

    }

    private String getFormattedAttributeVal(String uid) {
        return String.format("passport-saml:%s:%s", provider.getId(), uid);
    }

}
