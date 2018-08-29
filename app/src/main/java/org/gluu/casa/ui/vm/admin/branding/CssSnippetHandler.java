/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.ui.vm.admin.branding;

import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author jgomer
 */
public class CssSnippetHandler {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private static final String LOGO_SELECTOR = "logo";
    private static final String FAVICON_SELECTOR = "favicon";
    private static final String HEADER_SELECTOR = "header";
    private static final String PRIMARY_BUTTON_SELECTOR = "btn-success";
    private static final String AUXILIARY_BUTTON_SELECTOR = "btn-warning";
    private static final List<String> PANEL_HEADER_SELECTORS = Arrays.asList("z-panel-head", "z-panel-header");

    private static final String PRIMARY_BUTTON_DEF_COLOR = "#123456";
    private static final String AUXILIARY_BUTTON_DEF_COLOR = "#654321";
    private static final String HEADER_DEF_COLOR = "#ffffff";

    private String logoDataUri;

    private String faviconDataUri;

    private String headerColor;

    private String mainButtonColor;

    private String auxButtonColor;

    private String panelHeadColor;

    public CssSnippetHandler(String str) {

        if (str != null) {
            //Here .+? denotes one or more characters with reluctant consumption (not default greedy style of eating chars)
            faviconDataUri = getMatchingString(FAVICON_SELECTOR, "\\s*//src\\s*:\\s*(.+?;base64,[^;]+)", str);
            //Here .+? denotes one or more characters with reluctant consumption (not default greedy style of eating chars)
            logoDataUri = getMatchingString(LOGO_SELECTOR, "\\s*//src\\s*:\\s*(.+?;base64,[^;]+)", str);

            headerColor = getMatchingString(HEADER_SELECTOR, "\\s*background-color\\s*:\\s*([^;]+)", str);
            panelHeadColor = getMatchingString(PANEL_HEADER_SELECTORS.get(0), "\\s*background-color\\s*:\\s*([^;]+)", str);
            mainButtonColor = getMatchingString(PRIMARY_BUTTON_SELECTOR, "\\s*background-color\\s*:\\s*([^;]+)", str);
            auxButtonColor = getMatchingString(AUXILIARY_BUTTON_SELECTOR, "\\s*background-color\\s*:\\s*([^;]+)", str);
        }

    }

    private String getMatchingString(String selector, String subregexp, String cssString) {

        String match = null;
        try {
            String regexp = "\\." + selector + "\\s*\\{([^\\}]+)\\}";

            Matcher m = Pattern.compile(regexp).matcher(cssString);
            if (m.find()) {
                match = m.group(1);
                if (Utils.isNotEmpty(match)) {
                    m = Pattern.compile(subregexp).matcher(match);
                    if (m.find()) {
                        match = m.group(1);
                    }
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return match;

    }

    private String toned(String color, boolean lighter) {

        String cl;
        if (lighter) {
            cl = Integer.toString(Math.min(255, Integer.parseInt(color, 16) + 16), 16);
        } else {
            cl = Integer.toString(Math.max(0, Integer.parseInt(color, 16) - 16), 16);
        }
        cl += "0";
        return cl.substring(0, 2);

    }

    private String getColorFrom(String hexaColor, boolean lighter) {

        try {
            String r = toned(hexaColor.substring(1, 3), lighter);
            String g = toned(hexaColor.substring(3, 5), lighter);
            String b = toned(hexaColor.substring(5, 7), lighter);
            hexaColor = String.format("#%s%s%s", r, g, b);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return hexaColor;

    }

    private String getSnippetForButton(String selector, String color) {

        //Button css generation is more involved: we need to set states and autogenerate lighter and darker colors
        String snip = "";

        //this way of building correlates tightly with parsing logic at class constructor

        //Note that border-color must always be the same as background-color (only 1 color picker is shown in the UI for button)
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector, color, color);

        String tone = getColorFrom(color, true);
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector + ":disabled", tone, tone);
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector + ":disabled:hover", tone, tone);

        tone = getColorFrom(color, false);
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector + ":hover", tone, tone);
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector + ":focus", tone, tone);

        tone = getColorFrom(tone, false);
        snip += String.format(".%s{ background-color : %s; border-color: %s }\n", selector + ":focus:active", tone, tone);

        return snip;

    }

    public String getSnippet(boolean includeButtons) {

        String snip = "";
        //this way of building correlates tightly with parsing logic at class constructor
        snip += String.format(".%s{ background-color : %s; }\n", HEADER_SELECTOR, headerColor);
        snip += String.format(".%s{ //src : %s; \n}\n", LOGO_SELECTOR, logoDataUri);
        snip += String.format(".%s{ //src : %s; \n}\n", FAVICON_SELECTOR, faviconDataUri);

        for (String selector : PANEL_HEADER_SELECTORS) {
            snip += String.format(".%s{ background-color : %s; \n}\n", selector, panelHeadColor);
        }

        if (includeButtons) {
            snip += getSnippetForButton(PRIMARY_BUTTON_SELECTOR, mainButtonColor);
            snip += getSnippetForButton(AUXILIARY_BUTTON_SELECTOR, auxButtonColor);
        }
        logger.debug("snippet is\n{}", snip);
        return snip;
    }

    public void assignMissingButtonColors() {
        if (auxButtonColor == null) {
            auxButtonColor = AUXILIARY_BUTTON_DEF_COLOR;
        }
        if (mainButtonColor == null) {
            mainButtonColor = PRIMARY_BUTTON_DEF_COLOR;
        }
    }

    public void assignMissingHeaderColors() {
        if (headerColor == null) {
            headerColor = HEADER_DEF_COLOR;
        }
        if (panelHeadColor == null) {
            panelHeadColor = HEADER_DEF_COLOR;
        }
    }

    public String getHeaderColor() {
        return headerColor;
    }

    public String getMainButtonColor() {
        return mainButtonColor;
    }

    public String getPanelHeadColor() {
        return panelHeadColor;
    }

    public String getAuxButtonColor() {
        return auxButtonColor;
    }

    public String getLogoDataUri() {
        return logoDataUri;
    }

    public String getFaviconDataUri() {
        return faviconDataUri;
    }

    public void setHeaderColor(String headerColor) {
        this.headerColor = headerColor;
    }

    public void setMainButtonColor(String mainButtonColor) {
        this.mainButtonColor = mainButtonColor;
    }

    public void setAuxButtonColor(String auxButtonColor) {
        this.auxButtonColor = auxButtonColor;
    }

    public void setLogoDataUri(String logoDataUri) {
        this.logoDataUri = logoDataUri;
    }

    public void setFaviconDataUri(String faviconDataUri) {
        this.faviconDataUri = faviconDataUri;
    }

    public void setPanelHeadColor(String panelHeadColor) {
        this.panelHeadColor = panelHeadColor;
    }

}
