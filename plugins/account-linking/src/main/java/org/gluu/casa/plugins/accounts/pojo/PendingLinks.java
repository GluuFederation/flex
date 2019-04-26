package org.gluu.casa.plugins.accounts.pojo;

import net.jodah.expiringmap.ExpiringMap;
import org.zkoss.util.Pair;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author jgomer
 */
public class PendingLinks {

    private static final int TIME_WINDOW_DEFAULT = 2;
    private static final int MAX_STORED_ENTRIES = 1000;   //one thousand entries stored at most

    private static Map<Pair<String, String>, LinkingSummary> pending;

    static {
        pending = ExpiringMap.builder()
                .maxSize(MAX_STORED_ENTRIES).expiration(TIME_WINDOW_DEFAULT, TimeUnit.MINUTES).build();
    }

    public static void add(String userId, String provider, LinkingSummary summary) {
        pending.put(new Pair<>(userId, provider), summary);
    }

    public static LinkingSummary get(String userId, String provider) {
        return pending.get(new Pair<>(userId, provider));
    }

    public static boolean contains(String userId, String provider) {
        return pending.containsKey(new Pair<>(userId, provider));
    }

    public static void remove(String userId, String provider) {
        pending.remove(new Pair<>(userId, provider));
    }

}
