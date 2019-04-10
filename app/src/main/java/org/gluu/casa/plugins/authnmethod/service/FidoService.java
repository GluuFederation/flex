package org.gluu.casa.plugins.authnmethod.service;

import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.core.model.DeviceRegistration;
import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.core.pojo.SuperGluuDevice;
import org.gluu.oxauth.model.fido.u2f.DeviceRegistrationStatus;
import org.gluu.oxauth.model.fido.u2f.protocol.DeviceData;
import org.slf4j.Logger;
import org.zkoss.util.Pair;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author jgomer
 */
public class FidoService extends BaseService {

    @Inject
    private Logger logger;

    @Inject
    MainSettings settings;

    public boolean updateDevice(FidoDevice device) {

        boolean success = false;
        DeviceRegistration deviceRegistration = getDeviceRegistrationFor(device);
        if (deviceRegistration != null) {
            deviceRegistration.setDisplayName(device.getNickName());
            success = persistenceService.modify(deviceRegistration);
        }
        return success;

    }

    public boolean removeDevice(FidoDevice device) {

        boolean success = false;
        DeviceRegistration deviceRegistration = getDeviceRegistrationFor(device);
        if (deviceRegistration != null) {
            success = persistenceService.delete(deviceRegistration);
        }
        return success;

    }

    public int getDevicesTotal(String appId, String userId, boolean active) {

        int total = 0;
        try {
            total = getRegistrations(appId, userId, active).size();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return total;

    }

    public <T extends FidoDevice> T getLatestFidoDevice(String userId, long time, String oxApp, Class<T> clazz) throws Exception {
        List<T> list = getDevices(userId, true, oxApp, clazz);
        logger.debug("getLatestFidoDevice. list is {}", list.stream().map(FidoDevice::getId).collect(Collectors.toList()).toString());
        return getRecentlyCreatedDevice(list, time);
    }

    private DeviceRegistration getDeviceRegistrationFor(FidoDevice device) {

        String id = device.getId();
        DeviceRegistration deviceRegistration = new DeviceRegistration();
        deviceRegistration.setBaseDn(persistenceService.getPeopleDn());
        deviceRegistration.setOxId(id);

        List<DeviceRegistration> list = persistenceService.find(deviceRegistration);
        if (list.size() == 1) {
            return list.get(0);
        } else {
            logger.warn("Search for fido device registration with oxId {} returned {} results!", id, list.size());
            return null;
        }

    }

    private List<DeviceRegistration> getRegistrations(String appId, String userId, boolean active) {

        String parentDn = String.format("ou=fido,%s", persistenceService.getPersonDn(userId));
        DeviceRegistration deviceRegistration = new DeviceRegistration();
        deviceRegistration.setBaseDn(parentDn);
        deviceRegistration.setOxApplication(appId);
        deviceRegistration.setOxStatus(active ? DeviceRegistrationStatus.ACTIVE.getValue() : DeviceRegistrationStatus.COMPROMISED.getValue());

        return persistenceService.find(deviceRegistration);

    }

    /**
     * Returns a list of FidoDevice instances found under the given branch that matches the oxApplication value given and
     * whose oxStatus attribute equals to "active"
     * @param userId
     * @param oxApplication Value to match for oxApplication attribute (see LDAP object class DeviceRegistration)
     * @param clazz Any subclass of FidoDevice
     * @param <T>
     * @return List of FidoDevices
     */
    private <T extends FidoDevice> List<T> getDevices(String userId, boolean active, String oxApplication, Class<T> clazz) throws Exception {

        List<T> devices = new ArrayList<>();
        List<DeviceRegistration> list = getRegistrations(oxApplication, userId, active);

        for (DeviceRegistration deviceRegistration : list) {
            T device = clazz.getConstructor().newInstance();

            if (clazz.equals(SuperGluuDevice.class)) {
                //DeviceData class is annotated with org.codehaus and has no default constructor so using normal mapper gives trouble
                DeviceData data = codehausMapper.readValue(deviceRegistration.getDeviceData(), DeviceData.class);
                ((SuperGluuDevice) device).setDeviceData(data);
            }
            device.setApplication(deviceRegistration.getOxApplication());
            device.setNickName(deviceRegistration.getDisplayName());
            device.setStatus(deviceRegistration.getOxStatus());
            device.setId(deviceRegistration.getOxId());
            device.setCreationDate(deviceRegistration.getCreationDate());
            device.setCounter(deviceRegistration.getOxCounter());
            device.setLastAccessTime(deviceRegistration.getLastAccessTime());

            devices.add(device);
        }
        return devices;

    }

    <T extends FidoDevice> List<T> getSortedDevices(String userId, boolean active, String appId, Class<T> clazz) {

        List<T> devices = new ArrayList<>();
        try {
            devices = getDevices(userId, active, appId, clazz).stream().sorted().collect(Collectors.toList());
            logger.trace("getDevices. User '{}' has {}", userId, devices.stream().map(FidoDevice::getId).collect(Collectors.toList()));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return devices;
    }



    /**
     * Chooses one device from a list of devices, such that its creation time is the closest to the timestamp given
     * @param devices A non-null list of fido devices
     * @param time A timestamp as milliseconds elapsed from the "epoch"
     * @param <T>
     * @return The best matching device (only devices added before the time supplied are considered). Null if no suitable
     * device could be found
     */
    private <T extends FidoDevice> T getRecentlyCreatedDevice(List<T> devices, long time) {

        long[] diffs = devices.stream().mapToLong(key -> time - key.getCreationDate().getTime()).toArray();

        logger.trace("getRecentlyCreatedDevice. diffs {}", Arrays.asList(diffs));
        //Search for the smallest time difference
        int i;
        Pair<Long, Integer> min = new Pair<>(Long.MAX_VALUE, -1);
        //it always holds that diffs.length==devices.size()
        for (i = 0; i < diffs.length; i++) {
            if (diffs[i] >= 0 && min.getX() > diffs[i]) {  //Only search non-negative differences
                min = new Pair<>(diffs[i], i);
            }
        }

        i = min.getY();
        return i == -1 ? null : devices.get(i);

    }

}
