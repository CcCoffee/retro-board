package org.example.config;

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;

import java.util.ArrayList;
import java.util.Collection;

public class CustomLdapAuthoritiesPopulator implements LdapAuthoritiesPopulator {

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData, String username) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        // 这里你可以根据LDAP中的用户信息来分配权限
        // 例如，你可以根据用户的组或其他属性来设置权限
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authorities;
    }
}