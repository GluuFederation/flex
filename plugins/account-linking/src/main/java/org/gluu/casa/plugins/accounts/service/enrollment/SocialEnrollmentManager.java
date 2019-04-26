package org.gluu.casa.plugins.accounts.service.enrollment;

import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.casa.plugins.accounts.pojo.Provider;
import org.zkoss.util.Pair;

import java.util.*;

/**
 * @author jgomer
 */
public class SocialEnrollmentManager extends AbstractEnrollmentManager {

    private static final String OXEXTERNALUID_PREFIX = "passport-";

    public SocialEnrollmentManager(Provider provider) {
        super(provider);
    }

    public String getUid(IdentityPerson p, boolean linked) {

        List<String> list = linked ? p.getOxExternalUid() : p.getOxUnlinkedExternalUids();
        for (String externalUid : list) {
            if (externalUid.startsWith(OXEXTERNALUID_PREFIX)) {
                int i = externalUid.indexOf(":");

                if (i > OXEXTERNALUID_PREFIX.length()) {
                    String prv = externalUid.substring(OXEXTERNALUID_PREFIX.length(), i);

                    if (prv.equals(provider.getDisplayName())) {
                        return externalUid.substring(i+1);
                    }
                }
            }
        }
        return null;

    }

    public boolean link(IdentityPerson p, String externalId) {
        Set<String> set = new HashSet<>(p.getOxExternalUid());
        set.add(getFormatedAttributeVal(externalId));
        logger.info("Linked accounts for {} will be {}", p.getUid(), set);

        p.setOxExternalUid(new ArrayList<>(set));
        return updatePerson(p);
    }

    public boolean remove(IdentityPerson p) {
        logger.info("Removing provider {} for {}", provider.getDisplayName(), p.getUid());
        List<String> linked = removeProvider(provider, p.getOxExternalUid()).getY();
        List<String> unlinked = removeProvider(provider, p.getOxUnlinkedExternalUids()).getY();
        return updateExternalIdentities(p, linked, unlinked);
    }

    public boolean unlink(IdentityPerson p) {

        boolean success = false;
        Pair<String, List<String>> tmp = removeProvider(provider, p.getOxExternalUid());
        List<String> linked = tmp.getY();
        String oxExternalUid = tmp.getX();

        if (oxExternalUid != null) {
            List<String> unlinked = new ArrayList<>(p.getOxUnlinkedExternalUids());
            unlinked.add(oxExternalUid);

            logger.info("Linked accounts for {} will be {}", p.getUid(), linked);
            logger.info("Unlinked accounts for {} will be {}", p.getUid(), unlinked);
            success = updateExternalIdentities(p, linked, unlinked);
        }

        return success;

    }

    public boolean enable(IdentityPerson p) {

        boolean success = false;
        Pair<String, List<String>> tmp = removeProvider(provider, p.getOxUnlinkedExternalUids());
        List<String> unlinked = tmp.getY();
        String oxExternalUid = tmp.getX();

        if (oxExternalUid != null) {
            List<String> linked = new ArrayList<>(p.getOxExternalUid());
            linked.add(oxExternalUid);

            logger.info("Linked accounts for {} will be {}", p.getUid(), linked);
            logger.info("Unlinked accounts for {} will be {}", p.getUid(), unlinked);
            success = updateExternalIdentities(p, linked, unlinked);
        }

        return success;

    }

    private static Pair<String, List<String>> removeProvider(Provider provider, List<String> externalUids) {

        List<String> list = new ArrayList<>();
        String oxExternalUid = null;

        for (String externalUid : externalUids) {
            if (externalUid.startsWith(OXEXTERNALUID_PREFIX)) {
                int i = externalUid.indexOf(":");

                if (i > OXEXTERNALUID_PREFIX.length()) {
                    String prv = externalUid.substring(OXEXTERNALUID_PREFIX.length(), i);

                    if (prv.equals(provider.getDisplayName())) {
                        oxExternalUid = externalUid;
                    } else {
                        list.add(externalUid);
                    }
                }
            } else {
                list.add(externalUid);
            }
        }
        return new Pair<>(oxExternalUid, list);

    }

    private boolean updateExternalIdentities(IdentityPerson p, List<String> linked, List<String> unlinked) {
        p.setOxExternalUid(linked);
        p.setOxUnlinkedExternalUids(unlinked);
        return updatePerson(p);
    }

    public boolean isAssigned(String uid) {
        IdentityPerson p = new IdentityPerson();
        p.setOxExternalUid(Collections.singletonList(getFormatedAttributeVal(uid)));
        p.setBaseDn(persistenceService.getPeopleDn());
        return persistenceService.count(p) > 0;
    }

    private String getFormatedAttributeVal(String uid) {
        return String.format("passport-%s:%s", provider.getDisplayName(), uid);
    }

}
