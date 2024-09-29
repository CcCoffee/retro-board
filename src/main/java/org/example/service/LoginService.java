package org.example.service;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    public UserDetail getCurrentUser() {
        return (UserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    public UserDTO mapUserDetailToDTO(UserDetail userDetail) {
        return new UserDTO(
            userDetail.getEmployeeId(),
            userDetail.getDisplayName(),
            userDetail.getAvatar(),
            userDetail.getEmail()
        );
    }
}