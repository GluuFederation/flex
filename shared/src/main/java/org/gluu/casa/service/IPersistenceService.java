package org.gluu.casa.service;

import org.gluu.casa.core.model.GluuOrganization;
import org.gluu.search.filter.Filter;

import java.util.List;
import java.util.Map;

/**
 * Provides CRUD access to the underlying persistence engine of you Gluu Server installation. Starting with Casa 4.0 this
 * interface is the mechanism of choice for interacting with data.
 * <p>This interface resembles {@link ILdapService} so developers with previous acquaintance can start coding quickly,
 * however classes/instances passed to these methods are supposed to use the <code>oxCore</code> annotations found in package
 * <code>org.gluu.site.ldap.persistence.annotation</code> in lieu of <code>com.unboundid.ldap.sdk.persist</code>
 * annotations of UnboundID LDAP SDK.</p>
 * @author jgomer
 */
public interface IPersistenceService extends LocalDirectoryInfo {

    /**
     * Builds a {@link List} of objects of type <code>T</code> from a search (with scope of SUB) using <code>baseDn</code>
     * as search base; this type of search accounts for the entry referenced at <code>baseDn</code> and any subordinate
     * entries to any depth. The search can use an instance of <code>org.gluu.search.filter.Filter</code> to include an
     * LDAP-like filter expression.
     * <p>Note this search is performed in the context of <code>oxcore-persist</code>. In this sense, the Class
     * referenced as parameter has to be annotated with <code>org.gluu.site.ldap.persistence.annotation.LdapEntry</code>
     * and potentially other annotations of the same package to be functional.</p>
     * @param clazz A class to which the search objects must belong to
     * @param baseDn Search base DN
     * @param filter Filter to constrain the search (supply null to returned ALL entries under the base DN that can be
     *               associated to Class clazz)
     * @param <T> Type parameter of clazz
     * @return A List of matching objects. Empty if no matches
     */
    <T> List<T> find(Class<T> clazz, String baseDn, Filter filter);

    /**
     * Builds a {@link List} of objects of type <code>T</code> from a search (with scope of SUB) using as search base
     * the field annotated with <code>org.gluu.site.ldap.persistence.annotation.LdapDN</code> in the object passed as parameter;
     * this type of search accounts for the entry referenced at the search base and any subordinate
     * entries to any depth. The object passed as parameter is used to internally build a filter to perform the search.
     * <p>Note this search is performed in the context of  <code>oxcore-persist</code>. In this sense, the class to which
     * the object passed belongs to has to be annotated with <code>org.gluu.site.ldap.persistence.annotation.LdapEntry</code>
     * and potentially other annotations of the same package to be functional.</p>
     * @param object An object employed to build a filter
     * @param <T> Type parameter of clazz
     * @return A List of matching objects. Empty if no matches
     */
    <T> List<T> find(T object);

    /**
     * Similar to {@link #find(Object)} search except it only returns the amount of matching objects.
     * @param object Object describing the search
     * @param <T> Type parameter of the class to which the object belongs to
     * @return An int with the number of matching objects, -1 if there was an error performing the operation
     */
    <T> int count(T object);

    /**
     * Adds an entry in the underlying persistence engine.
     * @param object Represents the entry to be added. Its class should be annotated with
     *               <code>org.gluu.site.ldap.persistence.annotation.LdapEntry</code>
     * @param <T> Type parameter of clazz
     * @return A boolean value indicating the success (true) or failure (false) of the operation
     */
    <T> boolean add(T object);

    /**
     * Retrieves the object representing the entry at the provided DN location.
     * @param clazz The class the object to return is an instance of
     * @param dn Path (DN) of the entry
     * @param <T> Type parameter of clazz
     * @return An object of type T (null if an error was found performing the operation or if the entry does not exist)
     */
    <T> T get(Class<T> clazz, String dn);

    /**
     * Stores a previously obtained object (via get or find) - and potentially modified - into the persistence engine.
     * @param object An object whose attributes are potentially altered (eg. via setters) with respect to the original
     *              retrieved via get or find methods
     * @param <T> Type parameter of the class to which the object belongs to
     * @return A boolean value indicating the success (true) or failure (false) of the operation.
     */
    <T> boolean modify(T object);

    /**
     * Deletes the entry represented by parameter <code>object</code> from the persistence engine.
     * @param object A representation of the object to delete. It must have been previously retrieved via get or find methods
     * @param <T> Type parameter of the class to which the object belongs to
     * @return A boolean value indicating the success (true) or failure (false) of the operation
     */
    <T> boolean delete(T object);

    /**
     * Returns an instance of {@link GluuOrganization} that represents the organization entry of your local Gluu Server.
     * This is the <i>o</i> entry that contains most of Gluu Server directory branches like <i>people, groups, clients, etc.</i>.
     * @return A {@link GluuOrganization} object
     */
    GluuOrganization getOrganization();

    /**
     * Returns a map with name/value pairs of the configuration properties belonging to a Gluu Server interception script
     * identified by an <code>acr</code> value.
     * @param acr ACR (display Name) value that identities the custom script
     * @return A map. Null if no script is found associated with the acr passed
     */
    Map<String, String> getCustScriptConfigProperties(String acr);

}
