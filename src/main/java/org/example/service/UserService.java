package org.example.service;


import org.example.model.UserDetail;

public interface UserService {

    UserDetail loadUserByEmployeeId(String employeeId);
}
