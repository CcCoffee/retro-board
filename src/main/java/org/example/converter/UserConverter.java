package org.example.converter;

import org.example.dto.UserDTO;
import org.example.model.UserDetail;

public class UserConverter {

    public static UserDTO toDTO(UserDetail userDetail) {
        return new UserDTO(
                userDetail.getEmployeeNumber(),
                userDetail.getUsername(),
                userDetail.getMail()
        );
    }
}
