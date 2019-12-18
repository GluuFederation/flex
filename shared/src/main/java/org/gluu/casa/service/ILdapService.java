package org.gluu.casa.service;

import com.unboundid.ldap.sdk.Filter;
import org.gluu.casa.core.ldap.gluuOrganization;

import java.util.List;

/**
 * Provides CRUD access to the underlying LDAP of you Gluu Server installation.
 * @author jgomer
 */
@Deprecated
public interface ILdapService extends LocalDirectoryInfo {

    /**
     * Builds a {@link List} of objects of type <code>T</code> from an LDAP search (with scope of SUB) using <code>baseDn</code>
     * as search base; this type of search accounts for the entry referenced at <code>baseDn</code> and any subordinate
     * entries to any depth. The search can use an instance of {@link com.unboundid.ldap.sdk.Filter} to include an LDAP
     * filter expression.
     * <p>Note this search is performed in the context of the UnboundID LDAP SDK <a href="https://docs.ldap.com/ldap-sdk/docs/persist/index.html">
     * persistence framework</a>. In this sense, the Class referenced as parameter has to be annotated with
     * <code>com.unboundid.ldap.sdk.persist.LDAPObject</code> and potentially other annotations of the same package to be functional.</p>
     * @param clazz A class to which the search objects must belong to
     * @param baseDn Search base DN
     * @param filter Filter to constrain the search (supply null to returned ALL entries under the base DN that can be
     *               associated to Class clazz)
     * @param <T> Type parameter of clazz
     * @return A List of matching objects
     */
    <T> List<T> find(Class<T> clazz, String baseDn, Filter filter);

    /**
     * Builds a {@link List} of objects of type <code>T</code> from an LDAP search (with scope of SUB) using <code>baseDn</code>
     * as search base; this type of search accounts for the entry referenced at <code>baseDn</code> and any subordinate
     * entries to any depth. The object passed as parameter is used to internally build an LDAP filter to perform the search.
     * <p>Note this search is performed in the context of the UnboundID LDAP SDK <a href="https://docs.ldap.com/ldap-sdk/docs/persist/index.html">
     * persistence framework</a>. In this sense, the Class referenced as parameter has to be annotated with
     * <code>com.unboundid.ldap.sdk.persist.LDAPObject</code> and potentially other annotations of the same package to be functional.</p>
     * @param object An object employed to build a filter according to persistence framework rules
     * @param clazz A class to which the search objects must belong to
     * @param baseDn Search base DN
     * @param <T> Type parameter of clazz
     * @return A List of matching objects
     */
    <T> List<T> find(T object, Class<T> clazz, String baseDn);

    /**
     * Adds an entry to LDAP.
     * @param object Represents the entry to be added
     * @param clazz The class of the object (annotated with <code>com.unboundid.ldap.sdk.persist.LDAPObject</code> and
     *              potentially other annotations of the same package)
     * @param parentDn The parent DN of the resulting entry. See parentDN parameter of method
     * {@link com.unboundid.ldap.sdk.persist.LDAPPersister#add(Object, com.unboundid.ldap.sdk.LDAPInterface, String,
     * com.unboundid.ldap.sdk.Control...)}
     * @param <T> Type parameter of clazz
     * @return A boolean value indicating the success (true) or failure (false) of the operation
     */
    <T> boolean add(T object, Class<T> clazz, String parentDn);

    /**
     * Retrieves the object representing the LDAP entry with the provided DN.
     * @param clazz The class the object to return is an instance of
     * @param dn DN of the entry
     * @param <T> Type parameter of clazz
     * @return An object of type T (null if an error was found performing the operation or if the entry does not exist)
     */
    <T> T get(Class<T> clazz, String dn);

    /**
     * Stores a previously obtained object (via get or find) - and potentially modified - to LDAP directory
     * @param object An object whose attributes are potentially altered (eg. via setters) with respect to the original
     *              retrieved via get or find methods
     * @param clazz The class of the object (annotated with <code>com.unboundid.ldap.sdk.persist.LDAPObject</code> and
     *              potentially other annotations of the same package)
     * @param <T> Type parameter of clazz
     * @return A boolean value indicating the success (true) or failure (false) of the operation. Success also accounts
     * for cases in which no modifications were detected in the object and thus, no persistence took place.
     */
    <T> boolean modify(T object, Class<T> clazz);

    /**
     * Deletes the entry represented by parameter <code>object</code> from LDAP.
     * @param object A representation of the object to delete. It must have been previously retrieved via get or find methods
     * @param clazz The class of the object (annotated with <code>com.unboundid.ldap.sdk.persist.LDAPObject</code> and
     *              potentially other annotations of the same package)
     * @param <T> Type parameter of clazz
     * @return A boolean value indicating the success (true) or failure (false) of the operation
     */
    <T> boolean delete(T object, Class<T> clazz);

    /**
     * This method must return <code>null</code>. It's kept for compatibility purposes. Originally this method
     * returned the ID (<code>inum</code> attribute value) of the <i>o</i> entry that contained most of Gluu Server
     * LDAP branches like <i>people, groups, clients, etc.</i>.
     * <p>Starting with 4.0 the structure was flattened so all these branches are directly under <code>o=gluu</code></p>.
     * @return Always null
     */
    @Deprecated
    String getOrganizationInum();

    /**
     * Returns an instance of {@link gluuOrganization} that represents the organization entry of your local Gluu Server LDAP.
     * This is the <i>o</i> entry that contains most of Gluu Server LDAP branches like <i>people, groups, clients, etc.</i>.
     * @return A {@link gluuOrganization} object
     */
    gluuOrganization getOrganization();

}
