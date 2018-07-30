/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.credmanager.extension;

import org.gluu.credmanager.credential.BasicCredential;

import java.util.List;

/**
 * @author jgomer
 */
public interface UserCredentialsInfo {

    List<BasicCredential> getEnrolledCreds(String id);
    int getTotalUserCreds(String id);

}
