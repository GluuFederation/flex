package org.gluu.casa.plugins.authnmethod.service;

import org.gluu.casa.core.pojo.FidoDevice;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.plugins.authnmethod.SecurityKey2Extension;
import org.gluu.casa.rest.RSUtils;
import org.gluu.oxauth.fido2.client.AttestationService;
import org.gluu.oxauth.fido2.model.entry.Fido2RegistrationEntry;
import org.gluu.oxauth.fido2.model.entry.Fido2RegistrationStatus;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.core.Response;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Named
@ApplicationScoped
public class Fido2Service extends BaseService {

    @Inject
    private Logger logger;

    private ResteasyClient client;

    private AttestationService attestationService;

    @PostConstruct
    private void inited() {
        reloadConfiguration();
    }

    public void reloadConfiguration() {

        props = persistenceService.getCustScriptConfigProperties(SecurityKey2Extension.ACR);
        String tmp = getScriptPropertyValue("fido2_server_uri");

        if (tmp == null) {
            logger.error("No fido2_server_uri param found in fido2 script");
            logger.info("Fido 2 integration will not work properly");
        } else {
            try {
                tmp += "/.well-known/fido2-configuration";
                logger.info("Retrieving contents of URL {}", tmp);
                String attestationURL = mapper.readTree(new URL(tmp)).get("attestation").get("base_path").asText();

                logger.info("Base path is {}", attestationURL);
                client = RSUtils.getClient();
                attestationService = client.target(attestationURL).proxy(AttestationService.class);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }

    }

    public int getDevicesTotal(String userId, boolean active) {
        return persistenceService.count(getSampleRegistrationEntry(userId, active));
    }

    public List<SecurityKey> getDevices(String userId, boolean active) {

        List<SecurityKey> devices = new ArrayList<>();
        Fido2RegistrationEntry rentry = getSampleRegistrationEntry(userId, active);

        logger.trace("Finding Fido 2 devices with state={} for user={}", active ? Fido2RegistrationStatus.registered : Fido2RegistrationStatus.pending, userId);
        for (Fido2RegistrationEntry entry : persistenceService.find(rentry)) {
            SecurityKey sk = new SecurityKey();
            sk.setId(entry.getId());
            sk.setCreationDate(entry.getCreationDate());
            sk.setNickName(entry.getDisplayName());
            devices.add(sk);
        }
        return devices.stream().sorted().collect(Collectors.toList());

    }

    private Fido2RegistrationEntry getSampleRegistrationEntry(String userId, boolean active) {

        String dn = String.format("ou=fido2_register,%s", persistenceService.getPersonDn(userId));
        Fido2RegistrationEntry rentry = new Fido2RegistrationEntry();

        rentry.setBaseDn(dn);
        if (active) {
            rentry.setRegistrationStatus(Fido2RegistrationStatus.registered);
        }

        return rentry;

    }

    public boolean updateDevice(FidoDevice device) {

        boolean success = false;
        Fido2RegistrationEntry deviceRegistration = getDeviceRegistrationFor(device);
        if (deviceRegistration != null) {
            deviceRegistration.setDisplayName(device.getNickName());
            success = persistenceService.modify(deviceRegistration);
        }
        return success;

    }

    public boolean removeDevice(FidoDevice device) {

        boolean success = false;
        Fido2RegistrationEntry rentry = getDeviceRegistrationFor(device);
        if (rentry != null) {
            success = persistenceService.delete(rentry);
        }
        return success;

    }

    private Fido2RegistrationEntry getDeviceRegistrationFor(FidoDevice device) {

        String id = device.getId();
        Fido2RegistrationEntry deviceRegistration = new Fido2RegistrationEntry();
        deviceRegistration.setBaseDn(persistenceService.getPeopleDn());
        deviceRegistration.setId(id);

        List<Fido2RegistrationEntry> list = persistenceService.find(deviceRegistration);
        if (list.size() == 1) {
            return list.get(0);
        } else {
            logger.warn("Search for fido 2 device registration with oxId {} returned {} results!", id, list.size());
            return null;
        }

    }

    public String doRegister(String userName, String displayName) throws Exception {

        Map<String, String> map = new HashMap<>();
        map.put("username", userName);
        map.put("displayName", displayName);
        return attestationService.register(mapper.writeValueAsString(map)).readEntity(String.class);

    }

    public boolean verifyRegistration(String tokenResponse) throws Exception {
        return Response.Status.OK.getStatusCode() == attestationService.verify(tokenResponse).getStatus();
    }

    public SecurityKey getLatestSecurityKey(String userId, long time) {

        SecurityKey sk = null;
        try {
            List<SecurityKey> list = getDevices(userId, false);
            sk = FidoService.getRecentlyCreatedDevice(list, time);
            if (sk != null && sk.getNickName() != null) {
                sk = null;    //should have no name
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return sk;

    }

}
