/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.service;

import com.unboundid.ldap.sdk.Filter;
import org.gluu.credmanager.core.ldap.gluuOrganization;

import java.util.List;
import java.util.Map;

/**
 * @author jgomer
 */
public interface ILdapService {

    <T> List<T> find(Class<T> clazz, String parentDn, Filter filter);
    <T> List<T> find(T object, Class<T> clazz, String parentDn);
    <T> boolean add(T object, Class<T> clazz, String parentDn);
    <T> T get(Class<T> clazz, String dn);
    <T> boolean modify(T object, Class<T> clazz);
    <T> boolean delete(T object, Class<T> clazz);
    String getPersonDn(String id);
    String getPeopleDn();
    String getGroupsDn();
    String getScopesDn();
    String getClientsDn();
    String getCustomScriptsDn();
    String getOrganizationInum();
    gluuOrganization getOrganization();
    Map<String, String> getCustScriptConfigProperties(String displayName);

}
