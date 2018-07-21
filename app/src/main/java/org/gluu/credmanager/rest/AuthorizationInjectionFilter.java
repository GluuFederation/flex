package org.gluu.credmanager.rest;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.ext.Provider;

/**
 * A Client-side filter employed to "inject" the Authorization header to the outgoing request.
 * @author jgomer
 */
//@Provider
public class AuthorizationInjectionFilter implements ClientRequestFilter {

    public void filter(ClientRequestContext context) {

        Object authzHeader = context.getProperty("rpt");
        if (authzHeader != null) {
            context.getHeaders().putSingle("Authorization", authzHeader.toString());
        }

    }

}
