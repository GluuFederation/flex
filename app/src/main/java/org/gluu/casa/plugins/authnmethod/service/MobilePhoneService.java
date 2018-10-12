/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.factory.MessageFactory;
import com.twilio.sdk.resource.instance.Message;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.gluu.casa.core.ldap.PersonMobile;
import org.gluu.casa.core.pojo.VerifiedMobile;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.OTPSmsExtension;
import org.gluu.casa.plugins.authnmethod.rs.status.sms.SendCode;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * An app. scoped bean to serve the purpose of sending SMS using the Twilio service
 * @author jgomer
 */
@Named
@ApplicationScoped
public class MobilePhoneService extends BaseService {

    @Inject
    private Logger logger;

    private String fromNumber;
    private MessageFactory messageFactory;

    @PostConstruct
    private void inited() {
        reloadConfiguration();
    }

    public void reloadConfiguration() {

        props = ldapService.getCustScriptConfigProperties(OTPSmsExtension.ACR);

        if (props == null) {
            logger.warn("Config. properties for custom script '{}' could not be read. Features related to {} will not be accessible",
                    OTPSmsExtension.ACR, OTPSmsExtension.ACR.toUpperCase());
        } else {
            String sid = props.get("twilio_sid");
            String token = props.get("twilio_token");
            fromNumber = props.get("from_number");

            if (Stream.of(sid, token, fromNumber).anyMatch(Utils::isEmpty)) {
                logger.warn("Error parsing SMS settings. Please check LDAP entry of SMS custom script");
            } else {
                TwilioRestClient client = new TwilioRestClient(sid, token);
                messageFactory = client.getAccount().getMessageFactory();
            }
        }

    }

    public boolean isNumberRegistered(String number) {

        PersonMobile person = new PersonMobile();
        person.setMobile(number);
        List<PersonMobile> matchingPeople = ldapService.find(person, PersonMobile.class, ldapService.getPeopleDn());
        return Utils.isNotEmpty(matchingPeople);

    }

    public SendCode sendSMS(String number, String body) {

        SendCode status;
        if (messageFactory != null) {

            try {
                List<NameValuePair> messageParams = new ArrayList<>();
                messageParams.add(new BasicNameValuePair("From", fromNumber));
                messageParams.add(new BasicNameValuePair("To", number));
                messageParams.add(new BasicNameValuePair("Body", body));

                Message message = messageFactory.create(messageParams);
                String statusMsg = message.getStatus().toLowerCase();

                logger.info("Message delivery status was {}", statusMsg);
                switch (statusMsg) {
                    case "failed":
                        status = SendCode.DELIVERY_FAILED;
                        break;
                    case "undelivered":
                        status = SendCode.UNDELIVERED;
                        break;
                    default:
                        status = SendCode.SUCCESS;
                        logger.info("Message \"{}\" sent to #{}", body, number);
                }
            } catch (Exception e) {
                status = SendCode.SMS_SERVICE_ERROR;
                logger.error("No message was sent, error was: {}", e.getMessage());
            }
        } else {
            status = SendCode.APP_SETUP_ERROR;
            logger.info("No message was sent, messageFactory was not initialized properly");
        }
        return status;

    }

    public boolean updateMobilePhonesAdd(String userId, List<VerifiedMobile> mobiles, VerifiedMobile newPhone) {

        boolean success = false;
        try {
            List<VerifiedMobile> vphones = new ArrayList<>(mobiles);
            if (newPhone != null) {
                vphones.add(newPhone);
            }

            String[] numbers = vphones.stream().map(VerifiedMobile::getNumber).toArray(String[]::new);
            String json = numbers.length > 0 ? mapper.writeValueAsString(Collections.singletonMap("phones", vphones)) : null;

            logger.debug("Updating phones for user '{}'", userId);
            PersonMobile person = ldapService.get(PersonMobile.class, ldapService.getPersonDn(userId));
            person.setMobileDevices(Utils.arrayFromValue(String.class, json));
            person.setMobile(numbers);

            success = ldapService.modify(person, PersonMobile.class);

            if (success && newPhone != null) {
                //modify list only if LDAP update took place
                mobiles.add(newPhone);
                logger.debug("Added {}", newPhone.getNumber());
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return success;

    }

    public boolean addPhone(String userId, VerifiedMobile newPhone) {
        return updateMobilePhonesAdd(userId, getVerifiedPhones(userId), newPhone);
    }

    public int getPhonesTotal(String userId) {

        int total = 0;
        try {
            PersonMobile person = ldapService.get(PersonMobile.class, ldapService.getPersonDn(userId));
            total = person.getMobileAsList().size();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return total;

    }

    public List<VerifiedMobile> getVerifiedPhones(String userId) {

        List<VerifiedMobile> phones = new ArrayList<>();
        try {
            PersonMobile person = ldapService.get(PersonMobile.class, ldapService.getPersonDn(userId));
            String json = person.getMobileDevices();
            json = Utils.isEmpty(json) ? "[]" : mapper.readTree(json).get("phones").toString();

            List<VerifiedMobile> vphones = mapper.readValue(json, new TypeReference<List<VerifiedMobile>>() { });
            phones = person.getMobileAsList().stream().map(str -> getExtraPhoneInfo(str, vphones)).sorted()
                    .collect(Collectors.toList());
            logger.trace("getVerifiedPhones. User '{}' has {}", userId, phones.stream().map(VerifiedMobile::getNumber).collect(Collectors.toList()));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return phones;

    }

    /**
     * Creates an instance of VerifiedMobile by looking up in the list of VerifiedPhones passed. If the item is not found
     * in the list, it means the user had already that phone added by means of another application, ie. oxTrust. In this
     * case the resulting object will not have properties like nickname, etc. Just the phone number
     * @param number Phone number (LDAP attribute "mobile" inside a user entry)
     * @param list List of existing phones enrolled. Ideally, there is an item here corresponding to the uid number passed
     * @return VerifiedMobile object
     */
    private VerifiedMobile getExtraPhoneInfo(String number, List<VerifiedMobile> list) {
        //Complements current phone with extra info in the list if any
        VerifiedMobile phone = new VerifiedMobile(number);

        Optional<VerifiedMobile> extraInfoPhone = list.stream().filter(ph -> number.equals(ph.getNumber())).findFirst();
        if (extraInfoPhone.isPresent()) {
            phone.setAddedOn(extraInfoPhone.get().getAddedOn());
            phone.setNickName(extraInfoPhone.get().getNickName());
        }
        return phone;
    }

}
