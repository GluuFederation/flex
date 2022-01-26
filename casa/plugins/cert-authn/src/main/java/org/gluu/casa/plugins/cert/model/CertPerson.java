package org.gluu.casa.plugins.cert.model;

import io.jans.orm.annotation.AttributeName;
import io.jans.orm.annotation.DataEntry;
import io.jans.orm.annotation.ObjectClass;

import org.gluu.casa.core.model.IdentityPerson;

import java.util.List;

@DataEntry
@ObjectClass("jansPerson")
public class CertPerson extends IdentityPerson {

    @AttributeName(name = "jans509Certificate")
    private List<String> x509Certificates;

    public List<String> getX509Certificates() {
        return x509Certificates;
    }

    public void setX509Certificates(List<String> x509Certificates) {
        this.x509Certificates = x509Certificates;
    }

}
