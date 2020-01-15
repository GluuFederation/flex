package org.gluu.casa.core;

import org.gluu.casa.core.model.Person;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.gluu.search.filter.Filter;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.management.AttributeNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * An app. scoped bean that encapsulates logic related to users manipulation (CRUD) at memory level (no LDAP storage)
 * @author jgomer
 */
@Named
@ApplicationScoped
public class UserService {

    private static final String PREFERRED_METHOD_ATTR = "oxPreferredMethod";
    private static final String ADMIN_LOCK_FILE = ".administrable";
    private static final String BASE_PATH = System.getProperty("server.base");

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;
    
    @Inject
    private ExtensionsManager extManager;

    @Inject
    private ConfigurationHandler confHandler;

    public User getUserFromClaims(Map<String, Object> claims) throws AttributeNotFoundException {

        User u = new User();
        u.setClaims(claims);

        String username = u.getUserName();
        String inum = u.getId();
        logger.trace("User instance created. Username is {}", username);

        if (inum == null || username == null) {
            logger.error("Could not obtain minimal user claims!");
            throw new AttributeNotFoundException("Cannot retrieve claims for logged user");
        }

        String img = u.getPictureURL();
        if (Utils.isNotEmpty(img)) {
            u.setPictureURL(WebUtils.validateImageUrl(img));
        }

        Person person = personInstance(inum);
        if (person == null) {
            throw new AttributeNotFoundException("Cannot retrieve user's info from database");
        }

        u.setPreferredMethod(person.getPreferredMethod());
        u.setAdmin(persistenceService.isAdmin(inum) && administrationAllowed());
        
        cleanRandEnrollmentCode(inum);

        return u;

    }

    public List<AuthnMethod> getLiveAuthnMethods() {
        return getLiveAuthnMethods(true);
    }

    public List<AuthnMethod> get2FARequisiteMethods() {
        return getLiveAuthnMethods(false).stream().filter(AuthnMethod::mayBe2faActivationRequisite).collect(Collectors.toList());
    }

    public List<Pair<AuthnMethod, Integer>> getUserMethodsCount(String userId) {
        return getLiveAuthnMethods(false).stream()
                .map(aMethod -> new Pair<>(aMethod, aMethod.getTotalUserCreds(userId)))
                .filter(pair -> pair.getY() > 0).collect(Collectors.toList());
    }

    public boolean setPreferredMethod(User user, String method) {

        boolean success = setPreferredMethod(user.getId(), method);
        if (success) {
            user.setPreferredMethod(method);
        }
        return success;

    }

    /**
     * Resets the preferred method of authentication for the users referenced by LDAP dn
     * @param userInums A List containing user DNs
     * @return The number of modified entries in LDAP
     */
    public int resetPreference(List<String> userInums) {

        int modified = 0;
        try {
            for (String inum : userInums) {
                if (setPreferredMethod(inum, null)) {
                    modified++;
                    logger.info("Turned 2FA off for user '{}'", inum);
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return modified;

    }

    /**
     * Builds a list of users whose username, first or last name matches the pattern passed, and at the same time have a
     * preferred authentication method other than password
     * @param searchString Pattern for search
     * @return A collection of SimpleUser instances. Null if an error occurred to compute the list
     */
    public List<Person> searchUsers(String searchString) {

        Stream<Filter> stream = Stream.of("uid", "givenName", "sn")
                .map(attr -> Filter.createSubstringFilter(attr, null, new String[]{ searchString }, null));

        Filter filter = Filter.createANDFilter(
                Filter.createORFilter(stream.collect(Collectors.toList())),
                Filter.createPresenceFilter(PREFERRED_METHOD_ATTR)
        );
        return persistenceService.find(Person.class, persistenceService.getPeopleDn(), filter);

    }

    private boolean setPreferredMethod(String id, String method) {

        boolean success = false;
        try {
            Person person = personInstance(id);
            person.setPreferredMethod(method);
            success = persistenceService.modify(person);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public String generateRandEnrollmentCode(String userId) {

        logger.debug("Writing random enrollment code for {}", userId);
        String code = UUID.randomUUID().toString();
        Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));
        person.setEnrollmentCode(code);
        return persistenceService.modify(person) ? code : null;

    }

    public void cleanRandEnrollmentCode(String userId) {
        Person person = persistenceService.get(Person.class, persistenceService.getPersonDn(userId));

        if (Utils.isNotEmpty(person.getEnrollmentCode())) {
            logger.trace("Removing enrollment code for {}", userId);
            person.setEnrollmentCode(null);
            persistenceService.modify(person);
        }
    }

    private List<AuthnMethod> getLiveAuthnMethods(boolean sorted) {

        List<AuthnMethod> methods = new ArrayList<>();
        Map<String, String> acrPluginMap = confHandler.getSettings().getAcrPluginMap();

        for (String acr : acrPluginMap.keySet()) {
            extManager.getAuthnMethodExts(Collections.singleton(acrPluginMap.get(acr)))
                    .stream().filter(am -> am.getAcr().equals(acr)).findFirst().ifPresent(methods::add);
        }

        if (sorted) {
            //An important invariant is that mappedAcrs set is fully contained in authnMethodLevels.keySet()
            Map<String, Integer> authnMethodLevels = confHandler.getAcrLevelMapping();
            methods = methods.stream().sorted(Comparator.comparing(aMethod -> -authnMethodLevels.get(aMethod.getAcr())))
                    .collect(Collectors.toList());
        }
        return methods;

    }

    private Person personInstance(String id) {
        return persistenceService.get(Person.class, persistenceService.getPersonDn(id));
    }

    /**
     * Administration functionalities are enabled only if .administrable file exists 
     * @return boolean value
     */
    private boolean administrationAllowed() {
        return Files.isReadable(Paths.get(BASE_PATH, ADMIN_LOCK_FILE));
        
    }

}
