package org.gluu.casa.ui.vm.admin;

import org.gluu.casa.core.LogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.Init;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.zk.ui.select.annotation.VariableResolver;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zkplus.cdi.DelegatingVariableResolver;

import java.util.ArrayList;
import java.util.List;

/**
 * @author jgomer
 */
@VariableResolver(DelegatingVariableResolver.class)
public class LogLevelViewModel extends MainViewModel {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private List<String> logLevels;
    private String selectedLogLevel;

    @WireVariable
    private LogService logService;

    public List<String> getLogLevels() {
        return logLevels;
    }

    public String getSelectedLogLevel() {
        return selectedLogLevel;
    }

    @Init
    public void init() {
        //it seems ZK doesn't like ummodifiable lists
        logLevels = new ArrayList(LogService.SLF4J_LEVELS);
        selectedLogLevel = getSettings().getLogLevel();
    }

    @NotifyChange({"selectedLogLevel"})
    @Command
    public void change(@BindingParam("level") String newLevel) {

        //here it is assumed that changing log level is always a successful operation
        logService.updateLoggingLevel(newLevel);
        selectedLogLevel = newLevel;
        getSettings().setLogLevel(newLevel);

        if (updateMainSettings()) {
            logger.info("Log level changed to {}", newLevel);
        }

    }

}
