/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.core;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.credmanager.conf.MainSettings;
import org.gluu.credmanager.conf.sndfactor.EnforcementPolicy;
import org.gluu.credmanager.event.AppStateChangeEvent;
import org.gluu.credmanager.extension.AuthnMethod;
import org.gluu.credmanager.misc.AppStateEnum;
import org.gluu.credmanager.misc.Utils;
import org.gluu.credmanager.service.AuthnScriptsReloader;
import org.gluu.credmanager.service.LdapService;
import org.gluu.credmanager.service.TrustedDevicesSweeper;
import org.greenrobot.eventbus.EventBus;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

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
    private EventBus eventBus;

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

    private Set<String> serverAcrs;

    private String acrQuartzJobName;

    private ObjectMapper mapper;

    private AppStateEnum appState;

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
            if (ldapService.isInService()) {
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
            setAppState(AppStateEnum.FAIL);
            logger.error(e.getMessage(), e);
        }

    }

    public MainSettings getSettings() {
        return settings;
    }

    /**
     * Performs a GET to the OIDC metadata URL and extracts the ACR values supported by the server
     * @return A Set of String values
     * @throws Exception If an networking or parsing error occurs
     */
    public Set<String> retrieveAcrs() {

        try {
            String oidcEndpointURL = ldapService.getOIDCEndpoint();
            logger.debug("Obtaining \"acr_values_supported\" from server {}", oidcEndpointURL);
            JsonNode values = mapper.readTree(new URL(oidcEndpointURL)).get("acr_values_supported");

            //Store server's supported acr values in a set
            serverAcrs = new HashSet<>();
            values.forEach(node -> serverAcrs.add(node.asText()));
        } catch (Exception e) {
            logger.error("Could not retrieve the list of acrs supported by this server: {}", e.getMessage());
        }
        return serverAcrs;

    }

    @Override
    public String getName() {
        return acrQuartzJobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        try {
            if (serverAcrs == null) {
                Date nextJobExecutionAt = context.getNextFireTime();
                //Do an attempt to retrieve acrs
                retrieveAcrs();

                if (serverAcrs == null) {
                    if (nextJobExecutionAt == null) {     //Run out of attempts!
                        logger.warn("The list of supported acrs could not be obtained.");
                        setAppState(AppStateEnum.FAIL);
                    } else {
                        logger.warn("Retrying in {} seconds", RETRY_INTERVAL);
                    }
                } else {
                    //TODO: uncomment this block for production
                    /*
                    //This is required to guarantee the list of acrs is really complete (after oxauth starts, the list
                    //can still contain just a few elements)
                    Thread.sleep(RETRIES * RETRY_INTERVAL * 100);
                    logger.debug("Additional attempt");
                    retrieveAcrs();
                    */
                    if (serverAcrs.contains(DEFAULT_ACR)) {
                        computeBrandingPath();
                        computeMinCredsForStrongAuth();
                        computePassResetable();
                        compute2FAEnforcementPolicy();

                        extManager.scan();
                        if (oxdService.initialize()) {
                            setAppState(AppStateEnum.OPERATING);
                            refreshAcrPluginMapping();
                            //TODO: uncomment
                            //scriptsReloader.init();
                            devicesSweeper.setup(settings.getTrustedDevicesSettings());
                            devicesSweeper.activate();
                            logger.info("=== WEBAPP INITIALIZED SUCCESSFULLY ===");
                        } else {
                            logger.warn("oxd configuration could not be initialized.");
                            setAppState(AppStateEnum.FAIL);
                        }
                    } else {
                        logger.error("Your Gluu server is missing one critical acr value: {}.", DEFAULT_ACR);
                        setAppState(AppStateEnum.FAIL);
                    }
                }
                if (appState.equals(AppStateEnum.FAIL)) {
                    logger.error("Application not in operable state, please fix configuration issues before proceeding.");
                    logger.info("=== WEBAPP INITIALIZATION FAILED ===");
                }
            }
        } catch (Exception e) {
            if (!appState.equals(AppStateEnum.OPERATING)) {
                logger.error(e.getMessage(), e);
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

    public Set<String> getEnabledAcrs() {
        Set<String> plugged = new HashSet<>(settings.getAcrPluginMap().keySet());
        plugged.retainAll(retrieveAcrs());
        return plugged;
    }

    private void setAppState(AppStateEnum state) {

        if (!state.equals(appState)) {
            eventBus.post(new AppStateChangeEvent(state));
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
            logger.info("Using default value {} for minimum number of credentials to enable strong authentication");
            settings.setMinCredsFor2FA(defaultValue);
        } else {
            if (providedValue < BOUNDS_MINCREDS_2FA.getX() || providedValue > BOUNDS_MINCREDS_2FA.getY()) {
                logger.info("Value for min_creds_2FA={} not in interval [{},{}]. Defaulting to {}", providedValue,
                        BOUNDS_MINCREDS_2FA.getX(), BOUNDS_MINCREDS_2FA.getY(), defaultValue);
                settings.setMinCredsFor2FA(defaultValue);
            }
        }

    }

    private void computeBrandingPath() {

        String path = settings.getBrandingPath();
        try {
            if (Utils.isNotEmpty(path) && !Files.isDirectory(Paths.get(path))) {
                throw new IOException("Not a directory");
            }
        } catch (Exception e) {
            logger.error("Filesystem directory {} for custom branding is wrong. Using default theme", path);
            logger.error(e.getMessage(), e);
            settings.setBrandingPath(null);
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

    private void refreshAcrPluginMapping() {

        Map<String, String> mapping = settings.getAcrPluginMap();

        if (Utils.isEmpty(mapping)) {
            Set<String> acrs = extManager.getAuthnMethodExts().stream().map(AuthnMethod::getAcr).collect(Collectors.toSet());
            acrs.addAll(DEFAULT_SUPPORTED_METHODS);

            //Try to build the map by inspecting system extensions
            mapping = new HashMap<>();
            for (String acr : acrs) {
                if (extManager.pluginImplementsAuthnMethod(acr, null)) {
                    mapping.put(acr, null);
                }
            }
            settings.setAcrPluginMap(mapping);
        } else {
            Map<String, String> newMap = new HashMap<>();
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
                    logger.warn("acr removed from configuration file...");
                }
            }
            settings.setAcrPluginMap(newMap);
            try {
                settings.save();
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }

    }

}
