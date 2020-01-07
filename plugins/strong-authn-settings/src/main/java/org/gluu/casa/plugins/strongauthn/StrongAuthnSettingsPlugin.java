package org.gluu.casa.plugins.strongauthn;

import org.gluu.casa.core.ITrackable;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.strongauthn.conf.Configuration;
import org.gluu.casa.plugins.strongauthn.conf.EnforcementPolicy;
import org.gluu.casa.plugins.strongauthn.service.StrongAuthSettingsService;
import org.gluu.casa.plugins.strongauthn.service.TrustedDevicesSweeper;
import org.gluu.casa.service.settings.IPluginSettingsHandler;
import org.gluu.service.cache.CacheInterface;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.gluu.casa.misc.Utils.MIN_CREDS_2FA_DEFAULT;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;

/**
 * A plugin for handling second factor authentication settings for administrators and users.
 * @author jgomer
 */
public class StrongAuthnSettingsPlugin extends Plugin implements ITrackable {

    public static final int TRUSTED_DEVICE_EXPIRATION_DAYS = 30;
    public static final int TRUSTED_LOCATION_EXPIRATION_DAYS = 15;

    private static final int ONE_DAY = (int) TimeUnit.DAYS.toSeconds(1);
    private final String ACTIVE_INSTANCE_PRESENCE = getClass().getName() + "_activeInstanceSet";

    private Logger logger = LoggerFactory.getLogger(getClass());
    private IPluginSettingsHandler<Configuration> settingsHandler;
    private Scheduler scheduler;
    private JobKey jobKey;
    private CacheInterface storeService;

    public StrongAuthnSettingsPlugin(PluginWrapper wrapper) throws Exception {
        super(wrapper);
        settingsHandler = StrongAuthSettingsService.instance(wrapper.getPluginId()).getSettingsHandler();
        storeService = Utils.managedBean(CacheInterface.class);
        scheduler = StdSchedulerFactory.getDefaultScheduler();
    }

    @Override
    public void start() {

        if (settingsHandler.getSettings() == null) {

            try {
                logger.info("Initializing missing 2FA settings");
                Configuration conf = new Configuration();
                conf.setMinCredsFor2FA(MIN_CREDS_2FA_DEFAULT);
                conf.setEnforcement2FA(Collections.singletonList(EnforcementPolicy.EVERY_LOGIN));

                settingsHandler.setSettings(conf);
                settingsHandler.save();
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }

        }

        //Optimistically, the following if-else allows the sweeping logic to be executed only by a single node
        //(in a multi node environment)
        if (storeService.get(ACTIVE_INSTANCE_PRESENCE) == null) {
            //temporarily take the ownership for sweeping data
            storeService.put(ONE_DAY, ACTIVE_INSTANCE_PRESENCE, true);
            jobKey = initTimer(10);
        }

    }

    @Override
    public void delete() {

        try {
            if (jobKey != null) {
                logger.info("Removing trusted devices sweeper job");
                scheduler.deleteJob(jobKey);
            }

            logger.warn("Resetting strong authentication settings...");
            Configuration currentConfig = settingsHandler.getSettings();
            currentConfig.setMinCredsFor2FA(MIN_CREDS_2FA_DEFAULT);
            currentConfig.setTrustedDevicesSettings(null);
            currentConfig.setEnforcement2FA(Collections.singletonList(EnforcementPolicy.EVERY_LOGIN));

            settingsHandler.save();
            logger.info("Done.");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private JobKey initTimer(int gap) {

        try {
            if (!scheduler.isStarted()) {
                scheduler.start();
            }

            Class<? extends Job> cls = TrustedDevicesSweeper.class;
            String name = cls.getSimpleName();
            String group = getClass().getSimpleName();
            logger.info("Scheduling timer {}", name);

            JobDetail job = JobBuilder.newJob(cls).withIdentity("job_" + name, group).build();
            SimpleTrigger trigger = TriggerBuilder.newTrigger().withIdentity("trigger_" + name, group)
                    .startAt(new Date(System.currentTimeMillis() + gap * 1000))
                    .withSchedule(simpleSchedule().withIntervalInSeconds(ONE_DAY).repeatForever())
                    .build();

            scheduler.scheduleJob(job, trigger);
            return job.getKey();

        } catch (SchedulerException e) {
            logger.warn("Device sweeping won't be available");
            logger.error(e.getMessage(), e);
            return null;
        }

    }

}
