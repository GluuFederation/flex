package org.gluu.casa.conf;

import com.fasterxml.jackson.core.type.TypeReference;
import org.gluu.casa.conf.sndfactor.EnforcementPolicy;

import java.util.List;
import java.util.Map;

/**
 * @author jgomer
 */
public final class StaticInstanceUtil {

    static final TypeReference<Boolean> TR_BOOLEAN = new TypeReference<Boolean>() {};

    static final TypeReference<String> TR_STRING = new TypeReference<String>() {};

    static final TypeReference<Integer> TR_INTEGER = new TypeReference<Integer>() {};

    static final TypeReference<List<EnforcementPolicy>> TR_LIST_ENFORCEMENT_POLICY = new TypeReference<List<EnforcementPolicy>>() {};

    static final TypeReference<TrustedDevicesSettings> TR_TRUSTED_DEVICES_SETTINGS = new TypeReference<TrustedDevicesSettings>() {};

    static final TypeReference<Map<String, String>> TR_MAP_STRING_STRING = new TypeReference<Map<String, String>>() {};

    static final TypeReference<List<PluginInfo>> TR_LIST_PLUGININFO = new TypeReference<List<PluginInfo>>() {};

    static final TypeReference<OxdSettings> TR_OXDSETTINGS = new TypeReference<OxdSettings>() {};

    static final TypeReference<U2fSettings> TR_U2FSETTINGS = new TypeReference<U2fSettings>() {};

    static final TypeReference<LdapSettings> TR_LDAPSETTINGS = new TypeReference<LdapSettings>() {};

}
