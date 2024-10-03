package org.example.service.impl;

import org.example.model.UserDetail;
import org.example.service.UserService;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final List<UserDetail> users = Arrays.asList(
        new UserDetail("EMPLOYEE", "E001", "张三", "", "", "zhangsan@example.com", "/E001.svg?height=32&width=32", null),
        new UserDetail("EMPLOYEE", "E002", "李四", "", "", "lisi@example.com", "/E002.svg?height=32&width=32", null),
        new UserDetail("EMPLOYEE", "E003", "王五", "", "", "wangwu@example.com", "/E003.svg?height=32&width=32", null),
        new UserDetail("EMPLOYEE", "E004", "赵六", "", "", "zhaoliu@example.com", "/E004.svg?height=32&width=32", null),
        new UserDetail("EMPLOYEE", "E005", "钱七", "", "", "qianqi@example.com", "/E005.svg?height=32&width=32", null)
    );

    @Override
    public UserDetail loadUserByEmployeeId(String employeeId) {
        return users.stream()
                .filter(user -> user.getEmployeeId().equals(employeeId))
                .findFirst()
                .orElse(null);
    }
}
