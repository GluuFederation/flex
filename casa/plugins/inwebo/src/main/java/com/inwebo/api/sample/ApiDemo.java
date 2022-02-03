package com.inwebo.api.sample;

import com.inwebo.support.Util;

public final class ApiDemo {

    private static final String p12file = "C:/dev/postsymfo.p12"; // Specify here the name of your certificate file.
    private static final String p12password = "testtest"; // This is the password to access your certificate file
    private static final int serviceId = 67; // This is the id of your service.

    private ApiDemo() {
    }

    public static void main(final String[] args) {
        Util.activeSoapLog(false);
        try {
            Util.setHttpsClientCert(p12file, p12password);
        } catch (final Exception e1) {
            e1.printStackTrace();
            return;
        }

        try {
            final AuthenticationDemo demo1 = new AuthenticationDemo(serviceId);
            demo1.run();

            final ProvisioningDemo demo2 = new ProvisioningDemo(serviceId);
            demo2.run();

            final AuthRESTDemo demo = new AuthRESTDemo(serviceId, p12file, p12password);
            demo.run();

            final PushRESTDemo demo3 = new PushRESTDemo(serviceId, p12file, p12password);
            demo3.run();

            final SealRESTDemo demo4 = new SealRESTDemo(serviceId, p12file, p12password);
            demo4.run();
        } catch (final Exception e) {
            e.printStackTrace();
            return;
        }
    }
}