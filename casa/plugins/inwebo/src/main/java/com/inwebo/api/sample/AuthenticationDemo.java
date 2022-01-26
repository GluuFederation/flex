package com.inwebo.api.sample;

import com.inwebo.service.Authentication;
import com.inwebo.service.AuthenticationService;

import java.util.Scanner;


public class AuthenticationDemo {

    private Authentication authWS;
    private int serviceId;

    public AuthenticationDemo(int serviceId) {
        AuthenticationService as = new AuthenticationService();
        authWS = as.getAuthentication();
        this.serviceId = serviceId;
    }

    public void authenticateDemo() {
        try (final Scanner sc = new Scanner(System.in)) {
            System.out.println("\nAuthenticate ");

            System.out.println("Login? ");
            final String login = sc.nextLine();

            System.out.println("OTP? ");
            final String token = sc.nextLine();

            final String result = authWS.authenticate(login, String.valueOf(serviceId), token);
            System.out.println("Return: " + result);
        }
    }

    public void run() {
        authenticateDemo();
    }
}
