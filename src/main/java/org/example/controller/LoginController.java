package org.example.controller;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.example.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @GetMapping("/loginSuccess")
    public UserDTO loginSuccess() {
        UserDetail userDetail = loginService.getCurrentUser(); // 获取当前登录用户的 UserDetail
        return loginService.mapUserDetailToDTO(userDetail);
    }

    @GetMapping("/logoutSuccess")
    public ResponseEntity<String> logoutSuccess() {
        loginService.logout();
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/loginFail")
    public ResponseEntity<String> loginFail() {
        return ResponseEntity.badRequest().body("Login failed");
    }
}