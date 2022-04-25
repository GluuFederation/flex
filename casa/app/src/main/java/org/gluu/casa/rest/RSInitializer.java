package org.gluu.casa.rest;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import static org.gluu.casa.rest.RSInitializer.ROOT_PATH;

/**
 * @author jgomer
 */
@ApplicationPath(ROOT_PATH)
public class RSInitializer extends Application {
    public static final String ROOT_PATH = "/rest";
}
