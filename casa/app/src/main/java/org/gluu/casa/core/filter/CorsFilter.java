package org.gluu.casa.core.filter;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.rest.RSInitializer;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Stream;

/**
 * @author jgomer
 */
@WebFilter(urlPatterns = { RSInitializer.ROOT_PATH + "/*" })
public class CorsFilter implements Filter {

    @Inject
    private Logger logger;

    @Inject
    private MainSettings settings;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CORS filter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        boolean invokeNext = true;
        HttpServletRequest req = (HttpServletRequest) request;
        String origin = req.getHeader("Origin");
        String method = req.getMethod();

        if (Stream.of(origin, method).allMatch(Utils::isNotEmpty)) {

            try {
                if (settings.getCorsDomains().contains(origin.toLowerCase())) {
                    HttpServletResponse res = (HttpServletResponse) response;
                    res.setHeader("Access-Control-Allow-Origin", origin);
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                    res.setHeader("Vary", "Origin");

                    if (method.equals("OPTIONS")) {
                        method = req.getHeader("Access-Control-Request-Method");
                        res.setHeader("Access-Control-Allow-Methods", method);
                        res.setHeader("Access-Control-Allow-Headers", "authorization,origin,x-requested-with," +
                                "access-control-request-headers,content-type,access-control-request-method,accept");
                        res.setHeader("Access-Control-Max-Age", "86400");

                        res.setStatus(HttpServletResponse.SC_OK);
                        res.setContentLength(0);

                        logger.info("Preflight request for origin {} validated", origin);
                        invokeNext = false;
                    }
                }
            } catch (Exception e) {
                logger.warn("Bypassing CORS filter... {}", e.getMessage());
            }
        }

        if (invokeNext){
            filterChain.doFilter(request, response);
        }

    }

    @Override
    public void destroy() { }

}
