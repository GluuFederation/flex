/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.LdapService;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.xdi.oxauth.client.ClientInfoClient;
import org.xdi.oxauth.client.ClientInfoResponse;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.net.URL;

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

    @Inject
    private LdapService ldapService;

    private String clientInfoEndpoint;

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

        if (Utils.isEmpty(clientInfoEndpoint)) {
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

                ClientInfoClient clientInfoClient = new ClientInfoClient(clientInfoEndpoint);
                ClientInfoResponse clientInfoResponse = clientInfoClient.execClientInfo(token);
                if (clientInfoResponse.getErrorType() != null) {
                    failureResponse = Response.status(Status.UNAUTHORIZED).entity("Invalid token");
                }
            }
        }
        if (failureResponse == null) {
            logger.info("Authorization passed");   //If authorization passed, proceed with actual processing of request
        } else {
            requestContext.abortWith(failureResponse.build());
        }

    }

    @PostConstruct
    private void init() {

        try {
            ObjectMapper mapper = new ObjectMapper();
            clientInfoEndpoint = mapper.readTree(new URL(ldapService.getOIDCEndpoint())).get("clientinfo_endpoint").asText();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
