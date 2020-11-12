package org.gluu.casa.client.config.api;

import org.gluu.casa.client.config.ApiException;

import org.junit.Test;
import org.junit.Ignore;

import java.util.*;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

//@Ignore
public class SimpleTest extends BaseTest {
    
    @Test
    public void EnableDisableAuthnMethod() throws Exception {
        
        String method = null;
        List<String> methods = client.authnMethodsEnabledGet();
        //Find a method not implemented by a plugin but via system extension
        for (String acr : methods) {
            if (client.pluginsAuthnMethodImplAcrGet(acr).size() == 0) {
                method = acr;
                break;
            }
        }
        if (method != null) {
            //Disable the method and check it has disappeared from the list
            client.authnMethodsDisablePost(method);
            assertFalse(client.authnMethodsEnabledGet().contains(method));
            
            //Enable the method back again
            client.authnMethodsAssignPluginPost(method, null);
            
            //Check is listed
            assertTrue(client.authnMethodsEnabledGet().contains(method));
        }
    
    }
    
    @Test
    public void CORS() throws Exception {
        
        List<String> sample = new ArrayList();
        sample.addAll(Arrays.asList("http://www.guitarworld.com", "http://billboard.com", 
            "https://billboard.com", "http://billboard.com"));    //Includes repeated elements
            
        Set<String> domains = new HashSet(sample);
        //Add invalid stuff
        sample.addAll(Arrays.asList("blabbermouth", "ftp://rollingstone.com", null, ""));
        
        //Get the COR list in deployed instance 
        List<String> cors = client.corsGet();
        //Change it
        client.corsPut(sample);
        
        //Query and verify the change
        Set<String> set = new HashSet(client.corsGet());
        assertTrue(set.equals(domains));
        
        //Revert to original values
        client.corsPut(cors);

    }
    
    @Test
    public void PasswordReset() throws Exception {

        if (client.pwdResetAvailableGet()) {
            if (client.pwdResetEnabledGet()) {
                //Turn off if enabled
                client.pwdResetTurnOffPost();
                assertFalse(client.pwdResetEnabledGet());
                
                //Restore
                client.pwdResetTurnOnPost();
            } else {
                //Turn on if disabled
                client.pwdResetTurnOnPost();
                assertTrue(client.pwdResetEnabledGet());
                
                //Restore
                client.pwdResetTurnOffPost();
            }
        }
        
    }
    
    @Test
    public void OXDUpdateClient() throws Exception {
        client.oxdGet().toString();
    }
    
}