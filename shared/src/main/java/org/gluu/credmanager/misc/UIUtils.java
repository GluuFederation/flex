/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 20178, Gluu
 */
package org.gluu.credmanager.misc;

import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.util.Clients;

/**
 * @author jgomer
 */
public final class UIUtils {

    public static final int FEEDBACK_DELAY_SUCC = 1500;
    public static final int FEEDBACK_DELAY_ERR = 3000;

    private UIUtils() { }

    public static void showMessageUI(boolean success) {
        showMessageUI(success, Labels.getLabel(success ? "general.operation_completed" : "general.error.general"));
    }

    public static void showMessageUI(boolean success, String msg) {
        showMessageUI(success, msg, "middle_center");
    }

    public static void showMessageUI(boolean success, String msg, String position) {
        if (success) {
            Clients.showNotification(msg, Clients.NOTIFICATION_TYPE_INFO, null, position, FEEDBACK_DELAY_SUCC);
        } else {
            Clients.showNotification(msg, Clients.NOTIFICATION_TYPE_WARNING, null, position, FEEDBACK_DELAY_ERR);
        }
    }

}
