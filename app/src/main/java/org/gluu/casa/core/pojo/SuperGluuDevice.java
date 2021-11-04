package org.gluu.casa.core.pojo;

import io.jans.as.model.fido.u2f.protocol.DeviceData;

/**
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
