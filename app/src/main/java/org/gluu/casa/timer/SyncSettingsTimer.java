package org.gluu.casa.timer;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.TimerService;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * @author jgomer
 */
@ApplicationScoped
public class SyncSettingsTimer extends JobListenerSupport {

    private static final int SCAN_INTERVAL = 90;    //sync config file every 90sec

    @Inject
    private Logger logger;

    @Inject
    private TimerService timerService;

    @Inject
    private MainSettings mainSettings;

    private String jobName;

    public void activate(int gap) {

        jobName = getClass().getSimpleName() + "_syncfile";
        try {
            timerService.addListener(this, jobName);
            //Start in 90 seconds and repeat indefinitely
            timerService.schedule(jobName,  gap, -1, SCAN_INTERVAL);
        } catch (Exception e) {
            logger.warn("Automatic synchronization of config file won't be available");
            logger.error(e.getMessage(), e);
        }

    }

    @Override
    public String getName() {
        return jobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        try {
            logger.debug("SyncSettingsTimer timer running...");
            mainSettings.updateConfigFile();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

}
