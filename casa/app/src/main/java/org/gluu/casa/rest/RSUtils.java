package org.gluu.casa.rest;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;

import javax.ws.rs.client.ClientBuilder;

public final class RSUtils {

    public static ResteasyClient getClient() {
        return (ResteasyClient) ClientBuilder.newClient();
    }

}
