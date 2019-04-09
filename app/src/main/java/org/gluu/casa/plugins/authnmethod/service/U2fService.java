package org.gluu.casa.plugins.authnmethod.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.codehaus.jackson.type.TypeReference;
import org.gluu.casa.conf.MainSettings;
import org.gluu.casa.conf.U2fSettings;
import org.gluu.casa.core.ConfigurationHandler;
import org.gluu.casa.core.pojo.SecurityKey;
import org.gluu.casa.plugins.authnmethod.SecurityKeyExtension;
import org.gluu.casa.plugins.authnmethod.conf.U2FConfig;
import org.slf4j.Logger;
import org.gluu.oxauth.client.fido.u2f.FidoU2fClientFactory;
import org.gluu.oxauth.client.fido.u2f.RegistrationRequestService;
import org.gluu.oxauth.client.fido.u2f.U2fConfigurationService;
import org.gluu.oxauth.model.fido.u2f.U2fConfiguration;
import org.gluu.oxauth.model.fido.u2f.protocol.RegisterRequestMessage;
import org.gluu.oxauth.model.fido.u2f.protocol.RegisterStatus;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.*;

/**
 * An app. scoped bean that encapsulates logic related to management of registration requests for u2f devices
 * @author jgomer
 */
@Named
@ApplicationScoped
public class U2fService extends FidoService {

    @Inject
    private Logger logger;

    @Inject
    private MainSettings settings;

    private U2FConfig conf;
    private RegistrationRequestService registrationRequestService;

    @PostConstruct
    private void inited() {
        reloadConfiguration();
    }

    public void reloadConfiguration() {

        conf = new U2FConfig();
        String metadataUri = Optional.ofNullable(settings.getU2fSettings()).map(U2fSettings::getRelativeMetadataUri)
                .orElse(".well-known/fido-configuration");
        conf.setEndpointUrl(String.format("%s/%s", persistenceService.getIssuerUrl(), metadataUri));

        try {
            props = persistenceService.getCustScriptConfigProperties(SecurityKeyExtension.ACR);
            conf.setAppId(persistenceService.getCustScriptConfigProperties(ConfigurationHandler.DEFAULT_ACR).get("u2f_app_id"));

            logger.info("U2f settings found were: {}", mapper.writeValueAsString(conf));

            U2fConfigurationService u2fCfgServ = FidoU2fClientFactory.instance().createMetaDataConfigurationService(conf.getEndpointUrl());
            U2fConfiguration metadataConf = u2fCfgServ.getMetadataConfiguration();
            registrationRequestService = FidoU2fClientFactory.instance().createRegistrationRequestService(metadataConf);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    public int getDevicesTotal(String userId, boolean active) {
        return getDevicesTotal(conf.getAppId(), userId, active);
    }

    public List<SecurityKey> getDevices(String userId, boolean active) {
        return getSortedDevices(userId, active, conf.getAppId(), SecurityKey.class);
    }

    /**
     * Triggers a registration request to a U2F endpoint and outputs the request message returned by the service in form of JSON
     * @param userName As required per org.gluu.oxauth.client.fido.u2f.RegistrationRequestService#startRegistration
     * @param enrollmentCode A previously generated random code stored under user's LDAP entry
     * @return Json string representation
     * @throws Exception Network problem, De/Serialization error, ...
     */
    public String generateJsonRegisterMessage(String userName, String enrollmentCode) throws Exception {

        RegisterRequestMessage message = registrationRequestService.startRegistration(userName, conf.getAppId(), null, enrollmentCode);
        Map<String, Object> request = codehausMapper.convertValue(message, new TypeReference<Map<String, Object>>() { });
        request.remove("authenticateRequests"); //Needed, otherwise chrome complains
        logger.info("Beginning registration start with uid={}, app_id={}", userName, conf.getAppId());
        return mapper.writeValueAsString(request);

    }

    /**
     * Executes the finish registration step of the U2F service
     * @param userName As required per org.gluu.oxauth.client.fido.u2f.RegistrationRequestService#finishRegistration
     * @param response This is the Json response obtained in the web browser after calling the u2f.register function in Javascript
     */
    public void finishRegistration(String userName, String response) {
        //first parameter is not used in current implementation, see: org.gluu.oxauth.ws.rs.fido.u2f.U2fRegistrationWS#finishRegistration
        RegisterStatus status = registrationRequestService.finishRegistration(userName, response);
        logger.info("Response of finish registration: {}", status.getStatus());
    }

    public String getRegistrationResult(String jsonString) throws Exception {

        String value = null;
        JsonNode tree = mapper.readTree(jsonString);

        logger.info("Finished registration start with response: {}", jsonString);
        JsonNode tmp = tree.get("errorCode");

        if (tmp != null) {
            try {
                int code = tmp.asInt();
                if (code > 0) {
                    value = U2fClientCodes.get(code).toString();
                    logger.error("Registration failed with error: {}", value);
                    value = value.toLowerCase();
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                value = e.getMessage();
            }
        }
        return value;

    }

    public SecurityKey getLatestSecurityKey(String userId, long time) {

        SecurityKey sk = null;
        try {
            sk = getLatestFidoDevice(userId, time, conf.getAppId(), SecurityKey.class);
            if (sk != null && sk.getNickName() != null) {
                sk = null;    //should have no name
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return sk;

    }

}
