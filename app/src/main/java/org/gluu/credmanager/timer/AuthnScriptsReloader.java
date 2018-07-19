/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.timer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.credmanager.core.ConfigurationHandler;
import org.gluu.credmanager.core.ExtensionsManager;
import org.gluu.credmanager.core.LdapService;
import org.gluu.credmanager.core.TimerService;
import org.gluu.credmanager.core.ldap.oxCustomScript;
import org.gluu.credmanager.extension.AuthnMethod;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;
import org.xdi.model.ScriptLocationType;
import org.xdi.model.SimpleExtendedCustomProperty;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.File;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.*;

/**
 * @author jgomer
 */
@ApplicationScoped
public class AuthnScriptsReloader extends JobListenerSupport {

    private static final int SCAN_INTERVAL = 60;    //check the cust scripts every 60sec
    private static final String LOCATION_TYPE_PROPERTY = "location_type";
    private static final String LOCATION_PATH_PROPERTY = "location_path";
    private static final String FILENAME_TEMPLATE = "casa-external_{0}.py";

    @Inject
    private Logger logger;

    @Inject
    private TimerService timerService;

    @Inject
    private ConfigurationHandler confHandler;

    @Inject
    private LdapService ldapService;

    @Inject
    private ExtensionsManager extManager;

    private String scriptsJobName;
    private Map<String, Long> scriptFingerPrints;
    private String pythonLibLocation;
    private ObjectMapper mapper;

    public void init() {
        try {
            timerService.addListener(this, scriptsJobName);
            //Start in 2 seconds and repeat indefinitely
            timerService.schedule(scriptsJobName, 2, -1, SCAN_INTERVAL);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    @Override
    public String getName() {
        return scriptsJobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        Long previous, current;
        oxCustomScript script;

        boolean anyChanged = false;
        Set<String> acrs = confHandler.getSettings().getAcrPluginMap().keySet();
        acrs.retainAll(confHandler.getEnabledAcrs());

        logger.info("AuthnScriptsReloader. Running timer job for acrs: {}", acrs.toString());
        for (String acr : acrs) {
            script = getScript(acr);

            if (script != null) {
                previous = scriptFingerPrints.get(acr);
                current = scriptFingerPrint(script);
                scriptFingerPrints.put(acr, current);

                if (previous != null && !previous.equals(current)) {
                    logger.info("Changes detected in {} script", acr);
                    //the script changed... Out-of-the-box methods' scripts must not be copied
                    if (!ConfigurationHandler.DEFAULT_SUPPORTED_METHODS.contains(acr)) {
                        copyToLibsDir(script);
                    }
                    //Force extension reloading (normally to re-read configuration properties)
                    extManager.getExtensionForAcr(acr).ifPresent(AuthnMethod::reloadConfiguration);
                    anyChanged = true;
                }
            }
        }

        if (anyChanged) {
            //"touch" main script so that it gets reloaded as well
            try {
                logger.info("Touching main interception script to trigger reload by oxAuth...");
                script = getScript(ConfigurationHandler.DEFAULT_ACR);
                Map<String, String> moduleProperties = modulePropertyMap(script);
                ScriptLocationType locType = ScriptLocationType.getByValue(moduleProperties.get(LOCATION_TYPE_PROPERTY));

                switch (locType) {
                    case FILE:
                        File f = Paths.get(moduleProperties.get(LOCATION_PATH_PROPERTY)).toFile();
                        if (f.setLastModified(System.currentTimeMillis())) {
                            logger.debug("Last modified timestamp of \"{}\" has been updated", f.getPath());
                        }
                        break;
                    case LDAP:
                        Long rev = Long.valueOf(script.getRevision());
                        rev = rev == Long.MAX_VALUE ? 0 : rev;
                        script.setRevision(Long.toString(rev + 1));
                        if (ldapService.modify(script, oxCustomScript.class)) {
                            logger.debug("oxRevision updated for script '{}'", script.getDisplayName());
                        }
                        break;
                    default:
                        //Added to pass checkstyle
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                logger.warn("Main custom script could not be touched!");
                logger.info("Recent changes in dependant scripts won't take effect until a new successful reload of script succeeds");
            }
        }

    }

    @PostConstruct
    private void inited() {

        scriptsJobName = getClass().getSimpleName() + "_scripts";
        scriptFingerPrints = new HashMap<>();
        mapper = new ObjectMapper();

        //the following works fine in both windows dev environment, and linux VMs
        pythonLibLocation = Optional.ofNullable(System.getenv("PYTHON_HOME")).orElse("/opt/jython");
        pythonLibLocation += File.separator + "Lib";    //Capitalized... yes!
        logger.info("Using {} as jython's lib path", pythonLibLocation);

    }

    private oxCustomScript getScript(String acr) {

        oxCustomScript script = new oxCustomScript();
        script.setDisplayName(acr);
        List<oxCustomScript> scripts = ldapService.find(script, oxCustomScript.class, ldapService.getCustomScriptsDn());
        return  scripts.size() == 0 ? null : scripts.get(0);

    }

    private void copyToLibsDir(oxCustomScript script) {

        try {
            String acr = script.getDisplayName();
            byte[] contents = getScriptContents(script);

            if (contents != null) {
                Path destPath = Paths.get(pythonLibLocation, MessageFormat.format(FILENAME_TEMPLATE, acr));
                Files.write(destPath, contents);
                logger.trace("The script for acr '{}' has been copied to {}", acr, destPath.toString());
            } else {
                logger.warn("The script for acr '{}' was not copied to jython's lib path", acr);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private byte[] getScriptContents(oxCustomScript script) {

        byte[] bytes = null;
        String acr = script.getDisplayName();
        try {
            Map<String, String> moduleProperties = modulePropertyMap(script);
            ScriptLocationType locType = ScriptLocationType.getByValue(moduleProperties.get(LOCATION_TYPE_PROPERTY));

            switch (locType) {
                case FILE:
                    bytes = Files.readAllBytes(Paths.get(moduleProperties.get(LOCATION_PATH_PROPERTY)));
                    break;
                case LDAP:
                    bytes = script.getScript().getBytes(Charset.forName("utf-8"));
                    break;
                default:
                    throw new Exception("Unknown 'location_type' value for script " + acr);
            }
        } catch (Exception e) {
            logger.error("getScriptContents. There was an error reading the bytes of script '{}': {}", acr, e.getMessage());
        }
        return bytes;

    }

    private Map<String, String> modulePropertyMap(oxCustomScript script) {

        Map<String, String> map = new HashMap<>();
        for (String mprop : script.getModuleProperties()) {
            try {
                SimpleExtendedCustomProperty p = mapper.readValue(mprop, new TypeReference<SimpleExtendedCustomProperty>() {});
                map.put(p.getValue1(), p.getValue2());
            } catch (Exception e) {
                logger.error("modulePropertyMap. Error while parsing module properties of script '{}': {}", script.getDisplayName(), e.getMessage());
            }
        }
        return map;

    }

    private Long scriptFingerPrint(oxCustomScript script) {

        Long fingerPrint = null;
        String acr = script.getDisplayName();
        try {
            Map<String, String> moduleProperties = modulePropertyMap(script);
            ScriptLocationType locType = ScriptLocationType.getByValue(moduleProperties.get(LOCATION_TYPE_PROPERTY));

            switch (locType) {
                case FILE:
                    fingerPrint = Paths.get(moduleProperties.get(LOCATION_PATH_PROPERTY)).toFile().lastModified();
                    break;
                case LDAP:
                    fingerPrint = Long.valueOf(script.getRevision());
                    break;
                default:
                    throw new Exception("Unknown 'location_type' value for script " + acr);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return fingerPrint;

    }

}
