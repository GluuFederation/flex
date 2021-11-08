package org.gluu.model.passport;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

import org.gluu.model.passport.config.Configuration;
import org.gluu.model.passport.idpinitiated.IIConfiguration;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PassportConfiguration {
    
    private Configuration conf;
    private IIConfiguration idpInitiated;
    private List<Provider> providers = new ArrayList<>();

    public Configuration getConf() {
            return conf;
    }

    public void setConf(Configuration conf) {
            this.conf = conf;
    }

    public IIConfiguration getIdpInitiated() {
            return idpInitiated;
    }

    public void setIdpInitiated(IIConfiguration idpInitiated) {
            this.idpInitiated = idpInitiated;
    }

    public List<Provider> getProviders() {
            return providers;
    }

    public void setProviders(List<Provider> providers) {
            this.providers = providers;
    }

}
