package com.inwebo.api.sample;

import com.inwebo.authentication.SealVerify;

import java.util.Scanner;

public class SealRESTDemo {

    private int serviceId;
    private String p12file;
    private String p12password;

    public SealRESTDemo(int serviceId, String p12file, String p12password) {
        this.serviceId = serviceId;
        this.p12file = p12file;
        this.p12password = p12password;
    }

    public void sealRESTDemo() {
        try (final Scanner sc = new Scanner(System.in)) {

            System.out.println("\nSeal ");

            System.out.println("Login? ");
            final String login = sc.nextLine();

            System.out.println("OTP? ");
            final String token = sc.nextLine();

            System.out.println("Data? ");
            final String data = sc.nextLine();

            final SealVerify sv = new SealVerify(serviceId, p12file, p12password);
            final String result = sv.seal(login, token, data);
            if (result.equals("OK")) {
                System.out.println("Authentication successful");
            } else {
                System.out.println("result: " + result);
            }
        }
    }

    public void run() {
        sealRESTDemo();
    }
}