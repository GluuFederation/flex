package org.gluu.casa.timer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.TrustedDevicesSettings;
import org.gluu.casa.conf.sndfactor.TrustedDevice;
import org.gluu.casa.conf.sndfactor.TrustedOrigin;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.TimerService;
import org.gluu.service.cache.CacheInterface;
import org.gluu.casa.core.model.PersonPreferences;
import org.gluu.search.filter.Filter;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * In theory, the removal of expired devices will be carried out by a single node only (see {@link #jobToBeExecuted(JobExecutionContext)}.
 * @author jgomer
 */
@Named
@ApplicationScoped
public class TrustedDevicesSweeper extends JobListenerSupport {

    private static final int TRUSTED_DEVICE_EXPIRATION_DAYS = 30;
    private static final int TRUSTED_LOCATION_EXPIRATION_DAYS = 15;

    private final String ACTIVE_INSTANCE_PRESENCE = getClass().getName() + "_activeInstanceSet";

    @Inject
    private Logger logger;

    @Inject
    private TimerService timerService;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private MainSettings mainSettings;

    @Inject
    private CacheInterface storeService;

    private String quartzJobName;
    private long locationExpiration;
    private long deviceExpiration;
    private ObjectMapper mapper;
    private int oneDay;

    public int getLocationExpirationDays() {
        return (int) TimeUnit.MILLISECONDS.toDays(locationExpiration);
    }

    public int getDeviceExpirationDays() {
        return (int) TimeUnit.MILLISECONDS.toDays(deviceExpiration);
    }

    public void setup() {
        TrustedDevicesSettings tsettings = mainSettings.getTrustedDevicesSettings();
        locationExpiration = TimeUnit.DAYS.toMillis(Optional.ofNullable(tsettings)
                .map(TrustedDevicesSettings::getLocationExpirationDays).orElse(TRUSTED_LOCATION_EXPIRATION_DAYS));
        deviceExpiration = TimeUnit.DAYS.toMillis(Optional.ofNullable(tsettings)
                .map(TrustedDevicesSettings::getDeviceExpirationDays).orElse(TRUSTED_DEVICE_EXPIRATION_DAYS));
    }

    public void activate(int gap) {
        try {
            timerService.addListener(this, quartzJobName);
            //Start in gap seconds and repeat indefinitely once every day
            timerService.schedule(quartzJobName, gap, -1, oneDay);
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

        //Optimistically, the following if-else allows the sweeping logic to be executed only by a single node
        //(in a multi node environment)
        if (storeService.get(ACTIVE_INSTANCE_PRESENCE) == null) {
            //temporarily take the ownership for sweeping data
            storeService.put(oneDay, ACTIVE_INSTANCE_PRESENCE, true);
        } else {
            return;
        }

        logger.info("TrustedDevicesSweeper. Running timer job");
        long now = System.currentTimeMillis();
        List<PersonPreferences> people = getPeopleTrustedDevices();

        for (PersonPreferences person : people) {
            String jsonStr = null;
            try {
                String trustedDevicesInfo = persistenceService.getStringEncrypter().decrypt(person.getTrustedDevices());
                List<TrustedDevice> list = mapper.readValue(trustedDevicesInfo, new TypeReference<List<TrustedDevice>>() {});

                if (removeExpiredData(list, now)) {
                    if (list.size() > 0) {
                        //update list
                        jsonStr = mapper.writeValueAsString(list);
                        updateTrustedDevices(person, persistenceService.getStringEncrypter().encrypt(jsonStr));
                    } else {
                        updateTrustedDevices(person, null);
                    }
                }
            } catch (Exception e) {
                if (jsonStr == null) {
                    //This may happen when data in oxTrustedDevicesInfo attribute could not be parsed (e.g. migration
                    //of gluu version brought change in encryption salt?)
                    updateTrustedDevices(person, null);
                }
                logger.error(e.getMessage(), e);
            }
        }

    }

    private boolean removeExpiredData(List<TrustedDevice> list, long time) {

        boolean changed = false;
        List<Integer> deviceIndexes = new ArrayList<>();

        for (int i = 0; i < list.size(); i++) {
            TrustedDevice device = list.get(i);
            List<TrustedOrigin> origins = device.getOrigins();

            if (origins != null) {
                List<Integer> origIndexes = new ArrayList<>();
                for (int j = 0; j < origins.size(); j++) {
                    long timeStamp = origins.get(j).getTimestamp();

                    if (time - timeStamp > locationExpiration) {
                        origIndexes.add(0, j);
                    }
                }
                //Remove expired ones from the origins. This is a right-to-left removal
                origIndexes.forEach(ind -> origins.remove(ind.intValue()));    //intValue() is important here!
                changed = origIndexes.size() > 0;
            }
            if (device.getAddedOn() > 0 && time - device.getAddedOn() > deviceExpiration) {
                deviceIndexes.add(0, i);
                changed = true;
            }
        }
        //Right-to-left removal of expired devices
        deviceIndexes.forEach(ind -> list.remove(ind.intValue()));
        return changed;

    }

    private List<PersonPreferences> getPeopleTrustedDevices() {

        List<PersonPreferences> list = new ArrayList<>();
        try {
            list = persistenceService.find(PersonPreferences.class, persistenceService.getPeopleDn(), Filter.createPresenceFilter("oxTrustedDevicesInfo"));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return list;

    }

    private void updateTrustedDevices(PersonPreferences person, String value) {

        String uid = person.getUid();
        logger.trace("TrustedDevicesSweeper. Cleaning expired trusted devices for user '{}'", uid);
        person.setTrustedDevices(value);
        persistenceService.modify(person);

    }

    @PostConstruct
    private void inited() {
        mapper = new ObjectMapper();
        quartzJobName = getClass().getSimpleName() + "_sweep";
        oneDay = (int) TimeUnit.DAYS.toSeconds(1);
        setup();
    }

}
