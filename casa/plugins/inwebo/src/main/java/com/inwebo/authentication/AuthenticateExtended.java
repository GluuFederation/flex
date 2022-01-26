package com.inwebo.authentication;

import com.inwebo.support.Util;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;

public class AuthenticateExtended {

    private static String urlString = "https://api.myinwebo.com/FS?";
    private SSLContext context = null;
    private int serviceId;
    private String p12file;
    private String p12password;

    public AuthenticateExtended(int id, String p12file, String p12password) {
        this.serviceId = id;
        this.p12file = p12file;
        this.p12password = p12password;
    }

    /**
     * Prompt for a login and an OTP and check if they are OK.
     */
    public JSONObject authenticate(String login, String token) {
        String urlParameters = null;
        JSONObject json = null;
        try {
            urlParameters = "action=authenticateExtended"
                            + "&serviceId=" + URLEncoder.encode("" + serviceId, "UTF-8")
                            + "&userId=" + URLEncoder.encode(login, "UTF-8")
                            + "&token=" + URLEncoder.encode(token, "UTF-8") + "&format=json";
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
            json.put("err", "NOK:params");
        }
        try {
            if (this.context == null) {
                this.context = Util.setHttpsClientCert(this.p12file, this.p12password);
            }
            SSLSocketFactory sslsocketfactory = context.getSocketFactory();
            URL url = new URL(urlString + urlParameters);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setSSLSocketFactory(sslsocketfactory);

            conn.setRequestMethod("GET");
            InputStream is = conn.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            JSONParser parser = new JSONParser();
            json = (JSONObject) parser.parse(br);

        } catch (Exception e) {
            e.printStackTrace();
            json.put("err", "NOK:connection");
        }
        return json;
    }
}
