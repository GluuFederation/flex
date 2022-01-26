package org.gluu.casa.plugins.inwebo;

import org.gluu.casa.misc.WebUtils;
import org.zkoss.bind.annotation.Init;

public class InweboActivateVM {

	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * Initialization method for this ViewModel.
	 */
	@Init
	public void init() {
		code = WebUtils.getServletRequest().getParameter("code");
		System.out.println(code);
	}
}
