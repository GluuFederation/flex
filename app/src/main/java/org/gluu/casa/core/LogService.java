/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.Appender;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.LoggerConfig;
import org.gluu.casa.misc.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;
import java.util.jar.JarInputStream;

/**
 * Most methods in this class assumes the SLF4J binding employed is Log4j2. If binding is changed, methods need to be
 * updated.
 * @author jgomer
 */
@Named
@ApplicationScoped
public class LogService {

    @Inject
    private Logger logger;

    private static final String MAIN_LOGGER = "org.gluu.casa";

    private Set<String> loggerNames;
    private Appender mainAppender;
    private LoggerContext loggerContext;

    @Produces
    public Logger loggerInstance(InjectionPoint ip) {
        return LoggerFactory.getLogger(ip.getMember().getDeclaringClass().getName());
    }

    @PostConstruct
    private void inited() {
        loggerNames = new HashSet<>();
        loggerNames.add(MAIN_LOGGER);
        loggerNames.add("org.gluu.casa.timer");
        loggerContext = LoggerContext.getContext(false);
        mainAppender = loggerContext.getConfiguration().getLoggerConfig(MAIN_LOGGER).getAppenders().get("LOG_FILE");
    }

    public void addLoger(Path path) {

        try {
            if (Utils.isJarFile(path)) {
                try (JarInputStream jis = new JarInputStream(new BufferedInputStream(new FileInputStream(path.toString())), false)) {
                    String name = jis.getManifest().getMainAttributes().getValue("Logger-Name");
                    if (name != null && !loggerNames.contains(name)) {
                        logger.info("Adding logger for {}", name);
                        Level level = getLoggingLevel();
                        LoggerConfig loggerConfig = new LoggerConfig(name, level, false);
                        loggerConfig.addAppender(mainAppender, level, null);
                        loggerContext.getConfiguration().addLogger(name, loggerConfig);
                        loggerNames.add(name);
                        //loggerContext.updateLoggers();
                    }
                }
            } else {
                logger.warn("Not implemented: No logger can be configured for a directory-based plugin yet");
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    public String updateLoggingLevel(String levelInConfFile) {

        String currentLevl = getLoggingLevel().name();
        String value = currentLevl;

        if (Utils.isEmpty(levelInConfFile)) {
            logger.info("Defaulting to {} for log level", currentLevl);
        } else {
            try {
                Level.valueOf(levelInConfFile);
                setLoggingLevel(levelInConfFile);
                logger.info("Using {} for log level", levelInConfFile);
                value = levelInConfFile;
            } catch (Exception e) {
                logger.warn("Log level {} supplied is not valid. Defaulting to {}", levelInConfFile, currentLevl);
            }
        }
        return value;

    }

    private void setLoggingLevel(String strLevel) {
        Level newLevel = Level.toLevel(strLevel);
        loggerNames.forEach(name -> org.apache.logging.log4j.core.config.Configurator.setLevel(name, newLevel));
    }

    private Level getLoggingLevel() {
        LoggerContext loggerContext = LoggerContext.getContext(false);
        return loggerContext.getConfiguration().getLoggerConfig(MAIN_LOGGER).getLevel();
    }

}
