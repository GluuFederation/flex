package com.inwebo.api.sample;

import com.inwebo.authentication.CheckPushResult;
import com.inwebo.authentication.PushAuthenticate;
import org.json.simple.JSONObject;

import java.util.Scanner;

public class PushRESTDemo {

    private int serviceId;
    private String p12file;
    private String p12password;

    public PushRESTDemo(int serviceId, String p12file, String p12password) {
        this.serviceId = serviceId;
        this.p12file = p12file;
        this.p12password = p12password;
    }

    public void pushRESTDemo() {
        try (final Scanner sc = new Scanner(System.in)) {
            System.out.println("\nAsk Push notification ");

            System.out.println("Login? ");
            final String login = sc.nextLine();

            final PushAuthenticate pa = new PushAuthenticate(serviceId, p12file, p12password);
            JSONObject result = pa.pushAuthenticate(login);

            System.out.println("result: " + result.toJSONString());

            final String sessionId = (String) result.get("sessionId");
            System.out.println("sessionId: " + sessionId);

            final CheckPushResult cr = new CheckPushResult(serviceId, p12file, p12password);
            if (sessionId == null) {
                System.out.println("no session id: " + result.get("err"));
                return;
            }
            while (true) {
                result = cr.checkPushResult(login, sessionId);
                if (!result.get("err").equals("NOK:WAITING")) {
                    break;
                }
                try {
                    System.out.println("request pending...  " + result);
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("result:" + result.get("err"));
        }
    }

    public void run() {
        pushRESTDemo();
    }
}
