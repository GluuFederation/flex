package org.gluu.casa.core;

import com.unboundid.ldap.sdk.*;
import com.unboundid.ldap.sdk.persist.LDAPPersistException;
import com.unboundid.ldap.sdk.persist.LDAPPersister;
import com.unboundid.ldap.sdk.persist.PersistedObjects;
import org.gluu.casa.core.ldap.gluuOrganization;
import org.gluu.casa.service.ILdapService;
import org.gluu.persist.ldap.operation.LdapOperationService;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

/**
 * @author jgomer
 */
@Named
@ApplicationScoped
public class LdapService implements ILdapService {

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;

    private LdapOperationService ldapOperationService;

    @PostConstruct
    private void init() {
        ldapOperationService = persistenceService.getOperationService();
    }

    public <T> List<T> find(Class<T> clazz, String parentDn, Filter filter) {

        List<T> results = new ArrayList<>();
        LDAPConnection conn = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            conn = ldapOperationService.getConnection();
            results = fromPersistedObjects(persister.search(conn, parentDn, SearchScope.SUB,
                    DereferencePolicy.NEVER, 0, 0, filter == null ? Filter.create("(objectClass=top)") : filter));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (conn != null) {
                ldapOperationService.getConnectionPool().releaseConnection(conn);
            }
        }
        return results;

    }

    public <T> List<T> find(T object, Class<T> clazz, String parentDn) {

        List<T> results = new ArrayList<>();
        LDAPConnection conn = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            conn = ldapOperationService.getConnection();
            results = fromPersistedObjects(persister.search(object, conn, parentDn, SearchScope.SUB));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (conn != null) {
                ldapOperationService.getConnectionPool().releaseConnection(conn);
            }
        }
        return results;

    }

    public <T> boolean add(T object, Class<T> clazz, String parentDn) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.add(object, ldapOperationService.getConnectionPool(), parentDn);
            success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
            logger.trace("add. Operation result was '{}'", ldapResult.getResultCode().getName());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public <T> T get(Class<T> clazz, String dn) {

        T object = null;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            object = persister.get(dn, ldapOperationService.getConnectionPool());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return object;

    }

    public <T> boolean modify(T object, Class<T> clazz) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.modify(object, ldapOperationService.getConnectionPool(), null, true);
            if (ldapResult == null) {
                success = true;
                logger.trace("modify. No attribute changes took place for this modification");
            } else {
                success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
                logger.trace("modify. Operation result was '{}'", ldapResult.getResultCode().getName());
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public <T> boolean delete(T object, Class<T> clazz) {

        boolean success = false;
        try {
            LDAPPersister<T> persister = LDAPPersister.getInstance(clazz);
            LDAPResult ldapResult = persister.delete(object, ldapOperationService.getConnectionPool());
            success = ldapResult.getResultCode().equals(ResultCode.SUCCESS);
            logger.trace("delete. Operation result was '{}'", ldapResult.getResultCode().getName());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public String getPersonDn(String id) {
        return persistenceService.getPersonDn(id);
    }

    public String getPeopleDn() {
        return persistenceService.getPeopleDn();
    }

    public String getGroupsDn() {
        return persistenceService.getGroupsDn();
    }

    public String getClientsDn() {
        return persistenceService.getClientsDn();
    }

    public String getScopesDn() {
        return persistenceService.getScopesDn();
    }

    public String getCustomScriptsDn() {
        return persistenceService.getCustomScriptsDn();
    }

    public String getOrganizationInum() {
        return null;
    }

    public String getIssuerUrl() {
        return persistenceService.getIssuerUrl();
    }

    public gluuOrganization getOrganization() {
        return get(gluuOrganization.class, persistenceService.getRootDn());
    }

    private <T> List<T> fromPersistedObjects(PersistedObjects<T> objects) throws LDAPPersistException {

        List<T> results = new ArrayList<>();
        for (T obj = objects.next(); obj != null; obj = objects.next()) {
            results.add(obj);
        }
        return results;

    }

}
