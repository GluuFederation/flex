/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.sndfactor.EnforcementPolicy;
import org.gluu.casa.misc.AppStateEnum;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.timer.AuthnScriptsReloader;
import org.gluu.casa.timer.TrustedDevicesSweeper;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.net.URL;
import java.util.*;

/**
 * @author jgomer
 */
@Named
@ApplicationScoped
public class ConfigurationHandler extends JobListenerSupport {

    public static final Pair<Integer, Integer> BOUNDS_MINCREDS_2FA = new Pair<>(1, 3);
    public static final String DEFAULT_ACR = "casa";
    public static final List<String> DEFAULT_SUPPORTED_METHODS = Arrays.asList("u2f", "otp", "super_gluu", "twilio_sms");

    private static final int RETRIES = 15;
    private static final int RETRY_INTERVAL = 20;

    @Inject
    private Logger logger;

    @Inject
    private MainSettings settings;

    @Inject
    private LdapService ldapService;

    @Inject
    private OxdService oxdService;

    @Inject
    private ExtensionsManager extManager;

    @Inject
    private TimerService timerService;

    @Inject
    private LogService logService;

    @Inject
    private TrustedDevicesSweeper devicesSweeper;

    @Inject
    private AuthnScriptsReloader scriptsReloader;

    private String acrQuartzJobName;

    private ObjectMapper mapper;

    private AppStateEnum appState;

    private boolean acrsRetrieved;

    @PostConstruct
    private void inited() {
        logger.info("ConfigurationHandler inited");
        mapper = new ObjectMapper();
        acrQuartzJobName = getClass().getSimpleName() + "_acr";
    }

    void init() {

        try {
            //Update log level
            computeLoggingLevel();
            //Check LDAP access to proceed with acr timer
            if (ldapService.initialize()) {
                setAppState(AppStateEnum.LOADING);

                //This is a trick so the timer event logic can be coded inside this managed bean
                timerService.addListener(this, acrQuartzJobName);
                /*
                 A gap of 5 seconds is enough for the RestEasy scanning process to take place (in case oxAuth is already up and running)
                 RETRIES*RETRY_INTERVAL seconds gives room to recover the acr list. This big amount of time may be required
                 in cases where cred-manager service starts too soon (even before oxAuth itself)
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

    public MainSettings getSettings() {
        return settings;
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
                    if (!Utils.onWindows()) {
                        //This is required to guarantee the list of acrs is really complete (after oxauth starts, the list
                        //can still contain just a few elements). In a development environment it's unlikely this occurs
                        Thread.sleep(RETRIES * RETRY_INTERVAL * 100);
                    }

                    if (serverAcrs.contains(DEFAULT_ACR)) {
                        computeMinCredsForStrongAuth();
                        computePassResetable();
                        compute2FAEnforcementPolicy();

                        if (oxdService.initialize()) {
                            extManager.scan();
                            computeAcrPluginMapping();

                            try {
                                settings.save();
                                setAppState(AppStateEnum.OPERATING);
                            } catch (Exception e) {
                                logger.error("Error updating configuration file: {}", e.getMessage());
                                setAppState(AppStateEnum.FAIL);
                            }
                            if (appState.equals(AppStateEnum.OPERATING)) {
                                logger.info("=== WEBAPP INITIALIZED SUCCESSFULLY ===");
                                scriptsReloader.init(1);
                                devicesSweeper.activate(10);
                            }
                        } else {
                            logger.warn("oxd configuration could not be initialized.");
                            setAppState(AppStateEnum.FAIL);
                        }
                    } else {
                        logger.error("Your Gluu server is missing one critical acr value: {}.", DEFAULT_ACR);
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

    public Map<String, Integer> getAcrLevelMapping() {

        Map<String, Integer> map = new HashMap<>();
        try {
            String oidcEndpointURL = ldapService.getOIDCEndpoint();
            JsonNode levels = mapper.readTree(new URL(oidcEndpointURL)).get("auth_level_mapping");
            Iterator<Map.Entry<String, JsonNode>> it = levels.fields();

            while (it.hasNext()) {
                Map.Entry<String, JsonNode> entry = it.next();
                try {
                    Integer levl = Integer.parseInt(entry.getKey());
                    Iterator<JsonNode> arrayIt = entry.getValue().elements();
                    while (arrayIt.hasNext()) {
                        map.put(arrayIt.next().asText(), levl);
                    }
                } catch (Exception e) {
                    logger.error("Error parsing level for {}: {}", entry.getKey(), e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return map;

    }

    /**
     * Performs a GET to the OIDC metadata URL and extracts the ACR values supported by the server
     * @return A Set of String values or null if a networking or parsing error occurs
     */
    private Set<String> retrieveAcrs() {

        try {
            String oidcEndpointURL = ldapService.getOIDCEndpoint();
            //too noisy log statement
            //logger.trace("Obtaining \"acr_values_supported\" from server {}", oidcEndpointURL);
            JsonNode values = mapper.readTree(new URL(oidcEndpointURL)).get("acr_values_supported");

            //Add server's supported acr values
            Set<String> serverAcrs = new HashSet<>();
            values.forEach(node -> serverAcrs.add(node.asText()));
            return serverAcrs;

        } catch (Exception e) {
            logger.error("Could not retrieve the list of acrs supported by this server: {}", e.getMessage());
            return null;
        }

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

    private void computeMinCredsForStrongAuth() {

        int defaultValue = (BOUNDS_MINCREDS_2FA.getX() + BOUNDS_MINCREDS_2FA.getY()) / 2;
        Integer providedValue = settings.getMinCredsFor2FA();

        if (providedValue == null) {
            logger.info("Using default value of {} for minimum number of credentials to enable strong authentication", defaultValue);
            settings.setMinCredsFor2FA(defaultValue);
        } else {
            if (providedValue < BOUNDS_MINCREDS_2FA.getX() || providedValue > BOUNDS_MINCREDS_2FA.getY()) {
                logger.info("Value for min_creds_2FA={} not in interval [{},{}]. Defaulting to {}", providedValue,
                        BOUNDS_MINCREDS_2FA.getX(), BOUNDS_MINCREDS_2FA.getY(), defaultValue);
                settings.setMinCredsFor2FA(defaultValue);
            }
        }

    }

    private void computePassResetable() {

        if (settings.isEnablePassReset() && ldapService.isBackendLdapEnabled()) {
            logger.error("Pass reset set automatically to false. Check if you are using a backend LDAP");
            settings.setEnablePassReset(false);
        }

    }

    private void compute2FAEnforcementPolicy() {
        if (Utils.isEmpty(settings.getEnforcement2FA())) {
            settings.setEnforcement2FA(Collections.singletonList(EnforcementPolicy.EVERY_LOGIN));
        }
    }

    private void computeAcrPluginMapping() {

        Map<String, String> mapping = settings.getAcrPluginMap();
        Map<String, String> newMap = new HashMap<>();

        if (Utils.isNotEmpty(mapping)) {

            for (String acr : mapping.keySet()) {
                //Is there a current runtime impl for this acr?
                String plugId = mapping.get(acr);
                if (extManager.pluginImplementsAuthnMethod(acr, plugId)) {
                    newMap.put(acr, plugId);
                } else {
                    if (plugId == null) {
                        logger.warn("There is no system extension that can work with acr '{}'", acr);
                    } else {
                        logger.warn("Plugin {} does not have extensions that can work with acr '{}' or plugin does not exist", plugId, acr);
                    }
                    logger.warn("acr removed from Gluu Casa configuration file...");
                }
            }
        }
        settings.setAcrPluginMap(newMap);

    }

}
