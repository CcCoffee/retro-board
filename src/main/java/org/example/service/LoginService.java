package org.example.service;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    public UserDTO getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetail) {
            return mapUserDetailToDTO((UserDetail) principal);
        } else if (principal instanceof User) {
            User user = (User) principal;
            // 根据 user.getUsername() 查询数据库获取用户名，头像和邮箱
            return new UserDTO(
                user.getUsername(),
                user.getUsername(), // 使用用户名作为显示名称
                null, // 没有头像
                user.getUsername().toLowerCase().replaceAll("\\s", "-").concat("@example.com")  // 没有邮箱
            );
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
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