package org.gluu.casa.core;

import org.gluu.casa.misc.WebUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author jgomer
 */
@WebServlet("/autologout")
public class LogoutServlet extends HttpServlet {

    @Override
    public void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        WebUtils.invalidateSession(req);
        resp.setHeader("Cache-Control", "no-cache, no-store");
        resp.setHeader("Pragma" ,"no-cache");
    }

}
