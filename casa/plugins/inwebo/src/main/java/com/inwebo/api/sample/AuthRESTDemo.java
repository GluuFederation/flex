package com.inwebo.api.sample;

import com.inwebo.authentication.AuthenticateExtended;
import org.json.simple.JSONObject;

import java.util.Scanner;

public class AuthRESTDemo {

    private int serviceId;
    private String p12file;
    private String p12password;

    public AuthRESTDemo(int serviceId, String p12file, String p12password) {
        this.serviceId = serviceId;
        this.p12file = p12file;
        this.p12password = p12password;
    }

    public void authRESTDemo() {
        try (final Scanner sc = new Scanner(System.in)) {
            System.out.println("\nAuthenticate ");

            System.out.println("Login? ");
            final String login = sc.nextLine();

            System.out.println("OTP? ");
            final String token = sc.nextLine();

            AuthenticateExtended auth = new AuthenticateExtended(serviceId, p12file, p12password);
            JSONObject result = auth.authenticate(login, token);
            if (result.get("err").equals("OK")) {
                System.out.println("Authentication successful");
            } else {
                System.out.println("result: " + result.get("err"));
            }
        }
    }

    public void run() {
        authRESTDemo();
    }

}