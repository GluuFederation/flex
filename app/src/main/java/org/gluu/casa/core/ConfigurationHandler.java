package org.gluu.casa.core;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.model.ApplicationConfiguration;
import org.gluu.casa.core.model.CustomScript;
import org.gluu.casa.misc.AppStateEnum;
import org.gluu.casa.timer.*;
import org.gluu.oxauth.model.util.SecurityProviderUtility;
import org.gluu.persist.exception.operation.PersistenceException;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author jgomer
 */
@ApplicationScoped
public class ConfigurationHandler extends JobListenerSupport {

    public static final String DEFAULT_ACR = "casa";

    private static final int RETRIES = 15;
    private static final int RETRY_INTERVAL = 20;

    @Inject
    private Logger logger;

    @Inject
    private AssetsService assetsService;

    @Inject
    private PersistenceService persistenceService;

    @Inject
    private OxdService oxdService;

    @Inject
    private ExtensionsManager extManager;

    @Inject
    private TimerService timerService;

    @Inject
    private LogService logService;

    @Inject
    private AuthnScriptsReloader scriptsReloader;

    @Inject
    private SyncSettingsTimer syncSettingsTimer;

    //@Inject
    //private StatisticsTimer statisticsTimer;

    @Inject
    private FSPluginChecker pluginChecker;

    private ApplicationConfiguration appConfiguration;

    private MainSettings settings;

    private String acrQuartzJobName;

    private AppStateEnum appState;

    private boolean acrsRetrieved;

    @PostConstruct
    private void inited() {
        setAppState(AppStateEnum.LOADING);
        logger.info("ConfigurationHandler inited");
        acrQuartzJobName = getClass().getSimpleName() + "_acr";
        SecurityProviderUtility.installBCProvider();
    }

    private boolean initializeSettings() {
        logger.info("initializeSettings. Obtaining global settings");
        appConfiguration = persistenceService.getAppConfiguration();
        settings = appConfiguration.getSettings();
        return settings != null;
    }

    void init() {

        try {
            //Check DB access to proceed with acr timer
            if (persistenceService.initialize() && initializeSettings()) {
                //Update log level ASAP
                computeLoggingLevel();
                //Force early initialization of assets service before it is used in zul templates
                assetsService.reloadUrls();

                //This is a trick so the timer event logic can be coded inside this managed bean
                timerService.addListener(this, acrQuartzJobName);
                /*
                 A gap of 5 seconds is enough for the RestEasy scanning process to take place (in case oxAuth is already up and running)
                 RETRIES*RETRY_INTERVAL seconds gives room to recover the acr list. This big amount of time may be required
                 in cases where casa service starts too soon (even before oxAuth itself)
                */
                timerService.schedule(acrQuartzJobName, 5, RETRIES, RETRY_INTERVAL);
            } else {
                setAppState(AppStateEnum.FAIL);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            setAppState(AppStateEnum.FAIL);
        }

    }

    @Produces @ApplicationScoped
    public MainSettings getSettings() {
        return settings;
    }

    public void saveSettings() throws PersistenceException {
        logger.info("Persisting settings to database");
        if (!persistenceService.modify(appConfiguration)) {
            throw new PersistenceException("Config changes could not be saved to database");
        }
    }

    @Override
    public String getName() {
        return acrQuartzJobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        if (!acrsRetrieved) {
            //Do an attempt to retrieve acrs
            Set<String> serverAcrs = retrieveAcrs();
            acrsRetrieved = serverAcrs != null;

            try {
                if (!acrsRetrieved) {
                    Date nextJobExecutionAt = context.getNextFireTime();

                    if (nextJobExecutionAt == null) {     //Run out of attempts!
                        logger.warn("The list of supported acrs could not be obtained.");
                        setAppState(AppStateEnum.FAIL);
                    } else {
                        logger.warn("Retrying in {} seconds", RETRY_INTERVAL);
                    }
                } else {
                    computePassResetable();
                    extManager.scan();
                    computeAcrPluginMapping();
                    computeCorsOrigins();

                    if (oxdService.initialize()) {
                        //Call to initialize should be followed by saving
                        try {
                            saveSettings();
                            setAppState(AppStateEnum.OPERATING);
                        } catch (Exception e) {
                            logger.error(e.getMessage());
                            setAppState(AppStateEnum.FAIL);
                        }
                        if (appState.equals(AppStateEnum.OPERATING)) {
                            logger.info("=== WEBAPP INITIALIZED SUCCESSFULLY ===");
                            //Add some random seconds to gaps. This reduces the chance of timers running at the same time
                            //in a multi node environment, which IMO it's somewhat safer
                            int gap = Double.valueOf(Math.random() * 7).intValue();
                            scriptsReloader.init(1 + gap);
                            syncSettingsTimer.activate(60 + gap);
                            //statistics timer executes in a single node in theory...
                            //statisticsTimer.activate(120 + gap);
                            //plugin checker is not shared-state related
                            pluginChecker.activate(5);
                        }
                    } else {
                        logger.warn("oxd configuration could not be initialized.");
                        setAppState(AppStateEnum.FAIL);
                    }
                }

            } catch (Exception e) {
                if (!appState.equals(AppStateEnum.OPERATING)) {
                    logger.error(e.getMessage(), e);
                }
            }
        }

    }

    public AppStateEnum getAppState() {
        return appState;
    }

    private List<CustomScript> getEnabledScripts() {
        CustomScript sample = new CustomScript();
        sample.setBaseDn(persistenceService.getCustomScriptsDn());
        sample.setEnabled(true);
        return persistenceService.find(sample);        
    }
    
    public Map<String, Integer> getAcrLevelMapping() {
    	Map<String, Integer> map = getEnabledScripts().stream()
    	    .collect(Collectors.toMap(CustomScript::getDisplayName, CustomScript::getLevel));
    	logger.debug("ACR/Level mapping is: {}", map);
    	return map;
    }

    public Set<String> retrieveAcrs() {
        return getEnabledScripts().stream().map(CustomScript::getDisplayName).collect(Collectors.toSet());
    }

    private void setAppState(AppStateEnum state) {

        if (state.equals(AppStateEnum.FAIL)) {
            logger.error("Application not in operable state, please fix configuration issues before proceeding.");
            logger.info("=== WEBAPP INITIALIZATION FAILED ===");
        }
        appState = state;

    }

    private void computeLoggingLevel() {
        settings.setLogLevel(logService.updateLoggingLevel(settings.getLogLevel()));
    }

    private void computePassResetable() {

        if (settings.isEnablePassReset() && persistenceService.isBackendLdapEnabled()) {
            logger.error("Pass reset set automatically to false. Check if you are using a backend LDAP");
            settings.setEnablePassReset(false);
        }

    }

    private void computeAcrPluginMapping() {
        if (settings.getAcrPluginMap() == null) {
            settings.setAcrPluginMap(new HashMap<>());
        }
    }

    private void computeCorsOrigins() {
        if (settings.getCorsDomains() == null) {
            settings.setCorsDomains(new ArrayList<>());
        }
    }

}
