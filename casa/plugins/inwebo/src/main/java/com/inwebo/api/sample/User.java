package com.inwebo.api.sample;

import com.inwebo.support.Util;

public class User {
    public static int CREATED_BY_CONSOLE = 0;
    public static int CREATED_BY_API = 1;

    private Long id;
    private String login;
    private Long status;
    private Long role;
    private String firstname;
    private String name;
    private String mail;
    private String extrafield;
    private String code;
    private Long createdBy;

    /**
     * Constructor
     */
    public User() {
    }

    public User(Object result) {
        id = (Long) Util.callIfExists("getId", result);
        login = (String) Util.callIfExists("getLogin", result);
        name = (String) Util.callIfExists("getName", result);
        firstname = (String) Util.callIfExists("getFirstname", result);
        mail = (String) Util.callIfExists("getMail", result);
        status = (Long) Util.callIfExists("getStatus", result);
        role = (Long) Util.callIfExists("getRole", result);
        extrafield = (String) Util.callIfExists("getExtrafield", result);
        code = (String) Util.callIfExists("getCode", result);
        createdBy = (Long) Util.callIfExists("getCreatedBy", result);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public long getStatus() {
        return status;
    }

    public void setStatus(long status) {
        this.status = status;
    }

    public long getRole() {
        return role;
    }

    public void setRole(long role) {
        this.role = role;
    }

    public String getFirstname() {
        if (firstname == null) {
            return "";
        } else {
            return firstname;
        }
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getName() {
        if (name == null) {
            return "";
        } else {
            return name;
        }
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMail() {
        if (mail == null) {
            return "";
        } else {
            return mail;
        }
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getExtrafield() {
        if (extrafield == null) {
            return "";
        } else {
            return extrafield;
        }
    }

    public void setExtrafield(String extrafield) {
        this.extrafield = extrafield;
    }

    public String getCode() {
        if (code == null) {
            return code = "";
        } else {
            return code;
        }
    }

    public void setCode(String code) {
        this.code = code;
    }

    public long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(long createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "User:[id=" + id + ", login=" + login + ", status=" + status + ", role=" + role + ", firstname=" + firstname
               + ", name=" + name + ", mail=" + mail + ", extrafield=" + extrafield + ", code=" + code + ", createdby=" + createdBy + "]";
    }

}
