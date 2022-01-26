package org.gluu.casa.plugins.bioid.model;

import org.gluu.casa.core.model.BasePerson;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;

@DataEntry
@ObjectClass("gluuPerson")
public class PersonBiometric extends BasePerson {

    @AttributeName(name = "oxBiometricDevices")
    private String bioMetricDevices;

    @AttributeName
    private String bioid;

	public String getBioMetricDevices() {
		return bioMetricDevices;
	}

	public void setBioMetricDevices(String bioMetricDevices) {
		this.bioMetricDevices = bioMetricDevices;
	}

	public String getBioid() {
		return bioid;
	}

	public void setBioid(String bioid) {
		this.bioid = bioid;
	}

	

	

    

}
