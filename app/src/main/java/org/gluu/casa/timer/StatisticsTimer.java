package org.gluu.casa.timer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.util.StaticUtils;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.core.ITrackable;
import org.gluu.casa.core.TimerService;
import org.gluu.casa.core.inmemory.IStoreService;
import org.gluu.casa.core.model.BasePerson;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.service.IPersistenceService;
import org.gluu.oxauth.fido2.model.entry.Fido2RegistrationEntry;
import org.gluu.oxauth.fido2.model.entry.Fido2RegistrationStatus;
import org.gluu.persist.model.base.SimpleBranch;
import org.gluu.search.filter.Filter;
import org.pf4j.*;
import org.quartz.JobExecutionContext;
import org.quartz.listeners.JobListenerSupport;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Generates Casa usage data.
 * <p>This class requires Java SE 8u151 or higher with crypto.policy=unlimited in JRE\lib\security\java.security or
 * a call to Security.setProperty("crypto.policy", "unlimited"). This is guaranteed in Gluu server 3.1.5 onwards.</p>
 * @author jgomer
 */
@ApplicationScoped
public class StatisticsTimer extends JobListenerSupport {

    private static final String SETUP_PROPERTIES_LOCATION = "/install/community-edition-setup/setup.properties.last";

    private static final String DEFAULT_PUBLICKEY_PATH = "/etc/certs/casa.pub";

    private static final String STATS_PATH = System.getProperty("server.base") + File.separator + "stats";

    private static final String TEMP_PATH = System.getProperty("java.io.tmpdir") + File.separator + "casa";

    private static final long DAY_IN_MILLIS = TimeUnit.DAYS.toMillis(1);

    private static final String LAST_LOGON_ATTR = "oxLastLogonTime";

    private static final String GLUU_CASA_PLUGINS_PREFIX = "org.gluu.casa.plugins";

    private static final int AES_KEY_SIZE = 256;

    private final String ACTIVE_INSTANCE_PRESENCE = getClass().getName() + "_activeInstanceSet";

    @Inject
    private Logger logger;

    @Inject
    private IPersistenceService persistenceService;

    @Inject
    private IStoreService storeService;

    @Inject
    private TimerService timerService;

    @Inject
    private ExtensionsManager extManager;

    private String serverName;

    private String email;

    private String quartzJobName;

    private PublicKey pub;

    private ObjectMapper mapper;

    private SecretKeySpec symmetricKey;

    private int oneDay;

    public void activate(int gap) {

        try {
            if (pub != null) {
                timerService.addListener(this, quartzJobName);
                //Repeat indefinitely every day
                timerService.schedule(quartzJobName, gap, -1, oneDay);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    @Override
    public String getName() {
        return quartzJobName;
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

        //TODO: this method implementation is not well-suited for a multinode environment

        //Optimistically, the following if-else allows the metrics logic to be executed only by a single node
        //(in a multi node environment)
        if (storeService.get(ACTIVE_INSTANCE_PRESENCE) == null) {
            //temporarily take the ownership for computing data
            storeService.put(oneDay, ACTIVE_INSTANCE_PRESENCE, true);
        } else {
            return;
        }

        logger.trace("StatisticsTimer. Running timer job");

        long now = System.currentTimeMillis();
        ZonedDateTime t = ZonedDateTime.ofInstant(Instant.ofEpochMilli(now), ZoneOffset.UTC);

        //Computes current month and year
        String month = t.getMonth().toString();
        String year = Integer.toString(t.getYear());

        try{
            //Computes the moment of time (relative to UNIX epoch) where the current day started (assuming UTC time)
            long todayStartAt = now - now % DAY_IN_MILLIS;

            //File pointed by tmpFilePath contains plain plugin data and overall days covered
            Path tmpFilePath = Paths.get(TEMP_PATH, month + year);
            //File pointed by statsPath contains encrypted data of tmpFilePath plus some extra descriptive info
            Path statsPath = Paths.get(STATS_PATH, month + year);
            boolean tmpExists = Files.isRegularFile(tmpFilePath);

            if (tmpExists) {
                //This check prevents to recompute statistics when the app is restarted several times in a day
                if (tmpFilePath.toFile().lastModified() > todayStartAt) {
                    return;
                }
            }

            int daysCovered = 1;
            List<PluginMetric> plugins = null;

            if (tmpExists) {
                //Read stats from tmpFilePath and updates daysCovered variable
                byte[] bytes = Files.readAllBytes(tmpFilePath);
                Map<String, Object> currStats = mapper.readValue(bytes, new TypeReference<Map<String, Object>>(){});
                daysCovered = Integer.parseInt(currStats.get("daysCovered").toString()) + 1;

                plugins = mapper.convertValue(currStats.get("plugins"), new TypeReference<List<PluginMetric>>(){});
            }
            //Updates plugin data accounting from first day of present month to current time
            long start = todayStartAt - (t.getDayOfMonth() - 1) * DAY_IN_MILLIS;
            plugins = getPluginInfo(Optional.ofNullable(plugins).orElse(Collections.emptyList()), start, now);
            //Saves to disk plain and encrypted file
            int activeUsers = getActiveUsers(start, now);
            serialize(month, year, activeUsers, daysCovered, plugins, statsPath, tmpFilePath);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    /**
     * Computes the number of distinct users who have at least one enrolled for the default authentication mechanisms
     * supported and have logged in at least once during the period [start, end)
     * @param start Initial time to account for user activity
     * @param end Upper limit
     * @return Number of users (in case of problem conducting the computation, 0 is returned)
     */
    private int getActiveUsers(long start, long end) {

        Set<Integer> hashes = new HashSet<>();
        List<Integer> hashesValidUsers = Collections.emptyList();
        //Implementing this method by iterating through every user in the database and calling method
        //org.gluu.casa.extension.AuthnMethod.getTotalUserCreds() is prohibitely expensive: we
        //have to solve it by using low-level direct queries
        try {
            String peopleDN = persistenceService.getPeopleDn();
            String startTime = StaticUtils.encodeGeneralizedTime(start);
            String endTime = StaticUtils.encodeGeneralizedTime(end - 1);

            //Employed to compute users who have logged in a time period
            Filter filter = Filter.createANDFilter(
                    Filter.createGreaterOrEqualFilter(LAST_LOGON_ATTR, startTime),
                    Filter.createLessOrEqualFilter(LAST_LOGON_ATTR, endTime)
            );
            hashesValidUsers = persistenceService.find(BasePerson.class, peopleDN, filter)
                    .stream().map(BasePerson::getInum).map(String::hashCode).collect(Collectors.toList());

            filter = Filter.createORFilter(
                Filter.createPresenceFilter("mobile"),      //Accounts for OTP (SMS)
                Filter.createPresenceFilter("oxExternalUid")    //Accounts for OTP (time or event based) or external identities
            );
            hashes.addAll(persistenceService.find(BasePerson.class, peopleDN, filter)
                    .stream().map(BasePerson::getInum).map(String::hashCode).collect(Collectors.toList()));

            SimpleBranch sb = new SimpleBranch(peopleDN);
            //Compute owners of u2f or supergluu enrollments, and then fido2
            String ous[] = new String[]{"fido"};    //, "fido2_register"
            for (String ou : ous) {
                sb.setOrganizationalUnitName(ou);

                hashes.addAll(persistenceService.find(sb).stream().map(SimpleBranch::getDn)
                        .map(dn -> dn.substring(    //Extract the user inum from the enrolled device DN
                                        dn.indexOf("inum=") + 5,
                                        dn.length() - peopleDN.length() - 1
                                    ).hashCode())
                        .collect(Collectors.toList()));
            }

            //Fido2 people cannot be computed as in the case of fido because fido2 base branch does not exist in CB...
            List<Fido2RegistrationEntry> list = persistenceService.find(Fido2RegistrationEntry.class, persistenceService.getPeopleDn(),
                    Filter.createEqualityFilter("oxStatus", Fido2RegistrationStatus.registered.getValue()));
            hashes.addAll(list.stream().map(e -> e.getUserInum().hashCode()).collect(Collectors.toList()));

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        hashes.retainAll(hashesValidUsers);
        return hashes.size();

    }

    /**
     * Computes a list with plugins usage data based on previous data
     * @param plugins Previous data
     * @return Up-to-date data
     */
    private List<PluginMetric> getPluginInfo(List<PluginMetric> plugins, long start, long end) {

        //Computes a temporary list with info (id + version) about plugins which are currently installed
        List<PluginWrapper> pluginSummary = extManager.getPlugins().stream()
                .filter(pw -> pw.getDescriptor().getPluginClass().startsWith(GLUU_CASA_PLUGINS_PREFIX)
                        && pw.getPluginState().equals(PluginState.STARTED)).collect(Collectors.toList());

        //Correlates pluginSummary vs. plugins variables and updates the days of usage
        for (PluginMetric metric : plugins) {
            String pluginId = metric.getPluginId();
            String version = metric.getVersion();

            //Search this occurrence in currently installed plugins
            PluginWrapper wrapper = pluginSummary.stream()
                    .filter(pw -> pw.getDescriptor().getVersion().equals(version)
                            && pw.getPluginId().equals(pluginId)).findFirst().orElse(null);

            if (wrapper != null) {
                try {
                    //Is plugin implementing ITrackable?
                     int users = ITrackable.class.cast(wrapper.getPlugin()).getActiveUsers(start, end);
                     if (users < 0) {
                         logger.warn("Computing active users for plugin '{}' failed", pluginId);
                     } else {
                         Integer prevActiveUsers = metric.getActiveUsers();

                         if (prevActiveUsers != null) {
                             //Preserve the greatest in history
                             users = Math.max(users, prevActiveUsers);
                         }
                         metric.setActiveUsers(users);
                     }
                } catch (ClassCastException e) {
                    logger.info("Plugin {} does not implement ITrackable. Cannot compute active users");
                }
                metric.setDaysUsed(metric.getDaysUsed() + 1);
            }
        }

        List<PluginMetric> list = new ArrayList<>(plugins);
        //Adds the relevant information found in pluginSummary and not present in plugins
        for (PluginWrapper pw : pluginSummary) {
            String pluginId = pw.getPluginId();
            String version = pw.getDescriptor().getVersion();

            if (plugins.stream().noneMatch(m -> m.getPluginId().equals(pluginId) && m.getVersion().equals(version))) {

                PluginMetric metric = new PluginMetric();
                metric.setPluginId(pluginId);
                metric.setVersion(version);
                metric.setDaysUsed(1);

                list.add(metric);
            }
        }
        return list;

    }

    /**
     * Updates the files referenced by params <code>destination</code> (encrypted) and <code>tempDestination</code> (plain text)
     * @param month Displayable name of current month
     * @param year Displayable name of current year
     * @param activeUsers Number of current users
     * @param days Number of days actually covered by this update
     * @param plugins List with up-to-date info about plugins
     * @param destination References a file to update
     * @param tmpDestination References a file to update
     * @throws Exception A problem occurred saving files, encrypting, serializing data, etc.
     */
    private void serialize(String month, String year, int activeUsers, int days, List<PluginMetric> plugins,
                           Path destination, Path tmpDestination) throws Exception {

        //A LinkedHashMap guarantees JSON data is serialized in the same order of key insertion
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("daysCovered", days);
        map.put("plugins", plugins);

        //Overwrites or creates tmpDestination file with info in map
        Files.write(tmpDestination, mapper.writeValueAsBytes(map));

        //Adds more context information to map
        map.put("activeUsers", activeUsers);
        map.put("serverName", serverName);
        map.put("email", email);

        map.put("month", month);
        map.put("year", year);
        map.put("generatedOn", ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.RFC_1123_DATE_TIME));

        //See https://stackoverflow.com/questions/1199058/how-to-use-rsa-to-encrypt-files-huge-data-in-c-sharp
        //https://stackoverflow.com/questions/5583379/what-is-the-limit-to-the-amount-of-data-that-can-be-encrypted-with-rsa
        byte[] encrKey = encrypt(symmetricKey.getEncoded(), pub, "RSA/ECB/PKCS1Padding");
        //Writes a header to the file consisting of an encrypted key. It will be used to know how to decrypt the remaining contents
        Files.write(destination, encrKey);
        //It always holds that encrKey.size == 256

        //Encrypts a byte array consisting of the info stored in map variable
        byte[] bytes = mapper.writeValueAsBytes(map);
        bytes = encrypt(bytes, symmetricKey, "AES");  // AES/CBC/PKCS5Padding
        //Appends encrypted data to file
        Files.write(destination, bytes, StandardOpenOption.APPEND);

    }

    private byte[] encrypt(byte[] data, Key key, String transformation) throws Exception {

        Cipher cipher = Cipher.getInstance(transformation);
        cipher.init(Cipher.ENCRYPT_MODE, key);

        try (CipherInputStream cis = new CipherInputStream(new ByteArrayInputStream(data), cipher)) {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            copy(cis, bos);
            return bos.toByteArray();
        }

    }

    private void copy(InputStream in, OutputStream out) throws Exception {

        byte[] ibuf = new byte[1024];
        int len;
        while ((len = in.read(ibuf)) != -1) {
            out.write(ibuf, 0, len);
        }

    }

    private Path getPublicKeyPath() {
        return Paths.get(Utils.onWindows() ? System.getProperty("gluu.base") + File.separator + "casa.pub" : DEFAULT_PUBLICKEY_PATH);
    }

    private PublicKey getPubKey() throws Exception {
        byte[] bytes = Files.readAllBytes(getPublicKeyPath());
        X509EncodedKeySpec ks = new X509EncodedKeySpec(bytes);
        return KeyFactory.getInstance("RSA").generatePublic(ks);
    }

    private SecretKeySpec genSymmetricKey() throws Exception {

        KeyGenerator kgen = KeyGenerator.getInstance("AES");
        kgen.init(AES_KEY_SIZE);  //bits size
        SecretKey key = kgen.generateKey();
        return new SecretKeySpec(key.getEncoded(), "AES");

    }

    @PostConstruct
    private void inited() {

        try {
            mapper = new ObjectMapper();
            mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
            quartzJobName = getClass().getSimpleName() + "_timer";
            oneDay = (int) TimeUnit.DAYS.toSeconds(1);

            //Obtains email and server name from the current Gluu installation
            try (BufferedReader reader = Files.newBufferedReader(Paths.get(SETUP_PROPERTIES_LOCATION))) {
                Properties p = new Properties();
                p.load(reader);
                email = p.getProperty("admin_email");
                serverName = p.getProperty("hostname");
            } catch (Exception e) {
                if (!Utils.onWindows()) {
                    throw  e;
                }
            }

            //Create stats directories if missing
            Files.createDirectories(Paths.get(TEMP_PATH));
            Files.createDirectories(Paths.get(STATS_PATH));

            symmetricKey = genSymmetricKey();
            pub = getPubKey();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

}
