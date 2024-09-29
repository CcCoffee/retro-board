package org.example.controller;

import org.example.dto.UserDTO;
import org.example.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @RequestMapping("/loginSuccess")
    public UserDTO loginSuccess() {
        // 获取当前登录用户的 UserDetail
        return loginService.getCurrentUser();
    }

    @RequestMapping("/logoutSuccess")
    public ResponseEntity<String> logoutSuccess() {
        loginService.logout();
        return ResponseEntity.ok("Logout successful");
    }

    @RequestMapping("/loginFail")
    public ResponseEntity<String> loginFail() {
        return ResponseEntity.badRequest().body("Login failed");
    }
}