
package org.gluu.casa.rest;

import java.io.File;
import java.security.PrivateKey;
import java.time.Month;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.json.JSONObject;

/**
 * @author madhumita
 */
@ApplicationScoped
@Path("/billing/")
public class CasaBillingRS {

	private static final String statsDirectoryPath = "/opt/gluu/jetty/casa/stats/";
	private Logger logger = LoggerFactory.getLogger(getClass());

	@GET
	@Path("usage/{month}/{year}")
	@Produces({ MediaType.APPLICATION_OCTET_STREAM, MediaType.TEXT_PLAIN })
	public Response getUsage(@PathParam("month") String month, @PathParam("year") String year) {
		logger.trace("get usage API called");
		try {
			File file = new File(statsDirectoryPath + Month.of(Integer.parseInt(month)).name().toUpperCase() + year);

			if (file.exists()) {

				ResponseBuilder response = Response.ok((Object) file);
				response.header("Content-Disposition", "attachment;filename=" + file.getName());
				return response.build();
			} else {
				logger.trace("File does not exist (mm-yyyy):" + month + "-" + year);
				// 404 for resource not found
				return Response.status(Response.Status.NOT_FOUND)
						.entity("File not found - (mm-yyyy)" + month + "-" + year).build();
			}
		} catch (Exception e) {
			logger.trace("bad request (mm-yyyy):" + month + "/" + year);
			return Response.status(Response.Status.BAD_REQUEST).entity("bad request - (mm/yyyy)" + month + "-" + year)
					.build();
		}

	}

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsageList() {
		logger.trace("list API called");
		File folder = new File(statsDirectoryPath);
		String[] files = folder.list();
		JSONObject o = new JSONObject();
		o.put("files", files);
		return Response.status(Response.Status.OK).entity(o).build();
	}
}
