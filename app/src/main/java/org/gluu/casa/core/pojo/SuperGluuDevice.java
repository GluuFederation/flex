package org.gluu.casa.core.pojo;

import org.gluu.oxauth.model.fido.u2f.protocol.DeviceData;

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
