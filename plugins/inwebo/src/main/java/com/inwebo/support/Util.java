package com.inwebo.support;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.security.KeyStore;
import java.security.SecureRandom;

public final class Util {

    private Util() {

    }

    public static void activeSoapLog(boolean active) {
        if (active) {
            //   LOG SOAP:
            System.setProperty("com.sun.xml.ws.transport.http.client.HttpTransportPipe.dump", "true");
            System.setProperty("com.sun.xml.internal.ws.transport.http.client.HttpTransportPipe.dump", "true");
            System.setProperty("com.sun.xml.ws.transport.http.HttpAdapter.dump", "true");
            System.setProperty("com.sun.xml.internal.ws.transport.http.HttpAdapter.dump", "true");
        }
    }

    /**
     * Invoke the method from an object if it exists.
     *
     * @param method Name of the method
     * @param obj    Object containing the method
     * @return Object returned by the method or null
     */
    public static Object callIfExists(final String method, final Object obj) {
        final Class<?> resultClass = obj.getClass();
        Object field = null;
        Method func;
        // Let's check if the method exist and get its value;
        try {
            func = resultClass.getDeclaredMethod(method);
            field = func.invoke(obj);
        } catch (final Exception e) {
        }
        return field;
    }


    /**
     * Set the client certificate to Default SSL Context
     *
     * @param certificateFile File containing certificate (PKCS12 format)
     * @param certPassword    Password of certificate
     * @throws Exception
     */
    public static SSLContext setHttpsClientCert(final String certificateFile, final String certPassword) throws Exception {
        if (certificateFile == null || !new File(certificateFile).exists()) {
            return null;
        }
        final KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
        KeyStore keyStore = KeyStore.getInstance("PKCS12");

        try (final InputStream keyInput = new FileInputStream(certificateFile)) {
            keyStore.load(keyInput, certPassword.toCharArray());

            keyInput.close();
            keyManagerFactory.init(keyStore, certPassword.toCharArray());

            final SSLContext context = SSLContext.getInstance("TLS");
            context.init(keyManagerFactory.getKeyManagers(), null, new SecureRandom());
            SSLContext.setDefault(context);
            HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());

            return context;
        }
    }
}
