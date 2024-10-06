package org.example.util;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserUtil {

    public UserDTO getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetail) {
            return mapUserDetailToDTO((UserDetail) principal);
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
    }

    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    public UserDTO mapUserDetailToDTO(UserDetail userDetail) {
        return new UserDTO(
            userDetail.getEmployeeNumber(),
            userDetail.getUsername(),
            userDetail.getMail()
        );
    }
}