package org.gluu.casa.core;

import java.util.List;
import java.util.Map;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;

import org.zkoss.util.Pair;

@Named
@ApplicationScoped
public class OIDCFlowService {
    
    public String getAuthzUrl(String acrValues) {
        return null;
    }
    
    public String getAuthzUrl(List<String> acrValues, String prompt) {
        return null;
    }
    
    public String getLogoutUrl(String idTokenHint) {
        return null;
    }
    
    public Pair<String, String> getTokens(String code, String state) {
        return null;
    }
    
    public Map getUserClaims(String accessToken) {
        return null;
    }
    
}
