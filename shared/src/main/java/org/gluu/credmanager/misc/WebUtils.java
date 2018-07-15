/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.zk.ui.Execution;
import org.zkoss.zk.ui.Executions;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author jgomer
 */
public final class WebUtils {

    private static Logger LOG = LoggerFactory.getLogger(WebUtils.class);

    public static final String USER_PAGE_URL ="user.zul";
    public static final String ADMIN_PAGE_URL ="admin.zul";

    private WebUtils() { }

    public static HttpServletRequest getServletRequest() {
        return (HttpServletRequest) Executions.getCurrent().getNativeRequest();
    }

    public static String getRequestHeader(String headerName) {
        return getServletRequest().getHeader(headerName);
    }

    public static String getRemoteIP(){

        String ip = getRequestHeader("X-Forwarded-For");
        if (ip == null) {
            ip = getServletRequest().getRemoteAddr();
        } else {
            String[] ips = ip.split(",\\s*");
            ip = Utils.isNotEmpty(ips) ? ips[0] : null;
        }
        return ip;

    }

    public static void execRedirect(String url){
        execRedirect(url, true);
    }

    public static String getQueryParam(String param) {
        String[] values = Executions.getCurrent().getParameterValues(param);
        return Utils.isEmpty(values) ? null :  values[0];
    }

    private static void execRedirect(String url, boolean voidUI) {

        try {
            Execution exec = Executions.getCurrent();
            HttpServletResponse response = (HttpServletResponse) exec.getNativeResponse();

            LOG.debug("Redirecting to URL={}", url);
            response.sendRedirect(response.encodeRedirectURL(url));
            if (voidUI) {
                exec.setVoided(voidUI); //no need to create UI since redirect will take place
            }
        } catch (IOException e) {
            LOG.error(e.getMessage(), e);
        }

    }

}
