package org.example.service.impl;

import org.example.model.UserDetail;
import org.example.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public UserDetail loadUserByEmployeeId(String employeeId) {
        return new UserDetail("EMPLOYEE", employeeId, employeeId, "", "", employeeId.toLowerCase().replaceAll("\\s", "-").concat("@example.com"), null, null);
    }
}
