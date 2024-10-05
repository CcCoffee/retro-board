package org.example.model;

import java.io.Serializable;

public class UserDetail implements Serializable {
    private String employeeType;
    private String employeeId;
    private String displayName;
    private String firstName;
    private String lastName;
    private String avatar;
    private String email;

    public UserDetail(String employeeType, String employeeId, String displayName, String firstName, String lastName, String email, String password, String role) {
        this.employeeType = employeeType;
        this.employeeId = employeeId;
        this.displayName = displayName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return "https://avatars.example.com/" + employeeId + ".png";
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmployeeType() {
        return employeeType;
    }

    public void setEmployeeType(String employeeType) {
        this.employeeType = employeeType;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}