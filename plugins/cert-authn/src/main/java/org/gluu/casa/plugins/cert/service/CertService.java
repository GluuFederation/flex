package org.gluu.casa.plugins.cert.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gluu.casa.core.model.BasePerson;
import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.plugins.cert.CertAuthenticationExtension;
import org.gluu.casa.plugins.cert.model.CertPerson;
import org.gluu.casa.plugins.cert.model.Certificate;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.oxauth.cert.fingerprint.FingerprintHelper;
import org.gluu.oxauth.cert.validation.*;
import org.gluu.oxauth.cert.validation.model.ValidationStatus;
import org.gluu.oxauth.model.util.CertUtils;
import org.gluu.search.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.stream.Collectors;

import static org.gluu.casa.plugins.cert.service.UserCertificateMatch.*;

public class CertService {

    private static final String ACR = CertAuthenticationExtension.ACR;
    private static final int DEFAULT_CRL_MAX_RESPONSE_SIZE = 5 * 1024 * 1024;   //5MB

    private static final String CERT_PREFIX = "cert:";

    private static CertService singleton;

    private Logger logger = LoggerFactory.getLogger(getClass());

    private ObjectMapper mapper;
    private IPersistenceService persistenceService;
    private Map<String, String> scriptProperties;
    private int crlMaxResponseSize;
    private List<X509Certificate> chainCerts;
    private boolean hasValidProperties;

    public static CertService getInstance() {

        if (singleton == null) {
            singleton = new CertService();
        }
        return singleton;

    }

    public boolean isHasValidProperties() {
        return hasValidProperties;
    }

    public void reloadConfiguration() {

        scriptProperties = persistenceService.getCustScriptConfigProperties(ACR);
        if (scriptProperties == null) {
            logger.warn("Config. properties for custom script '{}' could not be read!!.", ACR);
        } else {
            String paramName = "crl_max_response_size";
            try {
                crlMaxResponseSize = Integer.valueOf(scriptProperties.get(paramName));
            } catch (Exception e) {
                logger.error(e.getMessage());
                logger.warn("Using default value of {} for '{}'", DEFAULT_CRL_MAX_RESPONSE_SIZE, paramName);
            }

            paramName = "chain_cert_file_path";
            logger.info("Scanning cert chains specified in '{}' param...", paramName);

            try (InputStream is = Files.newInputStream(Paths.get(scriptProperties.get(paramName)))) {
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                chainCerts = cf.generateCertificates(is).stream().map(X509Certificate.class::cast).collect(Collectors.toList());

                logger.info("{} certs loaded", chainCerts.size());
                hasValidProperties = true;
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }

    }

    public boolean validate(X509Certificate cert) {

        boolean valid = true;
        Date date = new Date();
        logger.info("Validating certificate");

        for (VerifierType type : VerifierType.values()) {
            String param = scriptProperties.get(type.getParam());

            if (Optional.ofNullable(param).map(Boolean::valueOf).orElse(false)) {
                CertificateVerifier verifier = null;

                logger.info("Applying '{}' validator", type);
                switch (type) {
                    case GENERIC:
                        verifier = new GenericCertificateVerifier();
                        break;
                    case PATH:
                        verifier = new PathCertificateVerifier(true);
                        break;
                    case OSCP:
                        verifier = new OCSPCertificateVerifier();
                        break;
                    case CRL:
                        verifier = new CRLCertificateVerifier(crlMaxResponseSize);
                        break;
                }

                ValidationStatus.CertificateValidity validity = verifier.validate(cert, chainCerts, date).getValidity();
                if (!validity.equals(ValidationStatus.CertificateValidity.VALID)) {
                    valid = false;
                    logger.warn("Certificate validity is: {}", validity);
                    break;
                }
            }
        }
        return valid;

    }

    public UserCertificateMatch processMatch(X509Certificate certificate, String userInum, boolean enroll) {

        UserCertificateMatch status = null;
        try {
            logger.info("Matching certificate and user. Enrollment is {}", enroll);
            CertPerson person = persistenceService.get(CertPerson.class, persistenceService.getPersonDn(userInum));

            if (person == null) {
                status = UNKNOWN_USER;
            } else {
                logger.debug("Generating certificate fingerprint...");
                String fingerprint =  getFingerPrint(certificate);
                String externalUid = String.format("%s%s", CERT_PREFIX, fingerprint);

                Filter filter = Filter.createEqualityFilter("oxExternalUid", externalUid);
                List<BasePerson> people = persistenceService.find(BasePerson.class, persistenceService.getPeopleDn(), filter);

                //The list should be singleton at most
                if (people.size() > 0) {
                    if (userInum.equals(people.get(0).getInum())) {
                        status = enroll ? CERT_ENROLLED_ALREADY : SUCCESS;
                    } else {
                        status = CERT_ENROLLED_OTHER_USER;
                    }
                } else {
                    if (enroll) {
                        logger.info("Associating presented cert to user");
                        List<String> oeuid = new ArrayList<>(Optional.ofNullable(person.getOxExternalUid()).orElse(Collections.emptyList()));
                        oeuid.add(externalUid);
                        person.setOxExternalUid(oeuid);

                        status = SUCCESS;
                    } else {
                        logger.info("Certificate not associated to an existing account yet");
                        status = CERT_NOT_RECOGNIZED;
                    }
                }
            }
            if (status.equals(SUCCESS) || status.equals(CERT_ENROLLED_ALREADY)) {
                updateUserX509Certificates(person, certificate);
                status = persistenceService.modify(person) ? status : UNKNOWN_ERROR;
            }
            logger.info("Operation result is {}", status.toString());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            status = UNKNOWN_ERROR;
        }
        return status;

    }

    public List<Certificate> getUserCerts(String userId) {

        List<Certificate> certs = new ArrayList<>();
        try {
            CertPerson person = persistenceService.get(CertPerson.class, persistenceService.getPersonDn(userId));

            List<org.gluu.oxtrust.model.scim2.user.X509Certificate> x509Certificates = getScimX509Certificates(
                    Optional.ofNullable(person.getX509Certificates()).orElse(Collections.emptyList()));

            certs = person.getOxExternalUid().stream().filter(uid -> uid.startsWith(CERT_PREFIX))
                    .map(uid -> getExtraCertsInfo(uid, x509Certificates)).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return certs;

    }

    public int getDevicesTotal(String userId) {

        int total = 0;
        try {
            IdentityPerson person = persistenceService.get(IdentityPerson.class, persistenceService.getPersonDn(userId));
            total = (int) person.getOxExternalUid().stream().filter(uid -> uid.startsWith(CERT_PREFIX)).count();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return total;

    }

    private Certificate getExtraCertsInfo(String externalUid, List<org.gluu.oxtrust.model.scim2.user.X509Certificate> scimCerts) {

        String fingerPrint = externalUid.replace(CERT_PREFIX, "");
        Certificate cert = new Certificate();
        cert.setFingerPrint(fingerPrint);

        for (org.gluu.oxtrust.model.scim2.user.X509Certificate sc : scimCerts) {
            try {
                X509Certificate x509Certificate = CertUtils.x509CertificateFromPem(sc.getValue());
                if (fingerPrint.equals(getFingerPrint(x509Certificate))) {

                    Map<String, String> attributes = Arrays.stream(sc.getDisplay().split(",\\s*"))
                            .collect(Collectors.toMap(t -> t.substring(0,t.indexOf('=')).toLowerCase(), t -> t.substring(t.indexOf('=') + 1)));

                    String cn = attributes.get("cn");
                    String ou = attributes.getOrDefault("ou", "");
                    String o = attributes.getOrDefault("o", "");

                    if (Utils.isNotEmpty(ou)) {
                        if (Utils.isNotEmpty(o)) {
                            ou += ", " + o;
                        }
                    } else if (Utils.isNotEmpty(o)){
                        ou = o;
                    }

                    String l = attributes.getOrDefault("l", "");
                    String st = attributes.getOrDefault("st", "");
                    String c = attributes.getOrDefault("c", "");

                    cert.setCommonName(cn);
                    cert.setOrganization(ou);
                    cert.setLocation(String.format("%s %s %s", l, st, c).trim());

                    cert.setFormattedName(cn + (Utils.isEmpty(ou) ? "" : String.format(" (%s)", ou)));

                    long date = x509Certificate.getNotAfter().getTime();
                    cert.setExpirationDate(date);
                    cert.setExpired(date < System.currentTimeMillis());

                    break;
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
            }

        }
        return cert;

    }

    public boolean removeFromUser(String fingerPrint, String userId) throws Exception {

        CertPerson person = persistenceService.get(CertPerson.class, persistenceService.getPersonDn(userId));

        List<String> stringCerts = Optional.ofNullable(person.getX509Certificates()).orElse(new ArrayList<>());
        List<org.gluu.oxtrust.model.scim2.user.X509Certificate> scimCerts = getScimX509Certificates(stringCerts);

        boolean found = false;
        int i;
        for (i = 0; i < scimCerts.size() && !found; i++) {
            found = getFingerPrint(CertUtils.x509CertificateFromPem(scimCerts.get(i).getValue())).equals(fingerPrint);
        }
        if (found) {
            person.getX509Certificates().remove(i - 1);
        }

        Optional<String> externalUid = person.getOxExternalUid().stream()
                .filter(str -> str.equals(CERT_PREFIX + fingerPrint)).findFirst();
        externalUid.ifPresent(uid ->  person.getOxExternalUid().remove(uid));

        return persistenceService.modify(person);

    }

    private List<org.gluu.oxtrust.model.scim2.user.X509Certificate> getScimX509Certificates(List<String> scimStringCerts) {

        List<org.gluu.oxtrust.model.scim2.user.X509Certificate> scimCerts = new ArrayList<>();
        for (String scimCert : scimStringCerts) {
            try {
                scimCerts.add(mapper.readValue(scimCert, org.gluu.oxtrust.model.scim2.user.X509Certificate.class));
            } catch (Exception e) {
                logger.error("Unable to convert value '{}' to expected SCIM format", scimCert);
                logger.error(e.getMessage());
            }
        }
        return scimCerts;

    }

    private void updateUserX509Certificates(CertPerson person, X509Certificate certificate) {

        try {
            boolean match = false;
            String display = certificate.getSubjectX500Principal().getName();

            logger.info("Reading user's stored X509 certificates");
            List<String> stringCerts = Optional.ofNullable(person.getX509Certificates()).orElse(new ArrayList<>());
            List<org.gluu.oxtrust.model.scim2.user.X509Certificate> scimCerts = getScimX509Certificates(stringCerts);

            for (org.gluu.oxtrust.model.scim2.user.X509Certificate scimCert : scimCerts) {
                String scimDisplay = scimCert.getDisplay();
                if (Utils.isNotEmpty(scimDisplay) && scimDisplay.equals(display)) {
                    logger.debug("The certificate presented is already in user's profile");
                    match = true;
                    break;
                }
            }

            if (!match) {
                org.gluu.oxtrust.model.scim2.user.X509Certificate scimX509Cert = new org.gluu.oxtrust.model.scim2.user.X509Certificate();
                byte DEREncoded[] = certificate.getEncoded();
                scimX509Cert.setValue(new String(Base64.getEncoder().encode(DEREncoded), StandardCharsets.UTF_8));
                scimX509Cert.setDisplay(display);

                logger.debug("Updating user's oxTrustx509Certificate attribute");
                stringCerts.add(mapper.writeValueAsString(scimX509Cert));
                person.setX509Certificates(stringCerts);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private String getFingerPrint(X509Certificate certificate) throws Exception {
        return FingerprintHelper.getPublicKeySshFingerprint(certificate.getPublicKey());
    }

    private CertService() {
        mapper = new ObjectMapper();
        persistenceService = Utils.managedBean(IPersistenceService.class);
        reloadConfiguration();
    }


}
