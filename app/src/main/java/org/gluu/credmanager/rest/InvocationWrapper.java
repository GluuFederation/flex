/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.rest;

import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.Response;

/**
 * @author jgomer
 */
//@ApplicationScoped
public class InvocationWrapper {

    @Inject
    private Logger logger;

    private String rpt;

    public Response invoke(Invocation invocation) {
        logger.debug("InvocationWrapper.invoke");
        //invocation.property("rpt", rpt);
        return invocation.invoke();
    }

    public String getRpt() {
        return rpt;
    }

    private boolean authorize(Response response) {
        return false;
    }

}
