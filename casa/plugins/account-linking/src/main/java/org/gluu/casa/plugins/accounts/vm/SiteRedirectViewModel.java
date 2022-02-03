package org.gluu.casa.plugins.accounts.vm;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.gluu.casa.service.IPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.QueryParam;
import org.zkoss.util.resource.Labels;

import java.net.URL;

/**
 * @author jgomer
 */
public class SiteRedirectViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private IPersistenceService persistenceService;

    private ObjectMapper mapper = new ObjectMapper();

    private String serverUrl;

    private String text;

    public String getText() {
        return text;
    }

    @Init
    public void init(@QueryParam("provider") String provider) {

        logger.debug("Initializing ViewModel");
        persistenceService = Utils.managedBean(IPersistenceService.class);
        text = Labels.getLabel("sociallogin.link_redirect_failed", new String[]{provider});

        //One might check in pendingLinks if the userId/provider pair exists, but it may not be set yet when this code runs
        if (Utils.isNotEmpty(provider) ) {
            serverUrl = persistenceService.getIssuerUrl();
            String url = getRedirectUrl(provider);

            if (url != null) {
                WebUtils.execRedirect(url, false);
            }
        }

    }

    private String getRedirectUrl(String provider) {
        logger.info("Building a passport redirect URL to start with linking process");
        String token = getPassportToken();
        return Utils.isEmpty(token) ? null : String.format("%s/passport/casa/%s/%s", serverUrl, provider, token);
    }

    private String getPassportToken() {

        try {
            String url = String.format("%s/passport/token", serverUrl);
            logger.info("Requesting token at {}", url);
            return mapper.readTree(new URL(url)).get("token_").asText();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

    }

}
