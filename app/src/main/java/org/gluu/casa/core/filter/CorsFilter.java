/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.filter;

import org.gluu.casa.misc.Utils;
import org.gluu.casa.rest.RSInitializer;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@WebFilter(asyncSupported = true, urlPatterns = { RSInitializer.ROOT_PATH + "/*" })
public class CorsFilter implements Filter {

    private static final int POLL_PERIOD = 60000;  //1 min
    private static final String ORIGINS_CORS_FILE = "casa-cors-domains";
    private static final String basePath = System.getProperty("server.base");

    private Set<String> allowedHosts;
    private long reloadedAt;

    @Inject
    private Logger logger;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String origin = req.getHeader("Origin");
        String method = req.getMethod();

        if (Stream.of(origin, method).noneMatch(Utils::isEmpty)) {

            try {
                if (originAllowed(origin)) {
                    HttpServletResponse res = (HttpServletResponse) response;
                    res.setHeader("Access-Control-Allow-Origin", origin);
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                    res.setHeader("Vary", "Origin");

                    if (method.equals("OPTIONS")) {
                        method = req.getHeader("Access-Control-Request-Method");
                        res.setHeader("Access-Control-Allow-Methods", method);
                        res.setHeader("Access-Control-Allow-Headers", "authorization,origin,x-requested-with,access-control-request-headers,content-type,access-control-request-method,accept");
                        res.setHeader("Access-Control-Max-Age", "86400");

                        res.setStatus(HttpServletResponse.SC_OK);
                        res.setContentLength(0);

                        logger.info("Preflight request for origin {} validated", origin);
                    } else {
                        filterChain.doFilter(request, response);
                    }
                }
            } catch (Exception e) {
                logger.warn("Bypassing CORS filter... {}", e.getMessage());
                filterChain.doFilter(request, response);
            }

        } else {
            filterChain.doFilter(request, response);
        }

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CORS filter initialized");
        allowedHosts = new HashSet<>();
    }

    @Override
    public void destroy() { }

    private boolean originAllowed(String origin) throws Exception {

        long now = System.currentTimeMillis();

        if (now - reloadedAt > POLL_PERIOD) {
            reloadedAt = now;
            try (BufferedReader bfr = Files.newBufferedReader(Paths.get(basePath, ORIGINS_CORS_FILE))) {
                logger.debug("Re-reading cors file");
                allowedHosts = bfr.lines().collect(Collectors.toSet());
            }
        }
        //Search for a match with origin
        return allowedHosts.contains(origin);

    }

}
