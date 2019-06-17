package org.gluu.casa.timer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.util.StaticUtils;
import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.core.PersistenceService;
import org.gluu.casa.core.TimerService;
import org.gluu.casa.core.model.BasePerson;
import org.gluu.casa.misc.Utils;
import org.gluu.search.filter.Filter;
import org.pf4j.DefaultPluginDescriptor;
import org.pf4j.PluginDescriptor;
import org.pf4j.PluginState;
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

    private static final long HOUR_IN_MILLIS = TimeUnit.HOURS.toMillis(1);

    private static final String LAST_LOGON_ATTR = "oxLastLogonTime";

    private static final String GLUU_CASA_PLUGINS_PREFIX = "org.gluu.casa.plugins";

    private static final int AES_KEY_SIZE = 256;

    @Inject
    private Logger logger;

    @Inject
    private PersistenceService persistenceService;

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

    public void activate() {

        try {
            if (pub != null) {
                int oneHour = (int) TimeUnit.HOURS.toSeconds(1);
                timerService.addListener(this, quartzJobName);
                //Repeat indefinitely every hour
                timerService.schedule(quartzJobName, oneHour, -1, oneHour);
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

        logger.trace("StatisticsTimer. Running timer job");

        long now = System.currentTimeMillis();
        ZonedDateTime t = ZonedDateTime.ofInstant(Instant.ofEpochMilli(now), ZoneOffset.UTC);

        //Computes current month and year
        String month = t.getMonth().toString();
        String year = Integer.toString(t.getYear());
        Path tmpUsersFile = Paths.get(TEMP_PATH, "u" + month + year);

        try{
            int activeUsers = getUpdateActiveUsers(tmpUsersFile, now);
            //Computes the moment of time (relative to UNIX epoch) where the current day started (assuming UTC time)
            long todayStartAt = now - now % DAY_IN_MILLIS;

            //The following check guarantees the logic below is executed only once a day (normally between 00:00:00 UTC and 00:59:59UTC)
            if (now - todayStartAt < HOUR_IN_MILLIS) {

                //File pointed by tmpFilePath contains plain plugin data and overall days covered
                Path tmpFilePath = Paths.get(TEMP_PATH, month + year);
                //File pointed by statsPath contains encrypted data of tmpFilePath plus some extra descriptive info
                Path statsPath = Paths.get(STATS_PATH, month + year);
                boolean tmpExists = Files.isRegularFile(tmpFilePath);

                if (tmpExists) {
                    //This check prevents to inflate statistics when the app is restarted several times in a day
                    if (tmpFilePath.toFile().lastModified() > todayStartAt) {
                        return;
                    }
                }
                int daysCovered = 1;
                List<Map<String, Object>> plugins = null;

                if (tmpExists) {
                    //Read stats from tmpFilePath and updates daysCovered variable
                    byte[] bytes = Files.readAllBytes(tmpFilePath);
                    Map<String, Object> currStats = mapper.readValue(bytes, new TypeReference<Map<String, Object>>(){});
                    daysCovered = Integer.parseInt(currStats.get("daysCovered").toString()) + 1;

                    plugins = (List<Map<String, Object>>) currStats.get("plugins");
                }
                //Updates plugin data
                plugins = getPluginInfo(Optional.ofNullable(plugins).orElse(Collections.emptyList()));
                //Saves to disk plain and encrypted file
                serialize(month, year, activeUsers, daysCovered, plugins, statsPath, tmpFilePath);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    /**
     * Reads the file represented by <code>tmpUsersFile</code> (which contains the set of user IDs who have logged in to
     * any app protected by the server) in a given period, and returns the size of such set. If the time passed in
     * parameter <code>t</code> falls beyond an hour of the last modified timestamp of such file, the file is updated
     * to include users who have logged in in the previous hour.
     * <p>This file is built via standard Java serialization techniques, not Json. It saves some disk space as well as
     * computing time since this method is called often.</p>
     * @param tmpUsersFile Path to file (it covers a specific month)
     * @param t A instant in time (in terms of UNIX epoch)
     * @return Number of (different) users who have logged in using Gluu Server for the period covered by tmpUsersFile
     * @throws Exception Anomaly reading or updating the file
     */
    private int getUpdateActiveUsers(Path tmpUsersFile, long t) throws Exception {

        Set<Integer> activeUsers = new HashSet<>();
        boolean tmpExists = Files.isRegularFile(tmpUsersFile);
        boolean update = true;

        if (tmpExists) {
            update = t - tmpUsersFile.toFile().lastModified() > HOUR_IN_MILLIS;
            try (ObjectInputStream ois = new ObjectInputStream(Files.newInputStream(tmpUsersFile))) {
                activeUsers = (HashSet<Integer>) ois.readObject();
            }
        }
        if (update) {
            activeUsers.addAll(lastHourLogins(t));

            try (ObjectOutputStream oos = new ObjectOutputStream(Files.newOutputStream(tmpUsersFile))) {
                oos.writeObject(activeUsers);
            }
        }
        return activeUsers.size();

    }

    /**
     * Computes a set of hashed user IDs. IDs are obtained by checking the oxLastLogonTime attribute of LDAP belonging
     * to the timeframe [<code>timeStamp</code> - 1 hour, <code>timeStamp</code>).
     * @param timeStamp An time instant (in terms of UNIX epoch)
     * @return The set built
     */
    private Set<Integer> lastHourLogins(long timeStamp) {

        Set<Integer> huids = new HashSet<>();
        Filter filter = Filter.createANDFilter(
                Filter.createGreaterOrEqualFilter(LAST_LOGON_ATTR, StaticUtils.encodeGeneralizedTime(timeStamp - HOUR_IN_MILLIS)),
                Filter.createLessOrEqualFilter(LAST_LOGON_ATTR, StaticUtils.encodeGeneralizedTime(timeStamp - 1))
        );
        persistenceService.find(BasePerson.class, persistenceService.getPeopleDn(), filter)
                .forEach(p -> huids.add(p.getUid().hashCode()));
        return huids;

    }

    /**
     * Computes a list with plugins usage data based on previous data
     * @param plugins Previous data
     * @return Up-to-date data
     */
    private List<Map<String, Object>> getPluginInfo(List<Map<String, Object>> plugins) {

        //Computes a temporary list with info (id + version) about plugins which are currently installed
        List<PluginDescriptor> pluginSummary = new ArrayList<>();
        extManager.getPlugins().stream()
                .filter(pw -> pw.getDescriptor().getPluginClass().startsWith(GLUU_CASA_PLUGINS_PREFIX)
                        && pw.getPluginState().equals(PluginState.STARTED))
                .forEach(pw -> pluginSummary.add(
                        new DefaultPluginDescriptor(pw.getPluginId(), null, null, pw.getDescriptor().getVersion(), null, null, null))
                );

        //Correlates pluginSummary vs. plugins variables and updates the days of usage
        for (Map<String, Object> map : plugins) {
            String pluginId = map.get("pluginId").toString();
            String version = map.get("version").toString();

            //Search this occurrence in currently installed plugins
            if (pluginSummary.stream().anyMatch(pd -> pd.getVersion().equals(version) && pd.getPluginId().equals(pluginId))) {
                map.put("daysUsed", Integer.parseInt(map.get("daysUsed").toString()) + 1);
            }
        }

        List<Map<String, Object>> list = new ArrayList<>(plugins);
        //Adds the relevant information found in pluginSummary and not present in plugins
        for (PluginDescriptor pd : pluginSummary) {
            if (plugins.stream().noneMatch(map -> map.get("pluginId").toString().equals(pd.getPluginId())
                    && map.get("version").toString().equals(pd.getVersion()))) {

                Map<String, Object> map = new LinkedHashMap<>();
                map.put("pluginId", pd.getPluginId());
                map.put("version", pd.getVersion());
                map.put("daysUsed", 1);
                list.add(map);
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
    private void serialize(String month, String year, int activeUsers, int days, List<Map<String, Object>> plugins,
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
