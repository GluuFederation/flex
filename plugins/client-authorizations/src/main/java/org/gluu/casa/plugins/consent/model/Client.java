package org.gluu.casa.plugins.consent.model;

import org.gluu.casa.misc.Utils;
import org.gluu.persist.annotation.AttributeName;
import org.gluu.persist.annotation.DataEntry;
import org.gluu.persist.annotation.ObjectClass;
import org.gluu.persist.model.base.InumEntry;

import java.util.List;
import java.util.Optional;

@DataEntry
@ObjectClass(values = { "top", "oxAuthClient" })
public class Client extends InumEntry {

    @AttributeName(name ="associatedPerson")
    private List<String> associatedPeople;

    private String displayName;

    @AttributeName
    private String oxAuthClientURI;

    @AttributeName(name ="oxAuthContact")
    private List<String> contacts;

    @AttributeName(name = "oxAuthLogoURI")
    private String logoURI;

    @AttributeName(name = "oxAuthPolicyURI")
    private String policyURI;

    @AttributeName(name ="oxAuthTosURI")
    private String tosURI;

    public List<String> getAssociatedPeople() {
        return Utils.nonNullList(associatedPeople);
    }

    public String getDisplayName()
    {
        return displayName;
    }

    public String getOxAuthClientURI() {
        return oxAuthClientURI;
    }

    public List<String> getContacts() {
        return contacts;
    }

    public String getLogoURI() {
        return logoURI;
    }

    public String getPolicyURI() {
        return policyURI;
    }

    public String getTosURI() {
        return tosURI;
    }

    /**
     * Constructs an ID based on inum value, dropping all non alphabetic chars
     * @return A string
     */
    public String getAlternativeID() {
        return Optional.ofNullable(getInum())
                .map(str -> str.replaceAll("\\W","")).orElse (null);
    }

    public void setAssociatedPeople(List<String> associatedPeople) {
        this.associatedPeople = associatedPeople;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setOxAuthClientURI(String oxAuthClientURI) {
        this.oxAuthClientURI = oxAuthClientURI;
    }

    public void setContacts(List<String> contacts) {
        this.contacts = contacts;
    }

    public void setLogoURI(String logoURI) {
        this.logoURI = logoURI;
    }

    public void setPolicyURI(String policyURI) {
        this.policyURI = policyURI;
    }

    public void setTosURI(String tosURI) {
        this.tosURI = tosURI;
    }

}
