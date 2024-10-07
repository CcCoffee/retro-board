package org.example.service;

import org.example.converter.UserConverter;
import org.example.dto.UserDTO;
import org.example.model.UserDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.LikeFilter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LdapService {

    @Autowired
    private LdapTemplate ldapTemplate;

    /**
     * 根据员工编号精确搜索用户
     * @param employeeNumber 员工编号
     * @return 用户详情
     */
    public UserDetail getUserByEmployeeNumber(String employeeNumber) {
        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new EqualsFilter("employeeNumber", employeeNumber));
        System.out.println(filter.encode());
        List<UserDetail> userDetailList = ldapTemplate.search(
                "ou=people",
                filter.encode(),
                (AttributesMapper<UserDetail>) attrs -> new UserDetail(
                        (String) attrs.get("employeeType").get(),
                        (String) attrs.get("employeeNumber").get(),
                        (String) attrs.get("displayName").get(),
                        null,
                        List.of(),
                        (String) attrs.get("mail").get()
                )
        );
        if (userDetailList.isEmpty()) {
            return null;
        }
        return userDetailList.get(0);
    }

    /**
     * 根据员工编号模糊搜索用户
     * @param employeeNumber 员工编号
     * @return 用户列表
     */
    public List<UserDTO> searchUsersByEmployeeNumber(String employeeNumber) {
        if (employeeNumber == null || employeeNumber.length() <= 2) {
            return List.of(); // 如果employeeNumber为null或长度不大于2，返回空列表
        }

        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new LikeFilter("employeeNumber", employeeNumber + "*")); // 使用LikeFilter进行模糊查询

        List<UserDetail> userDetailList = ldapTemplate.search(
                "ou=people",
                filter.encode(),
                (AttributesMapper<UserDetail>) attrs -> new UserDetail(
                        (String) attrs.get("employeeType").get(),
                        (String) attrs.get("employeeNumber").get(),
                        (String) attrs.get("displayName").get(),
                        null,
                        List.of(),
                        (String) attrs.get("mail").get()
                )
        );
        if (userDetailList.isEmpty()) {
            return List.of();
        }
        return userDetailList.stream().limit(3).map(UserConverter::toDTO).collect(Collectors.toList());
    }
}