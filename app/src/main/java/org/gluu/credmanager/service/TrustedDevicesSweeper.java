/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.ldap.sdk.Filter;
import org.gluu.credmanager.conf.sndfactor.TrustedDevice;
import org.gluu.credmanager.conf.sndfactor.TrustedOrigin;
import org.gluu.credmanager.core.TimerService;
import org.gluu.credmanager.core.ldap.PersonPreferences;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * @author jgomer
 */
@ApplicationScoped
public class TrustedDevicesSweeper extends JobListenerSupport {

    @Inject
    private Logger logger;

    private String quartzJobName;
    private long locationExpiration;
    private long deviceExpiration;

    private ObjectMapper mapper;

    @Inject
    private TimerService timerService;

    @Inject
    private LdapService ldapService;

    @PostConstruct
    private void inited() {
        mapper = new ObjectMapper();
        quartzJobName = getClass().getSimpleName() + "_sweep";
    }

    public void activate(long locationExpiration, long deviceExpiration) {

        this.locationExpiration = locationExpiration;
        this.deviceExpiration = deviceExpiration;
        try {
            int oneDay = (int) TimeUnit.DAYS.toSeconds(1);
            timerService.addListener(this, quartzJobName);
            //Start in one second and repeat indefinitely once every day
            timerService.schedule(quartzJobName, 1, -1, oneDay);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    @Override
    public String getName() {
        return quartzJobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        logger.info("TrustedDevicesSweeper. Running timer job");
        long now = System.currentTimeMillis();
        List<PersonPreferences> people = getPeopleTrustedDevices();

        for (PersonPreferences person : people) {
            try {
                String trustedDevicesInfo = ldapService.getDecryptedString(person.getTrustedDevicesInfo());
                List<TrustedDevice> list = mapper.readValue(trustedDevicesInfo, new TypeReference<List<TrustedDevice>>() { });

                if (removeExpiredData(list, now)) {
                    //update list
                    String jsonStr = mapper.writeValueAsString(list);
                    updateTrustedDevices(person, jsonStr);
                }
            } catch (Exception e) {
                //TODO: if fails, should the trusted dvicesinfo be cleared (e.g. migration of gluu version may change salt?)
                logger.error(e.getMessage(), e);
            }
        }

    }

    private boolean removeExpiredData(List<TrustedDevice> list, long time) throws Exception {

        boolean changed = false;

        for (int i = 0; i < list.size(); i++) {
            TrustedDevice device = list.get(i);
            List<TrustedOrigin> origins = device.getOrigins();

            if (origins != null) {
                long oldest = Long.MAX_VALUE;

                for (int j = 0; j < origins.size(); j++) {

                    TrustedOrigin origin = origins.get(j);
                    if (origin.getTimestamp() < oldest) {
                        oldest = origin.getTimestamp();
                    }
                    if (time - origin.getTimestamp() > locationExpiration) {
                        origins.remove(j);
                        j--;
                        changed = true;
                    }
                }

                if (time - oldest > deviceExpiration) {
                    list.remove(i);
                    i--;
                    changed = true;
                }
            }
        }
        return changed;

    }

    private List<PersonPreferences> getPeopleTrustedDevices() {

        List<PersonPreferences> list = new ArrayList<>();
        try {
            String filther = Filter.createPresenceFilter("oxTrustedDevicesInfo").toString();
            ldapService.find(PersonPreferences.class, ldapService.getPeopleDn(), filther);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return list;

    }

    private void updateTrustedDevices(PersonPreferences person, String jsonDevices) throws Exception {
        String rdn = person.getInum();
        logger.trace("TrustedDevicesSweeper. Cleaning expired trusted devices for user '{}'", rdn);
        person.setTrustedDevices(ldapService.getEncryptedString(jsonDevices));
        ldapService.modify(person, PersonPreferences.class);

    }
}
