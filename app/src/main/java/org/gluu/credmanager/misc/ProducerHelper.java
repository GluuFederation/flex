/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.misc;

import org.greenrobot.eventbus.EventBus;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

/**
 * @author jgomer
 */
@ApplicationScoped
public final class ProducerHelper {

    private ProducerHelper() { }

    @Produces
    public static EventBus eventBusInstance() {
        return EventBus.getDefault();
    }

}
