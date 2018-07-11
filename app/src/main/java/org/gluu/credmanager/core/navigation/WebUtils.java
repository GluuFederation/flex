/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core.navigation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.gluu.credmanager.misc.Utils;
import org.zkoss.zk.ui.Execution;
import org.zkoss.zk.ui.Executions;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.List;

/**
 * @author jgomer
 */
public final class WebUtils {

    private static Logger LOG = LogManager.getLogger(WebUtils.class);
    private static ObjectMapper MAPPER = new ObjectMapper();

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

    public static String getUrlContents(String url, int timeout) throws Exception{
        return getUrlContents(url, Collections.emptyList(), timeout);
    }

    /**
     * Executes a geolocation call the to ip-api.com service
     * @param ip String representing an IP address
     * @param urlPattern
     * @param timeout
     * @return A JsonNode with the respone. Null if there was an error issuing or parsing the contents
     */
    public static JsonNode getGeoLocation(String ip, String urlPattern, int timeout) {

        JsonNode node = null;
        try {
            String ipApiResponse = WebUtils.getUrlContents(MessageFormat.format(urlPattern, ip), timeout);
            LOG.debug("Response from ip-api.com was: {}", ipApiResponse);

            if (ipApiResponse != null) {
                node = MAPPER.readTree(ipApiResponse);
                if (!node.get("status").asText().equals("success")) {
                    node = null;
                }
            }
        } catch (Exception e) {
            node = null;
            LOG.info("An error occurred determining remote location: {}", e.getMessage());
            LOG.error(e.getMessage(), e);
        }
        return node;
    }

    public static void execRedirect(String url){
        execRedirect(url, true);
    }

    public static String getQueryParam(String param){
        String[] values = Executions.getCurrent().getParameterValues(param);
        return Utils.isEmpty(values) ? null :  values[0];
    }

    private static String getUrlContents(String url, List<NameValuePair> nvPairList, int timeout) throws Exception{

        String contents=null;

        DefaultHttpClient client = new DefaultHttpClient();
        HttpParams params = client.getParams();
        HttpConnectionParams.setConnectionTimeout(params, timeout);
        HttpConnectionParams.setSoTimeout(params, timeout);

        HttpGet httpGet = new HttpGet(url);
        URIBuilder uribe = new URIBuilder(httpGet.getURI());
        nvPairList.forEach(pair -> uribe.addParameter(pair.getName(), pair.getValue()));

        httpGet.setURI(uribe.build());
        httpGet.setHeader("Accept", "application/json");
        HttpResponse response = client.execute(httpGet);
        HttpEntity entity = response.getEntity();

        LOG.debug("GET request is {}", httpGet.getURI());
        if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
            contents = EntityUtils.toString(entity);
        }
        EntityUtils.consume(entity);

        return contents;

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
