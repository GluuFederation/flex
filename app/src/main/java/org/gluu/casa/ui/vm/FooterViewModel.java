package org.gluu.casa.ui.vm;

import java.util.Comparator;
import java.util.Optional;
import java.util.Locale;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.gluu.casa.core.ZKService;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.gluu.util.StringHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.web.Attributes;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

@VariableResolver(DelegatingVariableResolver.class)
public class FooterViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private SortedSet<Locale> locales;
    private Locale selectedLocale;

    @Init
    public void init() {

        Locale localeInSession = Optional.ofNullable(WebUtils.getServletRequest().getSession(false)
                .getAttribute(Attributes.PREFERRED_LOCALE)).map(Locale.class::cast).orElse(null);
        //do nothing if there is no locale in session
        if (localeInSession != null && locales == null) {
            //locales null check above prevents recomputing the list to be displayed upon every page load
            Set<Locale> tmp = Utils.managedBean(ZKService.class).getSupportedLocales();

            if (tmp != null) {
                //Use a comparator based on locales' display name
                locales = new TreeSet<>(Comparator.comparing(locale -> locale.getDisplayName(locale).toLowerCase()));
                locales.addAll(tmp);

                if (locales.contains(localeInSession)) {
                    selectedLocale = localeInSession;
                } else {
                    //Pick a good fit based on session's locale language
                    String language = localeInSession.getLanguage();
                    selectedLocale = locales.stream().filter(loc -> StringHelper.equalsIgnoreCase(loc.getLanguage(), language))
                            .findFirst().orElse(WebUtils.DEFAULT_LOCALE);
                }
                logger.debug("Selected locale in UI will be '{}'", selectedLocale.getDisplayName(selectedLocale));
            }
        }

    }

    @Command
    public void localeChanged(@BindingParam("locale") Locale locale) {
        selectedLocale = locale;
        WebUtils.getServletRequest().getSession().setAttribute(Attributes.PREFERRED_LOCALE, selectedLocale);
        Executions.sendRedirect(null); // reload the same page
    }

    public Locale getSelectedLocale() {
        return selectedLocale;
    }

    public Set<Locale> getLocales() {
        return locales;
    }

}
