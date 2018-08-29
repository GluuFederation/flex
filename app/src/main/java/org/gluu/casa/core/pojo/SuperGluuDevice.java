/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.core.pojo;

import org.xdi.oxauth.model.fido.u2f.protocol.DeviceData;

/**
 * Created by jgomer on 2017-09-06.
 * Represents a registered credential corresponding to a supergluu device
 */
public class SuperGluuDevice extends FidoDevice {

    private DeviceData deviceData;

    public SuperGluuDevice() { }

    public DeviceData getDeviceData() {
        return deviceData;
    }

    public void setDeviceData(DeviceData deviceData) {
        this.deviceData = deviceData;
    }

}
