package org.example.service;

import org.example.model.User;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    public User getCurrentUser() {
        // 这里应该实现获取当前登录用户的逻辑
        // 为了演示，我们返回一个模拟的用户对象
        return new User(
            "EMPLOYEE",
            "EMP001",
            "张三",
            "张",
            "三",
            "zhangsan@example.com"
        );
    }

    public void logout() {
        // 实现登出逻辑
        // 例如，清除会话、令牌等
    }
}