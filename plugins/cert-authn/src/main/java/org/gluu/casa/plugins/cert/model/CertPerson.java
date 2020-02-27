package org.gluu.casa.plugins.cert.model;

import org.gluu.casa.core.model.IdentityPerson;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

import java.util.List;

@DataEntry
@ObjectClass("gluuPerson")
public class CertPerson extends IdentityPerson {

    @AttributeName(name = "oxTrustx509Certificate")
    private List<String> x509Certificates;

    public List<String> getX509Certificates() {
        return x509Certificates;
    }

    public void setX509Certificates(List<String> x509Certificates) {
        this.x509Certificates = x509Certificates;
    }

}
