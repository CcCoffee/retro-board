package org.example.controller;

import org.example.dto.UserDTO;
import org.example.util.LoginUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginUserUtil loginUserUtil;

    @RequestMapping("/loginSuccess")
    public UserDTO loginSuccess() {
        // 获取当前登录用户的 UserDetail
        return loginUserUtil.getCurrentUser();
    }

    @RequestMapping("/logoutSuccess")
    public ResponseEntity<String> logoutSuccess() {
        loginUserUtil.logout();
        return ResponseEntity.ok("Logout successful");
    }

    @RequestMapping("/loginFail")
    public ResponseEntity<String> loginFail() {
        return ResponseEntity.badRequest().body("Login failed");
    }
}