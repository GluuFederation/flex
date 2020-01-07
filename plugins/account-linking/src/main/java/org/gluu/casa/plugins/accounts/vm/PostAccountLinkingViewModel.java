package org.gluu.casa.plugins.accounts.vm;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.pojo.User;
import org.gluu.casa.misc.WebUtils;
import org.gluu.casa.plugins.accounts.pojo.LinkingSummary;
import org.gluu.casa.plugins.accounts.pojo.PendingLinks;
import org.gluu.casa.service.ISessionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.QueryParam;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventQueues;
import org.zkoss.zk.ui.select.annotation.WireVariable;

import javax.servlet.http.Cookie;
import java.util.Optional;

/**
 * @author jgomer
 */
public class PostAccountLinkingViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @WireVariable
    private ISessionContext sessionContext;

    private ObjectMapper mapper = new ObjectMapper();

    private String title;

    private String text;

    public String getTitle() {
        return title;
    }

    public String getText() {
        return text;
    }

    @Init
    public void init(@QueryParam("provider") String provider) {

        try {
            logger.debug("Initializing ViewModel");
            title = Labels.getLabel("general.error.general");

            String userId = Optional.ofNullable(sessionContext.getLoggedUser()).map(User::getId).orElse(null);
            LinkingSummary summary = PendingLinks.get(userId, provider);
            if (summary != null) {
                String uid = summary.getUid();

                if (uid != null) {
                    logger.warn("Notifying linking page...");
                    EventQueues.lookup(AccountLinkingViewModel.LINK_QUEUE, EventQueues.SESSION, true)
                            .publish(new Event(AccountLinkingViewModel.EVENT_NAME, null, summary));

                    title = Labels.getLabel("sociallogin.linking_result.success");
                    text = Labels.getLabel("sociallogin.linking_result.success_close");
                } else {
                    text = summary.getErrorMessage();
                }
                expirePassportCookie(provider);
            } else {
                logger.warn("No linking is pending for provider {} and user {}", provider, userId);
            }
        } catch (Exception e) {
            text = e.getMessage();
            logger.error(text, e);
        }

    }

    private void expirePassportCookie(String provider) {

        //Clean cookie set in password by a call to /casa/:provider/:token
        Cookie coo = new Cookie("casa-" + provider, "");
        coo.setPath("/");
        coo.setSecure(true);
        coo.setHttpOnly(true);
        coo.setMaxAge(0);
        WebUtils.getServletResponse().addCookie(coo);

    }

}
