package org.gluu.casa.core.init;

import org.gluu.casa.core.ConfigurationHandler;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

import static org.gluu.casa.misc.AppStateEnum.FAIL;

@WebServlet(urlPatterns = "/health-check")
public class HealthServlet extends HttpServlet {

    @Inject
    private ConfigurationHandler cfgHandler;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if (Optional.ofNullable(cfgHandler.getAppState()).map(state -> state.equals(FAIL)).orElse(false)) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } else {
            response.getWriter().print("OK");
            response.setContentType("text/plain");
            response.setDateHeader("Expires", System.currentTimeMillis() + 10000);
        }

    }

}
