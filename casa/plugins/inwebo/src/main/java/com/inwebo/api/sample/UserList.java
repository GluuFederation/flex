package com.inwebo.api.sample;

import com.inwebo.support.Util;

import java.util.ArrayList;
import java.util.List;


public class UserList extends ArrayList<User> {

    /**
     *
     */
    private static final long serialVersionUID = -6265810926004552026L;

    @SuppressWarnings("unchecked")
    public UserList(Object result) {
        super();
        List<Long> ids = (List<Long>) Util.callIfExists("getId", result);
        List<String> logins = (List<String>) Util.callIfExists("getLogin", result);
        List<String> names = (List<String>) Util.callIfExists("getName", result);
        List<String> firstnames = (List<String>) Util.callIfExists("getFirstname", result);
        List<String> mails = (List<String>) Util.callIfExists("getMail", result);
        List<Long> resultstatus = (List<Long>) Util.callIfExists("getStatus", result);
        List<Long> roles = (List<Long>) Util.callIfExists("getRole", result);
        List<String> extrafields = (List<String>) Util.callIfExists("getExtrafield", result);
        List<String> codes = (List<String>) Util.callIfExists("getCode", result);
        List<Long> createdBy = (List<Long>) Util.callIfExists("getCreatedBy", result);

        if (null == ids) {
            return;
        }
        for (int i = 0; i < ids.size(); i++) {
            if ((Long) (ids.get(i)) == 0) {
                continue;
            }

            User user = new User();
            user.setId(ids.get(i));
            if (logins != null) {
                user.setLogin(logins.get(i));
            }
            if (names != null) {
                user.setName(names.get(i));
            }
            if (firstnames != null) {
                user.setFirstname(firstnames.get(i));
            }
            if (mails != null) {
                user.setMail(mails.get(i));
            }
            if (resultstatus != null) {
                user.setStatus(resultstatus.get(i));
            }
            if (roles != null) {
                user.setRole(roles.get(i));
            }
            if (extrafields != null) {
                user.setExtrafield(extrafields.get(i));
            }
            if (codes != null) {
                user.setCode(codes.get(i));
            }
            if (createdBy != null) {
                user.setCreatedBy(createdBy.get(i));
            }
            this.add(user);
        }
    }

    public static UserList FromLoginsResult(Object result) {
        if (result == null) {
            return null;
        }
        return new UserList(result);
    }

}
