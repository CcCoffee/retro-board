package org.example.config;

import org.example.model.UserDetail;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.ldap.core.AttributesMapper;

import java.util.List;

public class CustomUserDetailsService implements UserDetailsService {

    private final LdapTemplate ldapTemplate;

    public CustomUserDetailsService(LdapTemplate ldapTemplate, LdapContextSource ldapContextSource) {
        this.ldapTemplate = ldapTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new EqualsFilter("uid", username));

        List<UserDetail> users = ldapTemplate.search("ou=people", filter.encode(),
                (AttributesMapper<UserDetail>) attrs -> new UserDetail(
                        (String) attrs.get("employeeType").get(),
                        (String) attrs.get("employeeNumber").get(),
                        (String) attrs.get("displayName").get(),
                        (String) attrs.get("givenName").get(),
                        (String) attrs.get("sn").get(),
                        (String) attrs.get("mail").get(),
                        null,  // 密码字段设为null，因为LDAP通常不会返回密码
                        null   // 角色字段设为null，如果需要可以后续处理
                ));

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return users.get(0);
    }
}