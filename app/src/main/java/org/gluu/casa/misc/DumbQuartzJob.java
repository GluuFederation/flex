/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.misc;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

/**
 * A job that does nothing ({@link #execute(JobExecutionContext) execute} method empty). Very useful...
 * @author jgomer
 */
public class DumbQuartzJob implements Job {

    public void execute(JobExecutionContext context) throws JobExecutionException { }

}
