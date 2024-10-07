package org.example.controller;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.example.service.LdapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private LdapService ldapService;

    @GetMapping("/{employeeNumber}")
    public UserDetail getUserByEmployeeNumber(@PathVariable("employeeNumber") String employeeNumber) {
        return ldapService.getUserByEmployeeNumber(employeeNumber);
    }

    @GetMapping("/search")
    public List<UserDTO> searchUsers(@RequestParam("query") String query) {
        return ldapService.searchUsers(query);
    }
    
}
