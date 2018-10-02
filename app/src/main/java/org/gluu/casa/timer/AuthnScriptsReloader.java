/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.timer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.core.LdapService;
import org.gluu.casa.core.TimerService;
import org.gluu.casa.core.ldap.oxCustomScript;
import org.gluu.casa.extension.AuthnMethod;
import org.gluu.casa.misc.Utils;
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
    private static final List<String> NOT_REPLACEABLE_SCRIPTS = ConfigurationHandler.DEFAULT_SUPPORTED_METHODS;

    @Inject
    private Logger logger;

    @Inject
    private TimerService timerService;

    @Inject
    private MainSettings confSettings;

    @Inject
    private LdapService ldapService;

    @Inject
    private ExtensionsManager extManager;

    private String scriptsJobName;
    private Map<String, Long> scriptFingerPrints;
    private String pythonLibLocation;
    private ObjectMapper mapper;

    public void init(int gap) {
        try {
            timerService.addListener(this, scriptsJobName);
            //Start in 2 seconds and repeat indefinitely
            timerService.schedule(scriptsJobName, gap, -1, SCAN_INTERVAL);
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

        //A flag used to force a reload of main cust script
        boolean reload = false;
        Set<String> acrs = confSettings.getAcrPluginMap().keySet();
        List<String> toBeRemoved = new ArrayList<>();

        logger.info("AuthnScriptsReloader. Running timer job for acrs: {}", acrs.toString());
        //In Gluu <= 3.1.4, every time a single script is changed via oxTrust, all custom scripts are reloaded. This is
        //not the case when for instance, the oxRevision attribute of a cust script is altered manually (as when developing)
        //In the future, oxTrust should only reload the script that has changed for performance reasons.
        for (String acr : acrs) {
            script = getScript(acr);

            if (script != null) {
                if (script.isEnabled()) {
                    previous = scriptFingerPrints.get(acr);
                    current = scriptFingerPrint(script);
                    scriptFingerPrints.put(acr, current);

                    if (!current.equals(previous)) {
                        //When previous is null, it means it's the first run of this timer or the method was checked enabled in methods.zul
                        //When non null, it means this script is known from a previous run of the timer and its contents changed
                        //Under any of these circumstances we force a reload of main cust script in the end
                        reload = true;
                        if (previous != null) {
                            logger.info("Changes detected in {} script", acr);
                            //Force extension reloading (normally to re-read configuration properties)
                            extManager.getExtensionForAcr(acr).ifPresent(AuthnMethod::reloadConfiguration);
                        }
                        //Out-of-the-box script methods must not be copied. This avoids transfering the default scripts
                        //bundled with CE which are not suitable for Casa
                        if (!NOT_REPLACEABLE_SCRIPTS.contains(acr)) {
                            copyToLibsDir(script);
                        }
                    }
                } else {
                    //This accounts for the case in which the method is part of the mapping, but admin has externally disabled
                    //the cust script. This helps keep in sync the methods supported wrt to enabled methods in oxTrust GUI
                    toBeRemoved.add(acr);
                }
            }
        }

        if (toBeRemoved.size() > 0) {
            logger.info("The following scripts were externally disabled: {}", toBeRemoved.toString());
            logger.warn("Corresponding acrs will be removed from Gluu Casa configuration file");
            //Remove from the mapping
            acrs.removeAll(toBeRemoved);
            toBeRemoved.forEach(acr -> scriptFingerPrints.remove(acr));

            try {
                //Save mapping changes to disk
                confSettings.save();
                reload = true;
            } catch (Exception e) {
                logger.error("Failure to update configuration file!");
            }
        }

        if (!reload) {
            //It may happen that a method was disabled in method.zul, this should trigger a reload
            //An easy way to detect this is when scriptFingerPrints contains more elements than acrs sets
            reload = !acrs.containsAll(scriptFingerPrints.keySet());
        }

        if (reload) {
            //"touch" main script so that it gets reloaded. This helps the script to keep the list of supported methods up-to-date
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
                        } else {
                            logger.warn("Timestamp of \"{}\" could not be altered. Ensure jetty user has enough permissions");
                            logger.error("Latest changes to custom scripts were not picked");
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
        pythonLibLocation = Utils.onWindows() ? System.getenv("PYTHON_HOME") + File.separator + "Lib" : "/opt/gluu/python/libs";
        logger.info("Using {} as python's lib path", pythonLibLocation);

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
