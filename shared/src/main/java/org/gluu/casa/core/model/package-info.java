/**
 * Contains classes that plugin writers can use or extend in order to abstract access to the underlying persistence
 * engine in a Gluu CE installation, for instance, LDAP or Couchbase.
 * <p>Starting with Casa 4.0 developers should use classes of this package in conjuction with {@link org.gluu.casa.service.IPersistenceService}.
 * Usage of {@link org.gluu.casa.service.ILdapService} is now discouraged since it does not support persistence backends
 * other than LDAP.</p>
 */
package org.gluu.casa.core.model;