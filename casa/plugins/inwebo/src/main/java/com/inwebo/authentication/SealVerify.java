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


public class SealVerify {
    private static final String HTTPS_API_MYINWEBO_COM = "https://api.myinwebo.com/FS?";
    private SSLContext context = null;
    private int serviceId;
    private String p12file;
    private String p12password;

    public SealVerify(int id, String p12file, String p12password) {
        this.serviceId = id;
        this.p12file = p12file;
        this.p12password = p12password;
    }

    /**
     * Prompt for a login and an OTP and check if they are OK.
     */
    public String seal(String login, String token, String data) {
        String urlParameters;
        try {
            urlParameters = "action=sealVerify"
                            + "&serviceId=" + URLEncoder.encode("" + serviceId, "UTF-8")
                            + "&userId=" + URLEncoder.encode(login, "UTF-8")
                            + "&token=" + URLEncoder.encode(token, "UTF-8")
                            + "&data=" + URLEncoder.encode(data, "UTF-8")
                            + "&format=json";
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
            return "NOK:urlParams";
        }
        try {
            if (this.context == null) {
                this.context = Util.setHttpsClientCert(this.p12file, this.p12password);
            }
            SSLSocketFactory sslsocketfactory = context.getSocketFactory();
            URL url = new URL(HTTPS_API_MYINWEBO_COM + urlParameters);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setSSLSocketFactory(sslsocketfactory);

            conn.setRequestMethod("GET");
            InputStream is = conn.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(br);
            return json.toJSONString();


        } catch (Exception e) {
            e.printStackTrace();
            return "NOK:connection";
        }
    }

}
