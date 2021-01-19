package org.gluu.casa.rest;

import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.misc.Utils;
import org.gluu.oxauth.client.service.ClientFactory;
import org.gluu.oxauth.client.service.IntrospectionService;
import org.gluu.oxauth.model.common.IntrospectionResponse;
import org.slf4j.Logger;

import java.io.IOException;
import java.lang.reflect.AnnotatedElement;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

/**
 * @author jgomer
 */
@ApplicationScoped
@Provider
@ProtectedApi
public class AuthorizationProcessingFilter implements ContainerRequestFilter {

    @Inject
    private Logger logger;

    @Context
    private HttpHeaders httpHeaders;

    @Context
    private ResourceInfo resourceInfo;

    @Inject
    private PersistenceService persistenceService;

    private IntrospectionService introspectionService;

    /**
     * This method performs the protection check of service invocations: it provokes returning an early error response if
     * the underlying protection logic does not succeed, otherwise, makes the request flow to its destination service object
     * @param requestContext The ContainerRequestContext associated to filter execution
     * @throws IOException In practice no exception is thrown here. It's present to conform to interface implemented.
     */
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        Response.ResponseBuilder failureResponse = null;
        logger.trace("REST call to '{}' intercepted", RSInitializer.ROOT_PATH + requestContext.getUriInfo().getPath());

        if (introspectionService == null) {
            logger.warn("An error occurred when AuthorizationProcessingFilter was inited, returning 500");
            failureResponse = Response.status(Status.INTERNAL_SERVER_ERROR);
        } else {
            String token = httpHeaders.getHeaderString("Authorization");

            if (Utils.isEmpty(token)) {
                logger.warn("No Authorization header found in this request, denying access");
                failureResponse = Response.status(Status.FORBIDDEN).entity("Authorization header absent");
            } else {
                token = token.replaceFirst("Bearer\\s+", "");
                logger.debug("Validating token {}", token);
                
                IntrospectionResponse response = null;
                try {
                	response = introspectionService.introspectToken("Bearer " + token, token);
                } catch (Exception e) {
                	logger.error(e.getMessage());
                }
                List<String> tokenScopes = Optional.ofNullable(response).map(IntrospectionResponse::getScope).orElse(null);

                if (tokenScopes == null || !response.isActive() || !tokenScopes.containsAll(computeExpectedScopes(resourceInfo))) {
                	String msg = "Invalid token or insufficient scopes";
                    logger.error("{}. Token scopes: {}", msg, tokenScopes);
                    failureResponse = Response.status(Status.UNAUTHORIZED).entity(msg);
                }
            }
        }
        if (failureResponse == null) {
            logger.info("Authorization passed");   //If authorization passed, proceed with actual processing of request
        } else {
            requestContext.abortWith(failureResponse.build());
        }

    }

    private Set<String> computeExpectedScopes(ResourceInfo resourceInfo) {
    	
    	//Scopes at the method level override those at class level
    	List<String> scopes = annotationScopes(resourceInfo.getResourceMethod());
    	if (scopes.size() == 0) {
    		scopes = annotationScopes(resourceInfo.getResourceClass());
    	}
    	return new HashSet(scopes);
    	
    }

	private List<String> annotationScopes(AnnotatedElement elem) {		
		return Optional.ofNullable(elem.getAnnotation(ProtectedApi.class)).map(ProtectedApi::scopes)
		    .map(Arrays::asList).orElse(Collections.emptyList());
	}

    @PostConstruct
    private void init() {

        try {
            introspectionService = ClientFactory.instance().createIntrospectionService(persistenceService.getIntrospectionEndpoint());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
