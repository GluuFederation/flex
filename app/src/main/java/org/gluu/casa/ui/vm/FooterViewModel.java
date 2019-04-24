/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui.vm;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.gluu.casa.core.SessionContext;
import org.gluu.casa.core.ZKService;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.misc.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.web.Attributes;
import org.zkoss.zk.ui.Executions;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

@VariableResolver(DelegatingVariableResolver.class)
public class FooterViewModel {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@WireVariable
	private SessionContext sessionContext;

	private List<Locale> locales;
	private ZKService zkService;
	private Locale selectedLocale;

	@Init
	public void init() {
		zkService = Utils.managedBean(ZKService.class);
		// TODO: check if Set can be rendered in the listbox, if yes, change this to Set
		locales = zkService.getSupportedLocales().stream().collect(Collectors.toList());
		// auto select English as default language
		if (WebUtils.getServletRequest().getSession().getAttribute(Attributes.PREFERRED_LOCALE) == null) {
			selectedLocale = Locale.ENGLISH;
		} else {
			selectedLocale = (Locale) WebUtils.getServletRequest().getSession().getAttribute(Attributes.PREFERRED_LOCALE);
		}
	}

	@Command
	public void languageChanged(@BindingParam("localeCode") String localeCode) {

		selectedLocale = org.zkoss.util.Locales.getLocale(localeCode);
		WebUtils.getServletRequest().getSession().setAttribute(Attributes.PREFERRED_LOCALE, selectedLocale);
		Executions.sendRedirect(null); // reload the same page
	}

	public Locale getSelectedLocale() {
		return selectedLocale;
	}

	public void setSelectedLocale(Locale selectedLocale) {
		this.selectedLocale = selectedLocale;
	}

	public List<Locale> getLocales() {
		return locales;
	}

	public void setLocales(List<Locale> locales) {
		this.locales = locales;
	}
}
