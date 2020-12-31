package org.gluu.casa.plugins.accounts.vm;

import org.gluu.casa.plugins.accounts.pojo.ExternalAccount;
import org.gluu.casa.plugins.accounts.pojo.LinkingSummary;
import org.gluu.casa.plugins.accounts.pojo.PendingLinks;
import org.gluu.casa.plugins.accounts.pojo.Provider;
import org.gluu.casa.plugins.accounts.service.AvailableProviders;
import org.gluu.casa.plugins.accounts.service.AccountLinkingService;
import org.gluu.casa.service.ISessionContext;
import org.gluu.casa.ui.UIUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.BindUtils;
import org.zkoss.bind.annotation.*;
import org.zkoss.util.Pair;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventQueues;
import org.zkoss.zk.ui.select.Selectors;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zul.Messagebox;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author jgomer
 */
public class AccountLinkingViewModel {

    public static final String LINK_QUEUE ="social_queue";

    public static final String EVENT_NAME = "linked";

    private Logger logger = LoggerFactory.getLogger(getClass());

    private Map<Provider, Pair<Boolean, String>> accounts;

    private List<Provider> providers;

    private AccountLinkingService slService;

    @WireVariable
    private ISessionContext sessionContext;

    private int linkedTotal;

    private String userId;

    public List<Provider> getProviders() {
        return providers;
    }

    public Map<Provider, Pair<Boolean, String>> getAccounts() {
        return accounts;
    }

    @Init
    public void init() {
        logger.debug("Initializing ViewModel");

        userId = sessionContext.getLoggedUser().getId();
        slService = new AccountLinkingService();
        providers = AvailableProviders.get(true);
        parseLinkedAccounts();

        if (providers.size() > 0) {

            EventQueues.lookup(LINK_QUEUE, EventQueues.SESSION, true)
                    .subscribe(event -> {
                        if (event.getName().equals(EVENT_NAME)) {

                            logger.info("Received linked event");
                            LinkingSummary summary = (LinkingSummary) event.getData();
                            String provider = summary.getProvider();

                            PendingLinks.remove(userId, provider);
                            //Linking in social network was successful
                            if (slService.link(userId, provider, summary.getUid())) {
                                parseLinkedAccounts();
                                BindUtils.postNotifyChange(AccountLinkingViewModel.this, "providers");
                            }
                        }
                    });
        }

    }

    @AfterCompose
    public void afterCompose(@ContextParam(ContextType.VIEW) Component view) {
        Selectors.wireEventListeners(view, this);
    }

    @Listen("onData=#temp")
    public void link(Event evt) {
        PendingLinks.add(userId, evt.getData().toString(), null);
    }

    @NotifyChange("providers")
    @Command
    public void disable(@BindingParam("provider") Provider provider) {

        if (linkedTotal > 1 || slService.hasPassword(userId)) {
            boolean succ = slService.unlink(userId, provider);
            if (succ) {
                parseLinkedAccounts();
            }
            UIUtils.showMessageUI(succ);
        } else {
            Messagebox.show(Labels.getLabel("sociallogin.linking_pass_needed"), null, Messagebox.OK, Messagebox.INFORMATION);
        }

    }

    @NotifyChange("providers")
    @Command
    public void enable(@BindingParam("provider") Provider provider) {

        boolean succ = slService.enableLink(userId, provider);
        if (succ) {
            parseLinkedAccounts();
        }
        UIUtils.showMessageUI(succ);

    }

    @Command
    public void remove(@BindingParam("provider") Provider provider) {

        if (linkedTotal > 1 || slService.hasPassword(userId)) {
            Messagebox.show(Labels.getLabel("sociallogin.remove_hint"), null, Messagebox.YES | Messagebox.NO, Messagebox.QUESTION,
                    event -> {
                        if (Messagebox.ON_YES.equals(event.getName())) {

                            if (slService.delete(userId, provider)) {
                                parseLinkedAccounts();
                                UIUtils.showMessageUI(true, Labels.getLabel("sociallogin.removed_link", new String[]{provider.getDisplayName()}));
                                BindUtils.postNotifyChange(AccountLinkingViewModel.this, "providers");
                            } else {
                                UIUtils.showMessageUI(false);
                            }
                        }
                    });
        } else {
            Messagebox.show(Labels.getLabel("sociallogin.linking_pass_needed"), null, Messagebox.OK, Messagebox.INFORMATION);
        }

    }

    private void parseLinkedAccounts() {

        logger.info("Parsing linked/unlinked accounts for {}", userId);
        List<ExternalAccount> linked = slService.getAccounts(userId, true);
        List<ExternalAccount> unlinked = slService.getAccounts(userId, false);

        accounts = new HashMap<>();
        linkedTotal = linked.size();
        linked.forEach(acc -> accounts.put(acc.getProvider(), new Pair<>(true, acc.getUid())));
        unlinked.forEach(acc -> accounts.put(acc.getProvider(), new Pair<>(false, acc.getUid())));

    }

}
