package com.inwebo.api.sample;

import com.inwebo.console.ConsoleAdmin;
import com.inwebo.console.ConsoleAdminService;
import com.inwebo.console.LoginCreateResult;
import com.inwebo.console.LoginQueryResult;
import com.inwebo.console.LoginSearchResult;
import com.inwebo.console.LoginsQueryResult;

public class ProvisioningDemo {
    private static final String LOGIN_DEMO = "foobar";
    private static final String FIRSTNAME_DEMO = "Joe";
    private static final String LASTNAME_DEMO = "Foobar";

    private static final String LOGIN_DEMO_2 = "foobar2";

    private static final String LOGIN_DEMO_3 = "foobar3";

    private final ConsoleAdmin consoleAdmin;
    private final int serviceId;

    /**
     * Initialize console Admin client service client
     *
     * @param serviceId Id of your service
     */
    public ProvisioningDemo(int serviceId) {
        final ConsoleAdminService cas = new ConsoleAdminService();
        consoleAdmin = cas.getConsoleAdmin();
        this.serviceId = serviceId;
    }

    /**
     * Query list of logins and display users' info.
     */
    public void loginsQueryDemo() {
        int offset = 0;
        int nmax = 5;
        long count = 0;
        int n = 0;

        System.out.println("\nloginsQueryDemo");

        do {
            final LoginsQueryResult result = consoleAdmin.loginsQuery(0, serviceId, offset, (int) nmax, 1);

            String err = result.getErr();
            if (!err.equalsIgnoreCase("ok")) {
                System.out.println("Error: return code: " + err);
                return;
            }

            n = result.getN();
            count = result.getCount();
            System.out.println("Nb result=" + n + "/" + count);

            final UserList users = new UserList(result);
            System.out.println("Users:" + users.toString());

            offset += n;
        } while (offset < count);
    }

    /**
     * Search for login "foobar"
     *
     * @return Id or 0
     */
    public long loginSearchDemo() {
        int offset = 0;
        int nmax = 1;
        int sort = 1;
        int exactmatch = 1;

        System.out.println("\nSearch for " + LOGIN_DEMO);

        final LoginSearchResult result = consoleAdmin.loginSearch(0, serviceId, LOGIN_DEMO, exactmatch, offset, nmax, sort);

        final String err = result.getErr();
        if (!err.equalsIgnoreCase("ok")) {
            System.out.println("Error: return code: " + err);
            return 0;
        }

        int n = result.getN();
        System.out.println("Found " + n + " logins");
        if (n > 0) {
            final UserList users = new UserList(result);
            System.out.println(users);
            User user = users.get(0);
            if (user != null) {
                return user.getId();
            }
        }
        return 0;
    }

    /**
     * Create login " foobar"
     *
     * @param loginDemo
     * @param Codetype
     * @param returnedValue
     * @return Id or 0
     */
    public long loginCreateDemo(String loginDemo, long Codetype, String returnedValue) {
        long status = 0; // 0=active, 1=inactive
        long role = 0; // 0=user, 1=manager, 2=administrator
        long access = 0; // 0 = no bookmark, 1 = with bookmark
        long codetype = 0; // 0 = 15 minute code, 1 = 3 week code, 2 = 3 week link
        String firstname = "J";
        String lastname = "F";
        String mail = "jf@acme.com";
        String phone = "";
        String lang = "fr";
        String extrafield = "";

        System.out.println("\nCreate " + loginDemo);

        final LoginCreateResult result = consoleAdmin.loginCreate(0,
                                                                  serviceId,
                                                                  LOGIN_DEMO,
                                                                  firstname,
                                                                  lastname,
                                                                  mail,
                                                                  phone,
                                                                  status,
                                                                  role,
                                                                  access,
                                                                  codetype,
                                                                  lang,
                                                                  extrafield);

        final String err = result.getErr();
        if (!err.equalsIgnoreCase("ok")) {
            System.out.println("Error: return code: " + err);
            return 0;
        }

        if ("id".equals(returnedValue)) {
            return result.getId();
        } else if ("code".equals(returnedValue)) {
            return Long.parseLong(result.getCode());
        }

        return 0;
    }

    /**
     * Query login info for a user
     *
     * @param id of the user
     */
    public void loginQueryDemo(long id) {
        System.out.println("\nQuery for id " + id);

        final LoginQueryResult result = consoleAdmin.loginQuery(0, (int) id);
        final User user = new User(result);
        System.out.println(user);
    }

    /**
     * Update login info for a user
     *
     * @param id of the user
     */
    public void loginUpdateDemo(long id) {

        long status = 0; // 0=active, 1=inactive
        long role = 0; // 0=user, 1=manager, 2=administrator
        String firstname = "Joe";
        String lastname = "Foobar";
        String mail = "joe.foobar@acme.com";
        String phone = "+33 1 23 45 67 89";
        String extrafield = "";
        String login = LOGIN_DEMO;

        System.out.println("\nUpdate id " + id);

        final String result = consoleAdmin.loginUpdate(0, serviceId, id, login, firstname, lastname,
                                                       mail, phone, status, role, extrafield);

        System.out.println("Return: " + result);

    }

    public void loginAddDevice(Long id) {

        System.out.println("\nAddDevice id " + id);

        final String result = consoleAdmin.loginAddDevice(0, serviceId, id, 0);

        System.out.println("Return: " + result);

    }

    public void loginResetPinCounter(Long id) {

        System.out.println("\nResetPINCounter id " + id);

        final String result = consoleAdmin.loginResetPINErrorCounter(0, serviceId, id);

        System.out.println("Return: " + result);

    }

    public void loginResetPwdDemo(Long id) {

        System.out.println("\nReset Pwd id " + id);

        final String result = consoleAdmin.loginResetPwdExtended(0, serviceId, id, 0);

        System.out.println("Return: " + result);

    }

    /**
     * Delete a user.
     *
     * @param id of the user
     */
    public void loginDeleteDemo(long id) {
        System.out.println("\nDelete id " + id);

        final String result = consoleAdmin.loginDelete(0, serviceId, id);
        System.out.println("Return: " + result);

    }

    /**
     * Get login activation code & info from a long code.
     * A longcode is a 3 week temporary code
     * To get a long code, do a login create with a codetype 2. The long
     * code is returned by the loginCreate function.
     * If you create a login with a valid email, you can chain a loginCreate
     * with a codetype 2 with a loginSendByMail. An activation link with a
     * longcode will be sent to the newly created login (see demo function
     * below)
     */
    public void loginFromLinkDemo() {
        System.out.println("\nloginGetCodeFromLink");

        final long _longCode = loginCreateDemo(LOGIN_DEMO_2, 2, "code");

        if (_longCode == 0) {
            return;
        }

        final String longCode = Long.toString(_longCode);

        final String result = consoleAdmin.loginGetCodeFromLink(longCode);

        if (result.equalsIgnoreCase("nok")) {
            System.out.println("\nError: return code: " + result);
        } else {
            System.out.println("\nloginGetCodeFromLink activation code of the login is: " + result);
        }

        System.out.println("\nloginGetInfoFromLinkDemo");

        final LoginCreateResult info = consoleAdmin.loginGetInfoFromLink(longCode);

        String err = info.getErr();
        if (!err.equalsIgnoreCase("ok")) {
            System.out.println("\nError: return code: " + err);
        } else {
            System.out.println("\nloginsGetInfoFromLink activation code of the login is: " + info.getCode());
            System.out.println("\nloginsGetInfoFromLink login ID is: " + info.getId());
        }
    }

    /**
     * Allows to send an email to a newly created login.
     * The email is sent by inWebo platform. The content of the email can be
     * customized in inWebo administration console         *
     */
    public void loginSendByMailDemo() {

        System.out.println("\nloginSendByMailDemo");

        //LOGIN CREATE
        //Dont forget to change the email to a valid one in the
        //loginCreateDemo
        final long id = loginCreateDemo(LOGIN_DEMO_3, 2, "id");

        if (id == 0) {
            return;
        }

        //SENDING ACTIVATION EMAIL
        final String result = consoleAdmin.loginSendByMail(0, serviceId, id);

        if (result.equalsIgnoreCase("nok")) {
            System.out.println("\nError: return code: " + result);
        } else {
            System.out.println("\nloginSendByMailDemo: activation email successfully sent");
        }

    }

    /**
     * Run the demos.
     */
    public void run() {
        loginsQueryDemo();
        Long id = loginSearchDemo();
        if (id == 0) {
            id = loginCreateDemo(LOGIN_DEMO, 0, "id");
            id = loginSearchDemo();
        }
        if (id != 0) {
            loginUpdateDemo(id);
            loginQueryDemo(id);
            loginResetPwdDemo(id);
            loginResetPinCounter(id);
            loginAddDevice(id);
            loginDeleteDemo(id);
            loginFromLinkDemo();
        }
    }
}