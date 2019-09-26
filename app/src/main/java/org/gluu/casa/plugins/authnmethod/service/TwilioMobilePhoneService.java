/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.plugins.authnmethod.service;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.factory.MessageFactory;
import com.twilio.sdk.resource.instance.Message;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.authnmethod.OTPTwilioExtension;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

/**
 * An app. scoped bean to serve the purpose of sending SMS using the Twilio service
 * @author jgomer
 */
@Named
@ApplicationScoped
public class TwilioMobilePhoneService extends MobilePhoneService {

    @Inject
    private Logger logger;

    private String fromNumber;
    private MessageFactory messageFactory;

    @PostConstruct
    private void inited() {
        reloadConfiguration();
    }

    @Override
    public void reloadConfiguration() {

        props = persistenceService.getCustScriptConfigProperties(OTPTwilioExtension.ACR);

        if (props == null) {
            logger.warn("Config. properties for custom script '{}' could not be read. Features related to {} will not be accessible",
                    OTPTwilioExtension.ACR, OTPTwilioExtension.ACR.toUpperCase());
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

    @Override
    public SMSDeliveryStatus sendSMS(String number, String body) {

        SMSDeliveryStatus status;
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
                        status = SMSDeliveryStatus.DELIVERY_FAILED;
                        break;
                    case "undelivered":
                        status = SMSDeliveryStatus.UNDELIVERED;
                        break;
                    default:
                        status = SMSDeliveryStatus.SUCCESS;
                        logger.info("Message \"{}\" sent to #{}", body, number);
                }
            } catch (Exception e) {
                status = SMSDeliveryStatus.PROVIDER_ERROR;
                logger.error("No message was sent, error was: {}", e.getMessage());
            }
        } else {
            status = SMSDeliveryStatus.APP_SETUP_ERROR;
            logger.info("No message was sent, messageFactory was not initialized properly");
        }
        return status;

    }

}
