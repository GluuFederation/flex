/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.misc;

import org.zkoss.util.Pair;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author jgomer
 */
public class ExpirationMap<K, V> {

    private static final long TIME_WINDOW_DEFAULT = 120000L; //2 minutes
    private static final int MAX_STORED_ENTRIES = 1000;   //one thousand entries stored at most

    private long lastCleaning;
    private long timeWindow;
    private int maxEntries;
    private ConcurrentHashMap<K, Pair<V, Long>> map = new ConcurrentHashMap<>();

    public ExpirationMap() {
        initMap(TIME_WINDOW_DEFAULT, MAX_STORED_ENTRIES);
    }

    public ExpirationMap(long timeWindow, int maxEntries) {
        initMap(timeWindow, maxEntries);
    }

    public void put(K key, V value) {
        map.put(key, new Pair<>(value, System.currentTimeMillis()));
        reduceMap();
    }

    public V get(K key) {
        return map.get(key).getX();
    }

    public Pair<V, Boolean> getWithExpired(K key, long instant) {
        Pair<V, Long> pair = map.get(key);
        return pair == null ? null : new Pair<>(pair.getX(), instant - pair.getY() > timeWindow);
    }

    public V remove(K key) {
        Pair<V, Long> pair = map.remove(key);
        return pair == null ? null : pair.getX();
    }

    private void initMap(long timeWindow, int maxEntries) {
        this.timeWindow = timeWindow;
        this.maxEntries = maxEntries;
        map = new ConcurrentHashMap<>();
        lastCleaning = System.currentTimeMillis();
    }

    private void reduceMap() {

        long now = System.currentTimeMillis();
        if (now - lastCleaning > timeWindow && map.size() > maxEntries) {
            lastCleaning = now;
            List<K> removals = new ArrayList<>();

            for (K key : map.keySet()) {
                if (now - map.get(key).getY() > timeWindow) {
                    removals.add(key);
                }
            }
            //Apply all removals consecutively
            for (K key : removals) {
                map.remove(key);
            }

        }
        /*
        //no parallelism in the search, grab the first key that matches the condition
        String aKey = map.searchKeys(Long.MAX_VALUE, key -> (now - map.get(key) > TIME_WINDOW_DEFAULT) ? key : null);
        map.remove(aKey);
        */
    }

}
