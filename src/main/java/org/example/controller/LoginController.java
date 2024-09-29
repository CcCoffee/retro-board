package org.example.controller;

import org.example.model.User;
import org.example.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/loginSuccess")
    public ResponseEntity<User> loginSuccess() {
        User user = loginService.getCurrentUser();
        return ResponseEntity.ok(user);
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