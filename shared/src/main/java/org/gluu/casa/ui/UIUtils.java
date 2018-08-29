/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 20178, Gluu
 */
package org.gluu.casa.ui;

import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.util.Clients;

/**
 * Utility class to show auto-dismiss notification success/error ZK notification boxes.
 * @author jgomer
 */
public final class UIUtils {

    /**
     * Duration (in ms) used for auto-dismiss in successful messages.
     */
    public static final int FEEDBACK_DELAY_SUCC = 1500;

    /**
     * Duration (in ms) used for auto-dismiss in error messages.
     */
    public static final int FEEDBACK_DELAY_ERR = 3000;

    private UIUtils() { }

    /**
     * Shows a notification box with a generic success or error message.
     * @param success Whether to use the success or error message
     */
    public static void showMessageUI(boolean success) {
        showMessageUI(success, Labels.getLabel(success ? "general.operation_completed" : "general.error.general"));
    }

    /**
     * Shows a notification box with the supplied success or error message, in the middle of the screen.
     * @param success Whether to use the success or error message
     * @param msg Message to show inside the box
     */
    public static void showMessageUI(boolean success, String msg) {
        showMessageUI(success, msg, "middle_center");
    }

    /**
     * Shows a notification box with the supplied success or error message, in the position passed in the parameter.
     * @param success Whether to use the success or error message
     * @param msg Message to show inside the box
     * @param position A string indicating the position (for a list of possible values see "useful Java utilities" in
     *                ZK developer's reference manual)
     */
    public static void showMessageUI(boolean success, String msg, String position) {
        if (success) {
            Clients.showNotification(msg, Clients.NOTIFICATION_TYPE_INFO, null, position, FEEDBACK_DELAY_SUCC);
        } else {
            Clients.showNotification(msg, Clients.NOTIFICATION_TYPE_WARNING, null, position, FEEDBACK_DELAY_ERR);
        }
    }

}
