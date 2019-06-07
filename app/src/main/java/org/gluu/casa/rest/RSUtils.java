package org.gluu.casa.rest;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.engines.ApacheHttpClient4Engine;

/**
 * @author jgomer
 */
public final class RSUtils {

    public static ResteasyClient getClient() {

        //provide means to revert to default connection manager... just in case
        if (System.getProperty("httpclient.DefaultClientConnManager") != null) {
            return new ResteasyClientBuilder().build();
        } else {
            HttpClient httpClient = HttpClientBuilder.create().setConnectionManager(new PoolingHttpClientConnectionManager()).build();
            ApacheHttpClient4Engine engine = new ApacheHttpClient4Engine(httpClient);
            return new ResteasyClientBuilder().httpEngine(engine).build();
        }

    }

}
